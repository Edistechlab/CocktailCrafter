/**
 * fix_cocktails_003.js
 * Fixes recipe data for 10 cocktails + 2 bottle records in the local SQLite DB.
 * Run with: node scripts/fix_cocktails_003.js
 */

'use strict';

const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.resolve(__dirname, '../prisma/dev.db');
const db = new Database(DB_PATH);

// ── Helpers ──────────────────────────────────────────────────────────────────

function now() {
  return new Date().toISOString();
}

function setRecipe(cocktailId, recipe) {
  db.prepare('UPDATE Cocktail SET recipe = ?, updatedAt = ? WHERE id = ?')
    .run(JSON.stringify(recipe), now(), cocktailId);
}

function setBottleField(bottleId, field, value) {
  db.prepare(`UPDATE Bottle SET ${field} = ?, updatedAt = ? WHERE id = ?`)
    .run(value, now(), bottleId);
}

// ── Known IDs ─────────────────────────────────────────────────────────────────

const B = {
  GIN:                 'cmmgep3je0001o1nwu7e8off1',
  SCOTCH_SINGLE_MALT:  'cmmgep3jz0016o1nw91d4gbjl',
  SCOTCH_BLENDED:      'cmmgep3k4001oo1nwellioomj',
  TALISKER:            'cmmgep3k2001go1nw3vj7dw9a',
  TEQUILA:             'cmmgep3m1007oo1nwnu0bwiwk',
  MEZCAL:              'cmmgep3jm000ao1nwvx8o3tp6',
  VODKA:               'cmmgep3ji0005o1nw11qwqv97',
  AMARETTO:            'cmmgep3o700dyo1nwfoyh7as3',
  BOURBON:             'cmmgep3jr000io1nw2k85pm7x',
  ABSINTHE:            'cmmgep3jn000co1nwr864ucvh',
  CHAMPAGNE:           'cmmgep3p200gmo1nwz3zuw5d5',
  CREME_DE_CASSIS:     'cmmgep3oa00e8o1nwt39qicg1',
  TRIPLE_SEC:          'cmmgep3nx00d4o1nwgbkk3giv',
  APEROL:              'cmmgep3om00f8o1nwo3o2vrgk',
  MARASCHINO:          'cmmgep3ob00eao1nwu689hpe8',
  GRENADINE:           'cmmgep3qx00moo1nwitbb1r9z',
  SIMPLE_SYRUP:        'cmmgep3qv00mgo1nwc960yavi',
  HONEY_SYRUP:         'cmmgep3r400nao1nwst84zav9',
  LEMON_JUICE:         'cmmgep3pp00ioo1nwgfpska2u',
  LIME_JUICE:          'cmmgep3pr00iwo1nw8lhyzmpp',
  ORANGE_JUICE:        'cmmgep3pm00ieo1nwl3fd8emz',
  YELLOW_CHARTREUSE:   'cmmhaha03000012p6betp0tjy',
  HONEY_GINGER_SYRUP:  'cmmhaha1w0000119gw5jinwru',
  CREME_DE_MURE:       'cmmhaha3m00001ev56h2us4oi',
  GREEN_CHARTREUSE:    'cmmhaha6b0000txph3373eliv',
  DRAMBUIE:            'fix_drambuie_001',
};

// ── Cocktail IDs ──────────────────────────────────────────────────────────────

function getCocktailId(name) {
  const row = db.prepare('SELECT id FROM Cocktail WHERE name = ?').get(name);
  if (!row) throw new Error(`Cocktail not found: "${name}"`);
  return row.id;
}

// ── Run all fixes inside a single transaction ─────────────────────────────────

