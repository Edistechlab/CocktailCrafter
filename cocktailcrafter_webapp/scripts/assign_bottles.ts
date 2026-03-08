import { PrismaClient } from "@prisma/client"
import * as fs from "fs"

const prisma = new PrismaClient()

// Complete mapping data
const BOTTLE_DATA = [
  { category: "Whiskey", types: ["Bourbon", "Tennessee Whiskey", "Scotch Single Malt", "Scotch Blended", "Irish Whiskey", "Rye Whiskey", "Canadian Whisky", "Japanese Whisky"] },
  { category: "Gin", types: ["London Dry Gin", "Plymouth Gin", "Old Tom Gin", "Dry Gin", "New Western Gin", "Sloe Gin", "Genever", "Navy Strength Gin", "Barrel Aged Gin", "Contemporary Gin"] },
  { category: "Rum", types: ["White Rum", "Gold Rum", "Dark Rum", "Spiced Rum", "Overproof Rum", "Rhum Agricole", "Navy Rum", "Premium Aged Rum"] },
  { category: "Vodka", types: ["Classic Vodka", "Flavored Vodka", "Premium Vodka"] },
  { category: "Tequila", types: ["Blanco Tequila", "Reposado Tequila", "Anejo Tequila", "Mezcal"] },
  { category: "Brandy", types: ["Cognac", "Armagnac", "Brandy de Jerez"] },
  { category: "Liqueur", types: ["Orange Liqueur", "Coffee Liqueur", "Herbal Liqueur", "Chocolate Liqueur", "Almond Liqueur", "Anise Liqueur", "Coconut Liqueur"] },
  { category: "Vermouth", types: ["Dry Vermouth", "Sweet Vermouth", "Bianco Vermouth", "Rotwein"] },
  { category: "Juice", types: ["Orange Juice", "Lemon Juice", "Lime Juice", "Cranberry Juice", "Pineapple Juice", "Grapefruit Juice", "Apple Juice"] },
  { category: "Soft Drink", types: ["Cola", "Tonic Water", "Ginger Beer", "Lemonade", "Ginger Ale", "Grenadine", "Soda Water", "Lemon-Lime Soda", "Bitter Lemon"] },
  { category: "Syrup", types: ["Simple Syrup", "Rich Syrup", "Flavored Syrup", "Agave Syrup", "Coconut Syrup", "Vanilla Syrup"] },
  { category: "Bitters", types: ["Angostura Bitters", "Orange Bitters", "Aromatic Bitters", "Walnut Bitters", "Celery Bitters", "Chocolate Bitters"] },
  { category: "Absinthe", types: ["Verte", "Blanche", "Rouge"] },
  { category: "Mezcal", types: ["Mezcal Joven", "Mezcal Reposado", "Mezcal Anejo"] },
  { category: "Amaro", types: ["Amaro"] },
  { category: "Aperitif Wine", types: ["Aperitif Wine"] },
  { category: "Sparkling Wine", types: ["Champagne", "Prosecco", "Cava", "Sparkling Wine"] },
  { category: "Wine", types: ["Red Wine", "White Wine", "Rose Wine"] },
]

// Known product mappings based on brand names
const PRODUCT_MAPPINGS: { [key: string]: { category: string; type: string; productName: string } } = {
  "Maker's Mark": { category: "Whiskey", type: "Bourbon", productName: "Maker's Mark" },
  "Buffalo Trace": { category: "Whiskey", type: "Bourbon", productName: "Buffalo Trace" },
  "Woodford Reserve": { category: "Whiskey", type: "Bourbon", productName: "Woodford Reserve" },
  "Jack Daniel's": { category: "Whiskey", type: "Tennessee Whiskey", productName: "Jack Daniel's" },
  "George Dickel": { category: "Whiskey", type: "Tennessee Whiskey", productName: "George Dickel" },
  "Glenfiddich": { category: "Whiskey", type: "Scotch Single Malt", productName: "Glenfiddich" },
  "Macallan": { category: "Whiskey", type: "Scotch Single Malt", productName: "Macallan" },
  "Johnnie Walker": { category: "Whiskey", type: "Scotch Blended", productName: "Johnnie Walker" },
  "Chivas Regal": { category: "Whiskey", type: "Scotch Blended", productName: "Chivas Regal" },
  "Jameson": { category: "Whiskey", type: "Irish Whiskey", productName: "Jameson" },
  "Bulleit Rye": { category: "Whiskey", type: "Rye Whiskey", productName: "Bulleit Rye" },
  "Crown Royal": { category: "Whiskey", type: "Canadian Whisky", productName: "Crown Royal" },
  "Beefeater": { category: "Gin", type: "London Dry Gin", productName: "Beefeater" },
  "Tanqueray": { category: "Gin", type: "London Dry Gin", productName: "Tanqueray" },
  "Bombay Sapphire": { category: "Gin", type: "London Dry Gin", productName: "Bombay Sapphire" },
  "Hendrick's": { category: "Gin", type: "New Western Gin", productName: "Hendrick's" },
  "Bacardi": { category: "Rum", type: "White Rum", productName: "Bacardi" },
  "Captain Morgan": { category: "Rum", type: "Spiced Rum", productName: "Captain Morgan" },
  "Mount Gay": { category: "Rum", type: "Gold Rum", productName: "Mount Gay" },
  "Absolut": { category: "Vodka", type: "Classic Vodka", productName: "Absolut" },
  "Tito's": { category: "Vodka", type: "Premium Vodka", productName: "Tito's" },
  "Jose Cuervo": { category: "Tequila", type: "Blanco Tequila", productName: "Jose Cuervo" },
  "Patron": { category: "Tequila", type: "Blanco Tequila", productName: "Patron" },
  "Cointreau": { category: "Liqueur", type: "Orange Liqueur", productName: "Cointreau" },
  "Triple Sec": { category: "Liqueur", type: "Orange Liqueur", productName: "Triple Sec" },
  "Kahlua": { category: "Liqueur", type: "Coffee Liqueur", productName: "Kahlua" },
  "Baileys": { category: "Liqueur", type: "Herbal Liqueur", productName: "Baileys" },
  "Angostura": { category: "Bitters", type: "Aromatic Bitters", productName: "Angostura" },
  "Peychaud's": { category: "Bitters", type: "Aromatic Bitters", productName: "Peychaud's" },
  "Fee Brothers": { category: "Bitters", type: "Orange Bitters", productName: "Fee Brothers" },
  "Regan's": { category: "Bitters", type: "Orange Bitters", productName: "Regan's" },
}

