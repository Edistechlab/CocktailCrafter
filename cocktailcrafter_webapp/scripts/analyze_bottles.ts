import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function analyzeBottles() {
  const bottles = await prisma.bottle.findMany({ orderBy: { name: "asc" } })
  
  console.log(`\n📊 Total bottles: ${bottles.length}\n`)
  
  // Group by structure
  const withParent = bottles.filter(b => b.parentId)
  const withoutParent = bottles.filter(b => !b.parentId)
  
  console.log(`Structure:`)
  console.log(`  ├─ Parents (categories/types): ${withoutParent.length}`)
  console.log(`  └─ Children (products): ${withParent.length}`)
  
  console.log(`\n📋 Sample bottles with parentId:`)
  withParent.slice(0, 5).forEach(b => {
    const parent = bottles.find(p => p.id === b.parentId)
    console.log(`  • ${b.name}`)
    console.log(`    └─ parent: ${parent?.name}`)
    console.log(`    └─ cat: ${b.category} | type: ${b.type} | prod: ${b.productName}`)
  })
  
  console.log(`\n📋 Sample bottles WITHOUT parentId:`)
  withoutParent.slice(0, 10).forEach(b => {
    console.log(`  • ${b.name}`)
    console.log(`    └─ cat: ${b.category} | type: ${b.type} | prod: ${b.productName}`)
  })
  
  await prisma.$disconnect()
}

analyzeBottles()
