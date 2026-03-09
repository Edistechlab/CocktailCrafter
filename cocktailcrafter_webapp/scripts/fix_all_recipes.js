/**
 * fix_all_recipes.js
 *
 * Repairs all broken bottle IDs in the recipe JSON field of the Cocktail table.
 * Steps:
 *  1. Identify all broken bottleId references (IDs that do not exist in Bottle table)
 *  2. Map old IDs -> correct Bottle IDs via name lookup + known name mappings
 *  3. INSERT missing bottles that cannot be found by name
 *  4. Update every Cocktail.recipe with corrected IDs and names
 *  5. Verify zero broken IDs remain
 */

const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.resolve(__dirname, '../prisma/dev.db');
const db = new Database(DB_PATH);

// ─── Known name mappings (old ingredient name → correct DB bottle name) ─────
const NAME_MAPPINGS = {
  'bourbon whiskey': 'Bourbon',
  'scotch whisky':   'Scotch Single Malt',   // Godfather uses blended scotch character, but "Scotch Whisky" maps per spec
  'tequila blanco':  'Tequila',
  'blended scotch':  'Scotch Blended',
  // Kahlua -> Coffee Liqueur (existing DB entry)
  'kahlua':          'Coffee Liqueur',
  // Angostura Bitters -> Angostura Aromatic Bitters
  'angostura bitters': 'Angostura Aromatic Bitters',
};

// ─── Bottles to CREATE if still not found ────────────────────────────────────
const BOTTLES_TO_CREATE = [
  { id: 'fix_cachaca_001',          name: 'Cachaça',                alcoholContent: 40,   sugarContent: 0,  acidity: 0,   category: 'Rum',           type: 'Rum'           },
  { id: 'fix_cola_001',             name: 'Cola',                   alcoholContent: 0,    sugarContent: 42, acidity: 0.8, category: 'Soft Drink',    type: 'Soft Drink'    },
  { id: 'fix_dry_vermouth_001',     name: 'Dry Vermouth',           alcoholContent: 18,   sugarContent: 4,  acidity: 0,   category: 'Vermouth',      type: 'Vermouth'      },
  { id: 'fix_soda_water_001',       name: 'Soda Water',             alcoholContent: 0,    sugarContent: 0,  acidity: 0.1, category: 'Soft Drink',    type: 'Soft Drink'    },
  { id: 'fix_prosecco_001',         name: 'Prosecco',               alcoholContent: 11,   sugarContent: 8,  acidity: 0.4, category: 'Sparkling Wine',type: 'Sparkling Wine'},
  { id: 'fix_coffee_liqueur_001',   name: 'Coffee Liqueur (Kahlua)',alcoholContent: 20,   sugarContent: 45, acidity: 0,   category: 'Liqueur',       type: 'Liqueur'       },
  { id: 'fix_angostura_bitters_01', name: 'Angostura Bitters',      alcoholContent: 44.7, sugarContent: 0,  acidity: 0,   category: 'Bitters',       type: 'Bitters'       },
  { id: 'fix_lillet_blanc_001',     name: 'Lillet Blanc',           alcoholContent: 17,   sugarContent: 12, acidity: 0,   category: 'Aperitif Wine', type: 'Aperitif Wine' },
  { id: 'fix_creme_violette_001',   name: 'Crème de Violette',      alcoholContent: 16,   sugarContent: 30, acidity: 0,   category: 'Liqueur',       type: 'Liqueur'       },
  { id: 'fix_overproof_rum_001',    name: 'Overproof Rum',          alcoholContent: 63,   sugarContent: 0,  acidity: 0,   category: 'Rum',           type: 'Rum'           },
  { id: 'fix_grapefruit_juice_01',  name: 'Grapefruit Juice',       alcoholContent: 0,    sugarContent: 7,  acidity: 1.2, category: 'Juice',         type: 'Juice'         },
  { id: 'fix_apricot_liqueur_001',  name: 'Apricot Liqueur',        alcoholContent: 25,   sugarContent: 25, acidity: 0,   category: 'Liqueur',       type: 'Liqueur'       },
  { id: 'fix_coconut_cream_001',    name: 'Coconut Cream',          alcoholContent: 0,    sugarContent: 15, acidity: 0,   category: 'Syrup',         type: 'Syrup'         },
  { id: 'fix_cream_001',            name: 'Cream',                  alcoholContent: 0,    sugarContent: 3,  acidity: 0,   category: 'Syrup',         type: 'Syrup'         },
  { id: 'fix_cointreau_001',        name: 'Cointreau',              alcoholContent: 40,   sugarContent: 24, acidity: 0,   category: 'Liqueur',       type: 'Liqueur'       },
  { id: 'fix_benedictine_001',      name: 'Benedictine',            alcoholContent: 40,   sugarContent: 28, acidity: 0,   category: 'Liqueur',       type: 'Liqueur'       },
  { id: 'fix_pisco_001',            name: 'Pisco',                  alcoholContent: 42,   sugarContent: 0,  acidity: 0,   category: 'Brandy',        type: 'Brandy'        },
];