async function assignBottles() {
  const log: string[] = []
  const unsure: string[] = []
  
  log.push(`🔄 Starting bottle assignment process...\n`)
  
  const allBottles = await prisma.bottle.findMany({ orderBy: { name: "asc" } })
  
  let updated = 0
  let unchanged = 0
  let uncertain = 0
  
  for (const bottle of allBottles) {
    const name = bottle.name.trim()
    
    // Skip if already has both category and type
    if (bottle.category && bottle.type) {
      unchanged++
      continue
    }
    
    // Check direct mapping
    if (PRODUCT_MAPPINGS[name]) {
      const mapping = PRODUCT_MAPPINGS[name]
      try {
        await prisma.bottle.update({
          where: { id: bottle.id },
          data: {
            category: mapping.category,
            type: mapping.type,
            productName: mapping.productName
          }
        })
        updated++
        log.push(`✓ ${name} → ${mapping.category} / ${mapping.type}`)
      } catch (err) {
        uncertain++
        unsure.push(`❌ Failed to update "${name}": ${err}`)
      }
      continue
    }
    
    // Try to match by type name (if bottle name IS a type)
    let foundType = false
    for (const categoryData of BOTTLE_DATA) {
      if (categoryData.types.includes(name)) {
        try {
          await prisma.bottle.update({
            where: { id: bottle.id },
            data: {
              category: categoryData.category,
              type: name
            }
          })
          updated++
          log.push(`✓ ${name} → ${categoryData.category} / ${name} (Type Match)`)
          foundType = true
          break
        } catch (err) {
          uncertain++
          unsure.push(`❌ Failed to update "${name}": ${err}`)
          foundType = true
          break
        }
      }
    }
    
    if (foundType) continue
    
    // Try to match by category name (if bottle name IS a category)
    let foundCategory = false
    for (const categoryData of BOTTLE_DATA) {
      if (categoryData.category === name) {
        try {
          await prisma.bottle.update({
            where: { id: bottle.id },
            data: {
              category: name
            }
          })
          updated++
          log.push(`✓ ${name} → ${name} (Category Match)`)
          foundCategory = true
          break
        } catch (err) {
          uncertain++
          unsure.push(`❌ Failed to update "${name}": ${err}`)
          foundCategory = true
          break
        }
      }
    }
    
    if (foundCategory) continue
    
    // If nothing matches, mark as uncertain
    uncertain++
    unsure.push(`⚠️  "${name}" - No mapping found (has category: ${bottle.category}, type: ${bottle.type}, product: ${bottle.productName})`)
  }
  
  log.push(`\n📊 Summary:`)
  log.push(`  ✓ Updated: ${updated}`)
  log.push(`  → Unchanged (already complete): ${unchanged}`)
  log.push(`  ⚠️  Uncertain (no mapping): ${uncertain}`)
  
  if (unsure.length > 0) {
    log.push(`\n🔍 Bottles that need manual review:\n`)
    unsure.forEach(u => log.push(u))
  }
  
  const logContent = log.join("\n")
  console.log(logContent)
  
  // Save to file
  fs.writeFileSync(
    "/Users/edi/Documents/Edis Techlab/Projekte/05_CocktailCrafter/cocktailcrafter_webapp/bottle_assignment_report.txt",
    logContent
  )
  
  await prisma.$disconnect()
}

assignBottles()
