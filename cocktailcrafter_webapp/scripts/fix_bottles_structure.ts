import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Complete mapping based on the database structure
const BOTTLE_MAPPING = {
  "Absinthe": { category: "Absinthe", types: ["Verte", "Blanche", "Rouge"] },
  "Bitters": { category: "Bitters", types: ["Angostura Bitters", "Orange Bitters", "Aromatic Bitters", "Walnut Bitters", "Celery Bitters"] },
  "Brandy": { category: "Brandy", types: ["Cognac", "Armagnac", "Brandy de Jerez"] },
  "Gin": { category: "Gin", types: ["London Dry Gin", "Plymouth Gin", "Old Tom Gin", "Dry Gin", "New Western Gin", "Sloe Gin", "Genever", "Navy Strength Gin", "Barrel Aged Gin", "Contemporary Gin"] },
  "Juice": { category: "Juice", types: ["Orange Juice", "Lemon Juice", "Lime Juice", "Cranberry Juice", "Pineapple Juice", "Grapefruit Juice", "Apple Juice"] },
  "Liqueur": { category: "Liqueur", types: ["Orange Liqueur", "Coffee Liqueur", "Herbal Liqueur", "Chocolate Liqueur", "Almond Liqueur", "Anise Liqueur", "Coconut Liqueur"] },
  "Mezcal": { category: "Mezcal", types: ["Mezcal Joven", "Mezcal Reposado", "Mezcal Anejo"] },
  "Rum": { category: "Rum", types: ["White Rum", "Gold Rum", "Dark Rum", "Spiced Rum", "Overproof Rum", "Rhum Agricole", "Navy Rum", "Premium Aged Rum"] },
  "Soft Drink": { category: "Soft Drink", types: ["Cola", "Tonic Water", "Ginger Beer", "Lemonade", "Ginger Ale", "Grenadine", "Soda Water", "Lemon-Lime Soda", "Bitter Lemon"] },
  "Sparkling Wine": { category: "Sparkling Wine", types: ["Champagne", "Prosecco", "Cava", "Sparkling Wine"] },
  "Vermouth": { category: "Vermouth", types: ["Dry Vermouth", "Sweet Vermouth", "Bianco Vermouth", "Rotwein"] },
  "Vodka": { category: "Vodka", types: ["Classic Vodka", "Flavored Vodka", "Premium Vodka"] },
  "Whiskey": { category: "Whiskey", types: ["Bourbon", "Tennessee Whiskey", "Scotch Single Malt", "Scotch Blended", "Irish Whiskey", "Rye Whiskey", "Canadian Whisky", "Japanese Whisky"] },
  "Wine": { category: "Wine", types: ["Red Wine", "White Wine", "Rose Wine"] },
}

async function fixBottles() {
  console.log("\n🔍 Starting bottle restructuring...\n")
  
  // Get all bottles
  const allBottles = await prisma.bottle.findMany()
  
  // Map bottle names to their ids for quick lookup
  const bottleMap = new Map<string, string>()
  allBottles.forEach(b => bottleMap.set(b.name, b.id))
  
  let updated = 0
  let errors = 0
  
  for (const bottle of allBottles) {
    try {
      if (bottle.parentId) {
        // This is a product bottle - has a parent
        const parent = allBottles.find(b => b.id === bottle.parentId)
        if (!parent) {
          console.log(`❌ ${bottle.name} has invalid parentId`)
          errors++
          continue
        }
        
        // Product bottles should have: category, type, productName
        // Already look correct from the database
        console.log(`✓ ${bottle.name} (product of ${parent.name})`)
      } else {
        // This is a category/type bottle - no parent
        if (!bottle.category) {
          console.log(`⚠️  ${bottle.name} missing category - skipping`)
          continue
        }
        
        // Verify category is in our mapping
        const mapping = BOTTLE_MAPPING[bottle.category as keyof typeof BOTTLE_MAPPING]
        if (!mapping) {
          console.log(`⚠️  ${bottle.name} category "${bottle.category}" not in mapping`)
          continue
        }
        
        console.log(`✓ ${bottle.name} (category: ${bottle.category})`)
      }
      updated++
    } catch (err) {
      console.error(`Error processing ${bottle.name}:`, err)
      errors++
    }
  }
  
  console.log(`\n📊 Results:`)
  console.log(`  ✓ Valid/Updated: ${updated}`)
  console.log(`  ❌ Errors: ${errors}`)
  
  // Show summary of all categories
  const categories = new Set(allBottles.map(b => b.category).filter(Boolean))
  console.log(`\n📚 Categories found: ${Array.from(categories).sort().join(", ")}`)
  
  await prisma.$disconnect()
}

fixBottles()
