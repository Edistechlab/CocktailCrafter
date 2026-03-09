/**
 * gen_mysql_migration.js
 * Generates the MySQL migration file 004_fix_all_recipe_bottle_ids.sql
 * based on the current (already-fixed) state of the SQLite database.
 */

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.resolve(__dirname, '../prisma/dev.db');
const OUT_PATH = path.resolve(__dirname, '../migrations/004_fix_all_recipe_bottle_ids.sql');

const db = new Database(DB_PATH);

const cocktails = db.prepare('SELECT id, name, recipe FROM Cocktail ORDER BY name').all();

// Bottles that were newly inserted in this migration run
const newBottles = [
  { id: 'fix_coffee_liqueur_001',   name: 'Coffee Liqueur (Kahlua)', alcoholContent: 20,   sugarContent: 45, acidity: 0,   category: 'Liqueur',   type: 'Liqueur'   },
  { id: 'fix_angostura_bitters_01', name: 'Angostura Bitters',       alcoholContent: 44.7, sugarContent: 0,  acidity: 0,   category: 'Bitters',   type: 'Bitters'   },
  { id: 'fix_creme_violette_001',   name: 'Crème de Violette',       alcoholContent: 16,   sugarContent: 30, acidity: 0,   category: 'Liqueur',   type: 'Liqueur'   },
  { id: 'fix_apricot_liqueur_001',  name: 'Apricot Liqueur',         alcoholContent: 25,   sugarContent: 25, acidity: 0,   category: 'Liqueur',   type: 'Liqueur'   },
  { id: 'fix_coconut_cream_001',    name: 'Coconut Cream',           alcoholContent: 0,    sugarContent: 15, acidity: 0,   category: 'Syrup',     type: 'Syrup'     },
  { id: 'fix_cream_001',            name: 'Cream',                   alcoholContent: 0,    sugarContent: 3,  acidity: 0,   category: 'Syrup',     type: 'Syrup'     },
  { id: 'fix_benedictine_001',      name: 'Benedictine',             alcoholContent: 40,   sugarContent: 28, acidity: 0,   category: 'Liqueur',   type: 'Liqueur'   },
];

function esc(s) {
  return String(s).replace(/'/g, "''");
}

const lines = [];

lines.push('-- ============================================================');
lines.push('-- Migration: 004_fix_all_recipe_bottle_ids.sql');
lines.push('-- Description: Fix all broken bottle IDs in Cocktail.recipe JSON');
lines.push('--              and insert missing bottle entries.');
lines.push('-- Generated: 2026-03-09');
lines.push('-- ============================================================');
lines.push('');

lines.push('-- ── Step 1: Insert missing bottles ─────────────────────────────────────');
lines.push('');

for (const b of newBottles) {
  lines.push(`INSERT INTO Bottle (id, name, category, type, alcoholContent, sugarContent, acidity, createdAt, updatedAt)`);
  lines.push(`  SELECT '${esc(b.id)}', '${esc(b.name)}', '${esc(b.category)}', '${esc(b.type)}', ${b.alcoholContent}, ${b.sugarContent}, ${b.acidity}, NOW(), NOW()`);
  lines.push(`  WHERE NOT EXISTS (SELECT 1 FROM Bottle WHERE id = '${esc(b.id)}');`);
  lines.push('');
}

lines.push('-- ── Step 2: Update Cocktail.recipe with corrected bottle IDs ─────────');
lines.push('');

for (const c of cocktails) {
  let recipe;
  try { recipe = JSON.parse(c.recipe); } catch(e) { continue; }
  if (!Array.isArray(recipe)) continue;
  // Only output cocktails that have at least one bottleId
  if (!recipe.some(i => i.bottleId)) continue;

  const recipeJson = JSON.stringify(recipe).replace(/'/g, "''");
  lines.push(`UPDATE Cocktail SET recipe = '${recipeJson}' WHERE id = '${esc(c.id)}'; -- ${c.name}`);
}

lines.push('');
lines.push('-- ── Verification query (should return 0 rows after migration) ───────────');
lines.push('-- SELECT c.name, jt.bottleId');
lines.push('-- FROM Cocktail c');
lines.push("--   JOIN JSON_TABLE(c.recipe, '$[*]' COLUMNS(bottleId VARCHAR(255) PATH '$.bottleId')) jt");
lines.push('--   LEFT JOIN Bottle b ON b.id = jt.bottleId');
lines.push('-- WHERE jt.bottleId IS NOT NULL AND b.id IS NULL;');
lines.push('');

const sql = lines.join('\n');
fs.writeFileSync(OUT_PATH, sql, 'utf8');
console.log('Written:', OUT_PATH);
console.log('Total lines:', lines.length);