// ─── Helper: build lookup maps ────────────────────────────────────────────────
function buildBottleMaps() {
  const rows = db.prepare('SELECT id, name FROM Bottle').all();
  const byId   = new Map(rows.map(r => [r.id, r]));
  const byName = new Map(rows.map(r => [r.name.toLowerCase().trim(), r]));
  return { byId, byName };
}

// ─── Step 1: find all broken bottleIds across all cocktail recipes ─────────────
function findBrokenIds(byId) {
  const cocktails = db.prepare('SELECT id, name, recipe FROM Cocktail').all();
  const broken = new Map(); // bottleId -> { ingredientName, cocktails[] }

  for (const cocktail of cocktails) {
    let recipe;
    try { recipe = JSON.parse(cocktail.recipe); } catch { continue; }
    if (!Array.isArray(recipe)) continue;

    for (const ing of recipe) {
      if (!ing.bottleId) continue;
      if (!byId.has(ing.bottleId)) {
        if (!broken.has(ing.bottleId)) {
          broken.set(ing.bottleId, { ingredientName: ing.name, cocktails: [] });
        }
        broken.get(ing.bottleId).cocktails.push(cocktail.name);
      }
    }
  }
  return broken;
}

// ─── Step 2+3: resolve broken IDs → correct DB bottle ────────────────────────
function resolveMapping(broken, byName) {
  // Insert missing bottles first (INSERT OR IGNORE)
  const insertStmt = db.prepare(`
    INSERT OR IGNORE INTO Bottle (id, name, category, type, alcoholContent, sugarContent, acidity, createdAt, updatedAt)
    VALUES (@id, @name, @category, @type, @alcoholContent, @sugarContent, @acidity, datetime('now'), datetime('now'))
  `);

  const insertedBottles = [];
  for (const b of BOTTLES_TO_CREATE) {
    const result = insertStmt.run(b);
    if (result.changes > 0) {
      insertedBottles.push(b.name);
    }
  }
  if (insertedBottles.length > 0) {
    console.log(`\nInserted ${insertedBottles.length} new bottle(s): ${insertedBottles.join(', ')}`);
  }

  // Rebuild maps after insertion
  const { byId: byId2, byName: byName2 } = buildBottleMaps();

  // Now resolve each broken ID
  const resolution = new Map(); // old bottleId -> { newId, newName }
  const unresolved = [];

  for (const [oldId, info] of broken) {
    const ingName = info.ingredientName;
    const ingNameLower = ingName.toLowerCase().trim();

    // Check direct name mapping first
    const mappedName = NAME_MAPPINGS[ingNameLower];
    let target = null;

    if (mappedName) {
      target = byName2.get(mappedName.toLowerCase().trim());
    }

    // Try exact name match in DB
    if (!target) {
      target = byName2.get(ingNameLower);
    }

    if (target) {
      resolution.set(oldId, { newId: target.id, newName: target.name });
    } else {
      unresolved.push({ oldId, ingName, cocktails: info.cocktails });
    }
  }

  return { resolution, unresolved, byId: byId2, byName: byName2 };
}

