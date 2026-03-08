const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();

  try {
    console.log('UpdatingRemaining bottle categories with comprehensive data...\n');

    // Additional detailed bottle data for specific brands and categories
    const detailedUpdates = [
      // WHISKEY SUBCATEGORIES
      {
        name: "Bourbon Whiskey",
        updates: {
          category: "Whiskey",
          type: "Bourbon",
          aroma: "Vanilla, oak, caramel, corn",
          tasteProfile: "Sweet, oaky, vanilla finish, smooth caramel",
          texture: "Full-bodied, warming, smooth",
          alcoholContent: 40,
          sugarContent: 0.3,
          acidity: 0.5,
        }
      },
      {
        name: "Rye Whiskey",
        updates: {
          category: "Whiskey",
          type: "Rye",
          aroma: "Spice, rye, oak, vanilla",
          tasteProfile: "Spicy, dry, peppery finish",
          texture: "Medium to full-bodied, dry",
          alcoholContent: 40,
          sugarContent: 0.1,
          acidity: 1,
        }
      },
      {
        name: "Scotch Whisky",
        updates: {
          category: "Whiskey",
          type: "Scotch",
          aroma: "Smoke, peat, heather, fruit",
          tasteProfile: "Smoky, earthy, complex, fruity",
          texture: "Full-bodied, warming, peaty",
          alcoholContent: 40,
          sugarContent: 0.2,
          acidity: 0.5,
        }
      },
      {
        name: "Irish Whiskey",
        updates: {
          category: "Whiskey",
          type: "Irish",
          aroma: "Sweet, vanilla, spice, fruity",
          tasteProfile: "Smooth, sweet, vanilla, fruity undertones",
          texture: "Medium-bodied, smooth, silky",
          alcoholContent: 40,
          sugarContent: 0.3,
          acidity: 0.5,
        }
      },
      // RUM SUBCATEGORIES
      {
        name: "White Rum",
        updates: {
          category: "Rum",
          type: "White",
          aroma: "Sugarcane, vanilla, clean",
          tasteProfile: "Clean, light, subtle vanilla, smooth",
          texture: "Light-bodied, smooth, crisp",
          alcoholContent: 40,
          sugarContent: 0.5,
          acidity: 0.5,
        }
      },
      {
        name: "Dark Rum",
        updates: {
          category: "Rum",
          type: "Dark",
          aroma: "Molasses, caramel, spice, oak",
          tasteProfile: "Rich, molasses, caramel, spiced",
          texture: "Full-bodied, warming, smooth",
          alcoholContent: 40,
          sugarContent: 2,
          acidity: 0.5,
        }
      },
      {
        name: "Spiced Rum",
        updates: {
          category: "Rum",
          type: "Spiced",
          aroma: "Spice, vanilla, caramel, cinnamon",
          tasteProfile: "Spicy, sweet, vanilla, warming",
          texture: "Medium to full-bodied, warming",
          alcoholContent: 35,
          sugarContent: 3,
          acidity: 0.5,
        }
      },
      {
        name: "Aged Rum",
        updates: {
          category: "Rum",
          type: "Aged",
          aroma: "Oak, vanilla, caramel, fruit",
          tasteProfile: "Complex, oaky, caramel, fruit notes",
          texture: "Full-bodied, warming, smooth",
          alcoholContent: 40,
          sugarContent: 1,
          acidity: 0.5,
        }
      },
      // LIQUEURS - ADDITIONAL
      {
        name: "Kahlúa",
        updates: {
          category: "Liqueur",
          type: "Coffee Liqueur",
          productName: "Kahlúa",
          aroma: "Rich coffee, vanilla, cocoa",
          tasteProfile: "Rich coffee, chocolate, smooth finish",
          texture: "Syrupy, creamy, rich",
          alcoholContent: 20,
          sugarContent: 42,
          acidity: 0,
        }
      },
      {
        name: "Frangelico",
        updates: {
          category: "Liqueur",
          type: "Hazelnut Liqueur",
          productName: "Frangelico",
          aroma: "Hazelnut, cocoa, vanilla",
          tasteProfile: "Sweet hazelnut, chocolate, smooth",
          texture: "Syrupy, smooth, creamy",
          alcoholContent: 20,
          sugarContent: 20,
          acidity: 0,
        }
      },
      {
        name: "Drambuie",
        updates: {
          category: "Liqueur",
          type: "Whisky Liqueur",
          productName: "Drambuie",
          aroma: "Honey, whisky, spice",
          tasteProfile: "Sweet honey, whisky, spiced",
          texture: "Syrupy, warming, smooth",
          alcoholContent: 40,
          sugarContent: 40,
          acidity: 0,
        }
      },
      {
        name: "Baileys",
        updates: {
          category: "Liqueur",
          type: "Irish Cream Liqueur",
          productName: "Baileys Irish Cream",
          aroma: "Cream, chocolate, whisky",
          tasteProfile: "Creamy, chocolate, whisky, smooth",
          texture: "Creamy, rich, velvety",
          alcoholContent: 17,
          sugarContent: 30,
          acidity: 0,
        }
      },
      // GIN SUBTYPES
      {
        name: "London Dry Gin",
        updates: {
          category: "Gin",
          type: "London Dry",
          aroma: "Juniper, coriander, citrus",
          tasteProfile: "Crisp juniper, dried herbs, citrus finish",
          texture: "Light-bodied, clean, dry",
          alcoholContent: 40,
          sugarContent: 0,
          acidity: 2,
        }
      },
      {
        name: "Old Tom Gin",
        updates: {
          category: "Gin",
          type: "Old Tom",
          aroma: "Juniper, vanilla, citrus, sweet",
          tasteProfile: "Slightly sweet, juniper, citrus, smooth",
          texture: "Medium-bodied, smooth, slightlysweet",
          alcoholContent: 40,
          sugarContent: 2,
          acidity: 1.5,
        }
      },
      {
        name: "Plymouth Gin",
        updates: {
          category: "Gin",
          type: "Plymouth",
          productName: "Plymouth",
          aroma: "Juniper, citrus, herbal, earthy",
          tasteProfile: "Earthy, herbal, citrus, complex",
          texture: "Medium-bodied, smooth, slightly dry",
          alcoholContent: 41.2,
          sugarContent: 0,
          acidity: 2,
        }
      },
      // COGNAC / BRANDY
      {
        name: "Cognac",
        updates: {
          category: "Brandy",
          type: "Cognac",
          aroma: "Oak, vanilla, dried fruit, floral",
          tasteProfile: "Complex, fruity, oaky, sophisticated",
          texture: "Full-bodied, warming, silky",
          alcoholContent: 40,
          sugarContent: 0.3,
          acidity: 1,
        }
      },
      // DRY VERMOUTH
      {
        name: "Dry Vermouth",
        updates: {
          category: "Vermouth",
          type: "Dry",
          aroma: "Herbal, botanical, dry",
          tasteProfile: "Dry, herbal, aromatic, bitter-sweet",
          texture: "Medium-bodied, crisp",
          alcoholContent: 18,
          sugarContent: 2,
          acidity: 2,
        }
      },
      // SWEET VERMOUTH
      {
        name: "Sweet Vermouth",
        updates: {
          category: "Vermouth",
          type: "Sweet",
          aroma: "Herbal, spice, sweet",
          tasteProfile: "Sweet, herbal, spiced, smooth",
          texture: "Full-bodied, syrupy",
          alcoholContent: 16,
          sugarContent: 15,
          acidity: 1,
        }
      },
    ];

    let updated = 0;
    let notFound = 0;

    for (const item of detailedUpdates) {
      try {
        const existing = await prisma.bottle.findFirst({
          where: { name: item.name }
        });

        if (existing) {
          await prisma.bottle.update({
            where: { id: existing.id },
            data: item.updates
          });
          console.log(`✓ Updated: ${item.name}`);
          updated++;
        } else {
          console.log(`✗ Not found: ${item.name}`);
          notFound++;
        }
      } catch (error) {
        console.error(`✗ Error updating ${item.name}:`, error.message);
      }
    }

    console.log(`\n=== Batch Update Summary ===`);
    console.log(`Updated: ${updated}`);
    console.log(`Not found: ${notFound}`);

  } catch (error) {
    console.error('Critical error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