const runFixes = db.transaction(() => {

  // ── 0. Create new bottle: Drambuie ──────────────────────────────────────────
  console.log('0. Creating Drambuie bottle…');
  const existingDrambuie = db.prepare('SELECT id FROM Bottle WHERE id = ?').get(B.DRAMBUIE);
  if (!existingDrambuie) {
    db.prepare(`
      INSERT INTO Bottle (id, name, category, type, alcoholContent, sugarContent, acidity, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(B.DRAMBUIE, 'Drambuie', 'Liqueur', 'Liqueur', 40, 20, 0, now(), now());
    console.log('   → Drambuie created.');
  } else {
    console.log('   → Drambuie already exists, skipping insert.');
  }

  // ── 1. Fix bottle data ───────────────────────────────────────────────────────
  console.log('1. Fixing Honey-Ginger Syrup alcoholContent → 0…');
  setBottleField(B.HONEY_GINGER_SYRUP, 'alcoholContent', 0);

  console.log('1. Fixing Crème de Mûre alcoholContent → 16…');
  setBottleField(B.CREME_DE_MURE, 'alcoholContent', 16);

  // ── 2. Fix cocktail recipes ──────────────────────────────────────────────────

  // 1. Rusty Nail
  console.log('2. Rusty Nail…');
  setRecipe(getCocktailId('Rusty Nail'), [
    { bottleId: B.SCOTCH_SINGLE_MALT, name: 'Scotch Single Malt', amount: 1.5, pourOrder: 1 },
    { bottleId: B.DRAMBUIE,           name: 'Drambuie',           amount: 0.75, pourOrder: 1 },
  ]);

  // 2. Kir Royale
  console.log('2. Kir Royale…');
  setRecipe(getCocktailId('Kir Royale'), [
    { bottleId: B.CREME_DE_CASSIS, name: 'Crème de Cassis', amount: 0.5, pourOrder: 1 },
    { bottleId: B.CHAMPAGNE,       name: 'Champagne',        amount: 4,   pourOrder: 2 },
  ]);

  // 3. Screwdriver
  console.log('2. Screwdriver…');
  setRecipe(getCocktailId('Screwdriver'), [
    { bottleId: B.VODKA,        name: 'Vodka',        amount: 2, pourOrder: 1 },
    { bottleId: B.ORANGE_JUICE, name: 'Orange Juice', amount: 4, pourOrder: 2 },
  ]);

  // 4. Naked and Famous
  console.log('2. Naked and Famous…');
  setRecipe(getCocktailId('Naked and Famous'), [
    { bottleId: B.MEZCAL,            name: 'Mezcal',            amount: 0.75, pourOrder: 1 },
    { bottleId: B.YELLOW_CHARTREUSE, name: 'Yellow Chartreuse', amount: 0.75, pourOrder: 1 },
    { bottleId: B.APEROL,            name: 'Aperol',            amount: 0.75, pourOrder: 1 },
    { bottleId: B.LIME_JUICE,        name: 'Lime Juice',        amount: 0.75, pourOrder: 2 },
  ]);

  // 5. Penicillin
  console.log('2. Penicillin…');
  setRecipe(getCocktailId('Penicillin'), [
    { bottleId: B.SCOTCH_BLENDED,    name: 'Scotch Blended',    amount: 2,    pourOrder: 1 },
    { bottleId: B.LEMON_JUICE,       name: 'Lemon Juice',       amount: 0.75, pourOrder: 2 },
    { bottleId: B.HONEY_GINGER_SYRUP,name: 'Honey-Ginger Syrup',amount: 0.75, pourOrder: 2 },
    { bottleId: B.SCOTCH_SINGLE_MALT,name: 'Scotch Single Malt',amount: 0.25, pourOrder: 3 },
  ]);

  // 6. Bramble
  console.log('2. Bramble…');
  setRecipe(getCocktailId('Bramble'), [
    { bottleId: B.GIN,          name: 'Gin',          amount: 1.5, pourOrder: 1 },
    { bottleId: B.LEMON_JUICE,  name: 'Lemon Juice',  amount: 0.75, pourOrder: 2 },
    { bottleId: B.SIMPLE_SYRUP, name: 'Simple Syrup', amount: 0.5,  pourOrder: 2 },
    { bottleId: B.CREME_DE_MURE,name: 'Crème de Mûre',amount: 0.5,  pourOrder: 3 },
  ]);

  // 7. Last Word
  console.log('2. Last Word…');
  setRecipe(getCocktailId('Last Word'), [
    { bottleId: B.GIN,             name: 'Gin',               amount: 0.75, pourOrder: 1 },
    { bottleId: B.GREEN_CHARTREUSE,name: 'Green Chartreuse',  amount: 0.75, pourOrder: 1 },
    { bottleId: B.MARASCHINO,      name: 'Maraschino Liqueur',amount: 0.75, pourOrder: 1 },
    { bottleId: B.LIME_JUICE,      name: 'Lime Juice',        amount: 0.75, pourOrder: 2 },
  ]);

  // 8. Tequila Sunrise
  console.log('2. Tequila Sunrise…');
  setRecipe(getCocktailId('Tequila Sunrise'), [
    { bottleId: B.TEQUILA,      name: 'Tequila',      amount: 1.5, pourOrder: 1 },
    { bottleId: B.ORANGE_JUICE, name: 'Orange Juice', amount: 3,   pourOrder: 2 },
    { bottleId: B.GRENADINE,    name: 'Grenadine',    amount: 0.5, pourOrder: 3 },
  ]);

  // 9. Amaretto Sour
  console.log('2. Amaretto Sour…');
  setRecipe(getCocktailId('Amaretto Sour'), [
    { bottleId: B.AMARETTO,     name: 'Amaretto',     amount: 1.5,  pourOrder: 1 },
    { bottleId: B.BOURBON,      name: 'Bourbon',      amount: 0.75, pourOrder: 1 },
    { bottleId: B.LEMON_JUICE,  name: 'Lemon Juice',  amount: 1,    pourOrder: 2 },
    { bottleId: B.SIMPLE_SYRUP, name: 'Simple Syrup', amount: 0.25, pourOrder: 2 },
  ]);

  // 10. Millionaire
  console.log('2. Millionaire…');
  setRecipe(getCocktailId('Millionaire'), [
    { bottleId: B.BOURBON,     name: 'Bourbon',     amount: 1.5,  pourOrder: 1 },
    { bottleId: B.ABSINTHE,    name: 'Absinthe',    amount: 0.1,  pourOrder: 1 },
    { bottleId: B.LEMON_JUICE, name: 'Lemon Juice', amount: 0.75, pourOrder: 2 },
    { bottleId: B.GRENADINE,   name: 'Grenadine',   amount: 0.5,  pourOrder: 2 },
  ]);

});

// ── Execute ───────────────────────────────────────────────────────────────────

console.log('\n=== Running all fixes ===\n');
try {
  runFixes();
  console.log('\n✓ All fixes applied successfully.\n');
} catch (err) {
  console.error('\n✗ Transaction rolled back due to error:', err.message);
  process.exit(1);
}

// ── Verification ──────────────────────────────────────────────────────────────

console.log('=== Verification ===\n');

const VALID_BOTTLE_IDS = new Set(Object.values(B));

const cocktails = [
  'Rusty Nail', 'Kir Royale', 'Screwdriver', 'Naked and Famous',
  'Penicillin', 'Bramble', 'Last Word', 'Tequila Sunrise',
  'Amaretto Sour', 'Millionaire',
];

let allOk = true;

for (const name of cocktails) {
  const c = db.prepare('SELECT id, name, recipe FROM Cocktail WHERE name = ?').get(name);
  if (!c) { console.log(`  MISSING cocktail: ${name}`); allOk = false; continue; }

  let recipe;
  try { recipe = JSON.parse(c.recipe); } catch { recipe = null; }

  if (!Array.isArray(recipe) || recipe.length === 0) {
    console.log(`  ✗ ${name}: recipe is empty or invalid`);
    allOk = false;
    continue;
  }

  const brokenIds = recipe.filter(r => {
    const bottle = db.prepare('SELECT id FROM Bottle WHERE id = ?').get(r.bottleId);
    return !bottle;
  });

  const missingPourOrder = recipe.filter(r => r.pourOrder === undefined || r.pourOrder === null);

  if (brokenIds.length > 0) {
    console.log(`  ✗ ${name}: broken bottleIds → ${brokenIds.map(r => r.bottleId + ' (' + r.name + ')').join(', ')}`);
    allOk = false;
  } else if (missingPourOrder.length > 0) {
    console.log(`  ✗ ${name}: missing pourOrder for → ${missingPourOrder.map(r => r.name).join(', ')}`);
    allOk = false;
  } else {
    const summary = recipe.map(r => `${r.name} ${r.amount}oz p${r.pourOrder}`).join(' | ');
    console.log(`  ✓ ${name}: [${summary}]`);
  }
}

// Check bottle fixes
console.log('');
const hgs = db.prepare('SELECT name, alcoholContent FROM Bottle WHERE id = ?').get(B.HONEY_GINGER_SYRUP);
const cdm = db.prepare('SELECT name, alcoholContent FROM Bottle WHERE id = ?').get(B.CREME_DE_MURE);
const dram = db.prepare('SELECT name, alcoholContent, sugarContent, category, type FROM Bottle WHERE id = ?').get(B.DRAMBUIE);

console.log(`  ${hgs.alcoholContent === 0 ? '✓' : '✗'} Honey-Ginger Syrup alcoholContent = ${hgs.alcoholContent} (expected 0)`);
console.log(`  ${cdm.alcoholContent === 16 ? '✓' : '✗'} Crème de Mûre alcoholContent = ${cdm.alcoholContent} (expected 16)`);
console.log(`  ${dram ? '✓' : '✗'} Drambuie exists: ${dram ? JSON.stringify(dram) : 'NOT FOUND'}`);

console.log(allOk ? '\n✓ All checks passed.\n' : '\n✗ Some checks failed — see above.\n');

db.close();
