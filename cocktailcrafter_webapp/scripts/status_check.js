const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  
  try {
    const withAroma = await prisma.bottle.count({
      where: { aroma: { not: null } }
    });
    
    const withAlcohol = await prisma.bottle.count({
      where: { alcoholContent: { not: null } }
    });
    
    const total = await prisma.bottle.count();
    
    console.log('=== FINAL DATA COMPLETENESS ===\n');
    console.log(`Total Bottles: ${total}`);
    console.log(`With Aroma Data: ${withAroma} (${Math.round(withAroma/total*100)}%)`);
    console.log(`With Alcohol Content: ${withAlcohol} (${Math.round(withAlcohol/total*100)}%)`);
    
    // Check Lyre's alternatives
    const lyres = await prisma.bottle.count({ where: { name: { contains: 'Lyre' } } });
    console.log(`\n✓ Lyre's Products: ${lyres} entries`);
    
    // Check linked alternatives  
    const withNA = await prisma.bottle.count({
      where: { nonAlcoholicId: { not: null } }
    });
    console.log(`✓ With Non-Alcoholic Links: ${withNA} bottles`);
    
    // Sample 3 bottles with good data
    const samples = await prisma.bottle.findMany({
      where: { 
        aroma: { not: null },
        nonAlcoholicId: { not: null }
      },
      select: {
        name: true,
        alcoholContent: true,
        aroma: true,
        tasteProfile: true,
        nonAlcoholic: { select: { name: true } }
      },
      take: 3
    });
    
    console.log(`\n=== SAMPLE UPDATED BOTTLES ===`);
    samples.forEach((b, i) => {
      console.log(`\n${i+1}. ${b.name} (${b.alcoholContent}% ABV)`);
      console.log(`   Aroma: ${b.aroma}`);
      console.log(`   Taste: ${b.tasteProfile}`);
      console.log(`   NA Alt: ${b.nonAlcoholic?.name || 'None'}`);
    });
    
  } finally {
    await prisma.$disconnect();
  }
}

main();
