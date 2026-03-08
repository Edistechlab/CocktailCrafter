/**
 * Export SQLite data to MySQL-compatible SQL file.
 * Run with: npx ts-node scripts/export-to-mysql.ts
 *
 * This temporarily uses the sqlite prisma client directly via better-sqlite3.
 */

import Database from "better-sqlite3"
import * as fs from "fs"
import { fileURLToPath } from "url"
import * as path from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DB_PATH = path.join(__dirname, "../prisma/dev.db")
const OUT_PATH = path.join(__dirname, "../prisma/mysql-seed.sql")

const db = new Database(DB_PATH)

// DateTime columns (by model) — these need timestamp conversion
const DATE_COLS = new Set([
    "createdAt", "updatedAt", "emailVerified", "expires", "expires_at"
])

function toMysqlDatetime(val: any): string {
    if (val === null || val === undefined) return "NULL"
    let d: Date
    if (typeof val === "number") {
        // Unix ms or seconds
        d = val > 1e10 ? new Date(val) : new Date(val * 1000)
    } else {
        d = new Date(val)
    }
    if (isNaN(d.getTime())) return "NULL"
    // Format as YYYY-MM-DD HH:MM:SS.mmm
    return "'" + d.toISOString().replace("T", " ").replace("Z", "") + "'"
}

function esc(val: any, col?: string): string {
    if (val === null || val === undefined) return "NULL"
    if (col && DATE_COLS.has(col)) return toMysqlDatetime(val)
    if (typeof val === "number") return String(val)
    if (typeof val === "boolean") return val ? "1" : "0"
    // Escape string for MySQL
    return "'" + String(val).replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, "\\n").replace(/\r/g, "\\r") + "'"
}

function exportTable(tableName: string, lines: string[]) {
    const rows = db.prepare(`SELECT * FROM "${tableName}"`).all() as any[]
    if (rows.length === 0) return
    const cols = Object.keys(rows[0])
    lines.push(`-- ${tableName} (${rows.length} rows)`)
    for (const row of rows) {
        const values = cols.map(c => esc(row[c], c)).join(", ")
        const colList = cols.map(c => `\`${c}\``).join(", ")
        lines.push(`INSERT IGNORE INTO \`${tableName}\` (${colList}) VALUES (${values});`)
    }
    lines.push("")
}

// M2M junction tables
function exportM2M(tableName: string, lines: string[]) {
    let rows: any[]
    try {
        rows = db.prepare(`SELECT * FROM "${tableName}"`).all() as any[]
    } catch {
        return
    }
    if (rows.length === 0) return
    const cols = Object.keys(rows[0])
    lines.push(`-- ${tableName} (${rows.length} rows)`)
    for (const row of rows) {
        const values = cols.map(c => esc(row[c], c)).join(", ")
        const colList = cols.map(c => `\`${c}\``).join(", ")
        lines.push(`INSERT IGNORE INTO \`${tableName}\` (${colList}) VALUES (${values});`)
    }
    lines.push("")
}

const lines: string[] = [
    "SET FOREIGN_KEY_CHECKS=0;",
    "SET NAMES utf8mb4;",
    ""
]

// Export in dependency order
exportTable("User", lines)
exportTable("Account", lines)
exportTable("Session", lines)
exportTable("VerificationToken", lines)
exportTable("PasswordResetToken", lines)
exportTable("GlassType", lines)
exportTable("IceType", lines)
exportTable("Garnish", lines)
exportTable("TasteProfile", lines)
exportTable("ShakeTechnique", lines)
exportTable("Bottle", lines)
exportTable("CocktailSet", lines)
exportTable("Cocktail", lines)
exportTable("Favorite", lines)
exportTable("Rating", lines)

// M2M join tables (Prisma naming convention)
exportM2M("_CocktailToGlass", lines)
exportM2M("_CocktailToIce", lines)
exportM2M("_CocktailToGarnish", lines)
exportM2M("_CocktailToTasteProfile", lines)
exportM2M("_CocktailToTechnique", lines)
exportM2M("_CocktailToCocktailSet", lines)

lines.push("SET FOREIGN_KEY_CHECKS=1;")

fs.writeFileSync(OUT_PATH, lines.join("\n"), "utf-8")
console.log(`✅ Exported to ${OUT_PATH}`)
db.close()