// ─── Step 4: apply fixes ──────────────────────────────────────────────────────
function applyFixes(resolution) {
  const cocktails = db.prepare('SELECT id, name, recipe FROM Cocktail').all();
  const updateStmt = db.prepare('UPDATE Cocktail SET recipe = ? WHERE id = ?');
  let fixedCocktails = 0;
  let fixedIngredients = 0;

  const fixes = db.transaction(() => {
    for (const cocktail of cocktails) {
      let recipe;
      try { recipe = JSON.parse(cocktail.recipe); } catch { continue; }
      if (!Array.isArray(recipe)) continue;

      let changed = false;
      const newRecipe = recipe.map(ing => {
        if (!ing.bottleId) return ing;
        const fix = resolution.get(ing.bottleId);
        if (fix) {
          changed = true;
          fixedIngredients++;
          return { ...ing, bottleId: fix.newId, name: fix.newName };
        }
        return ing;
      });

      if (changed) {
        updateStmt.run(JSON.stringify(newRecipe), cocktail.id);
        fixedCocktails++;
        console.log(`  Fixed: ${cocktail.name}`);
      }
    }
  });

  fixes();
  return { fixedCocktails, fixedIngredients };
}

// ─── Step 5: verify ───────────────────────────────────────────────────────────
function verify() {
  const { byId } = buildBottleMaps();
  const cocktails = db.prepare('SELECT id, name, recipe FROM Cocktail').all();
  let remaining = 0;
  const remainingList = [];

  for (const cocktail of cocktails) {
    let recipe;
    try { recipe = JSON.parse(cocktail.recipe); } catch { continue; }
    if (!Array.isArray(recipe)) continue;

    for (const ing of recipe) {
      if (ing.bottleId && !byId.has(ing.bottleId)) {
        remaining++;
        remainingList.push({ cocktail: cocktail.name, bottleId: ing.bottleId, name: ing.name });
      }
    }
  }
  return { remaining, remainingList };
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
console.log('=== fix_all_recipes.js ===');
console.log(`Database: ${DB_PATH}\n`);

let { byId, byName } = buildBottleMaps();
console.log(`Bottles in DB: ${byId.size}`);

const broken = findBrokenIds(byId);
console.log(`\nStep 1: Found ${broken.size} unique broken bottle IDs across all cocktail recipes.`);
if (broken.size === 0) {
  console.log('Nothing to fix. Exiting.');
  process.exit(0);
}

console.log('\nBroken IDs:');
for (const [id, info] of broken) {
  console.log(`  ${id} -> ingredient "${info.ingredientName}" used in: ${info.cocktails.join(', ')}`);
}

console.log('\nStep 2+3: Resolving IDs and inserting missing bottles...');
const { resolution, unresolved, byId: byId2 } = resolveMapping(broken, byName);

console.log(`\nResolved: ${resolution.size} / ${broken.size}`);
for (const [oldId, fix] of resolution) {
  console.log(`  ${oldId} -> ${fix.newId} (${fix.newName})`);
}

if (unresolved.length > 0) {
  console.error('\nWARNING: Could not resolve the following broken IDs:');
  for (const u of unresolved) {
    console.error(`  ${u.oldId} ("${u.ingName}") in: ${u.cocktails.join(', ')}`);
  }
}

console.log('\nStep 4: Applying fixes...');
const { fixedCocktails, fixedIngredients } = applyFixes(resolution);
console.log(`\n  Fixed ${fixedIngredients} ingredient(s) across ${fixedCocktails} cocktail(s).`);

console.log('\nStep 5: Verifying...');
const { remaining, remainingList } = verify();
if (remaining === 0) {
  console.log('\n✓ SUCCESS: Zero broken bottle IDs remain in recipe field.');
} else {
  console.error(`\n✗ FAIL: ${remaining} broken ID(s) still remain:`);
  for (const r of remainingList) {
    console.error(`  Cocktail: ${r.cocktail}, bottleId: ${r.bottleId}, name: ${r.name}`);
  }
  process.exit(1);
}

console.log('\nDone.');
