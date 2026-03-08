const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();

  try {
    console.log('Filling remaining key categories with placeholder data...\n');

    // Books: Get bottles WITHOUT aroma data in major categories
    const categoriesToFill = ['Juice', 'Soft Drink', 'Syrup', 'Bitters'];
    
    let filled = 0;

    for (const category of categoriesToFill) {
      const bottlesWithoutData = await prisma.bottle.findMany({
        where: {
          category: category,
          aroma: null
        },
        take: 20, // Limit to avoid overwhelming updates
      });

      console.log(`Found ${bottlesWithoutData.length} ${category} entries without data...`);

      // Generate basic data based on category
      for (const bottle of bottlesWithoutData) {
        let defaults = {};
        
        if (category === 'Juice') {
          defaults = {
            aroma: `Fresh ${bottle.name.toLowerCase()}`,
            tasteProfile: `Natural citrus and fruit notes`,
            texture: "Thin, refreshing, acidic",
            alcoholContent: 0,
            sugarContent: 8,
            acidity: 2,
          };
        } else if (category === 'Soft Drink') {
          defaults = {
            aroma: `${bottle.name} aroma`,
            tasteProfile: "Sweet, carbonated, refreshing",
            texture: "Carbonated, crisp",
            alcoholContent: 0,
            sugarContent: 10,
            acidity: 1.5,
          };
        } else if (category === 'Syrup') {
          defaults = {
            aroma: `Sweet ${bottle.name.toLowerCase()}`,
            tasteProfile: "Sweet syrup, smooth",
            texture: "Syrupy, thick, sweet",
            alcoholContent: 0,
            sugarContent: 50,
            acidity: 0,
          };
        } else if (category === 'Bitters') {
          defaults = {
            aroma: `Aromatic herbs and spices`,
            tasteProfile: "Bitter, herbal, aromatic",
            texture: "Thin, concentrated, bitter",
            alcoholContent: 45,
            sugarContent: 0,
            acidity: 2,
          };
        }

        if (Object.keys(defaults).length > 0) {
          await prisma.bottle.update({
            where: { id: bottle.id },
            data: defaults
          });
          filled++;
        }
      }
    }

    console.log(`\n✓ Filled ${filled} entries with placeholder data`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
