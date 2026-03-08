const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();

  try {
    console.log('Starting bottle data update...\n');

    // Main spirits with comprehensive data
    const bottleUpdates = [
      // === WHISKEY ===
      {
        name: "Whiskey",
        updates: {
          category: "Whiskey",
          aroma: "Oak, vanilla, caramel, spice",
          tasteProfile: "Warm, complex, oaky with sweet finish",
          texture: "Full-bodied, warming alcohol",
          alcoholContent: 40,
          sugarContent: 0.2,
          acidity: 0.5,
        }
      },
      // === GIN ===
      {
        name: "Gin",
        updates: {
          category: "Gin",
          aroma: "Juniper, botanicals, citrus, floral",
          tasteProfile: "Crisp, herbaceous, dry, piney",
          texture: "Light-bodied, clean, refreshing",
          alcoholContent: 40,
          sugarContent: 0,
          acidity: 2,
        }
      },
      // === RUM ===
      {
        name: "Rum",
        updates: {
          category: "Rum",
          aroma: "Molasses, vanilla, tropical fruit, caramel",
          tasteProfile: "Sweet, rich, smooth, tropical notes",
          texture: "Medium-bodied, warming smooth finish",
          alcoholContent: 40,
          sugarContent: 1,
          acidity: 0.5,
        }
      },
      // === TEQUILA ===
      {
        name: "Tequila",
        updates: {
          category: "Tequila",
          aroma: "Agave, citrus, mineral, peppery",
          tasteProfile: "Crisp agave, citrus, peppery spice",
          texture: "Light to medium-bodied, clean",
          alcoholContent: 40,
          sugarContent: 0.5,
          acidity: 1.5,
        }
      },
      // === VODKA ===
      {
        name: "Vodka",
        updates: {
          category: "Vodka",
          aroma: "Neutral, subtle grain or grain-based sweetness",
          tasteProfile: "Neutral, clean, smooth, minimal flavor",
          texture: "Light-bodied, clean finish",
          alcoholContent: 40,
          sugarContent: 0,
          acidity: 0,
        }
      },
      // === BRANDY ===
      {
        name: "Brandy",
        updates: {
          category: "Brandy",
          aroma: "Grape, oak, vanilla, dried fruit",
          tasteProfile: "Warm, fruity, complex, sophisticated",
          texture: "Medium to full-bodied, warming",
          alcoholContent: 40,
          sugarContent: 0.3,
          acidity: 1,
        }
      },
      // === VERMOUTH ===
      {
        name: "Vermouth",
        updates: {
          category: "Vermouth",
          aroma: "Herbal, spice, botanical, aromatic",
          tasteProfile: "Herbal, aromatic, complex, slightly bitter",
          texture: "Medium-bodied, smooth",
          alcoholContent: 16,
          sugarContent: 5,
          acidity: 2,
        }
      },
      // === LIQUEUR ===
      {
        name: "Liqueur",
        updates: {
          category: "Liqueur",
          aroma: "Sweet, aromatic, fruit or spice-based",
          tasteProfile: "Sweet, smooth, flavored",
          texture: "Syrupy, smooth, creamy",
          alcoholContent: 30,
          sugarContent: 20,
          acidity: 1,
        }
      },
      // === TRIPLE SEC ===
      {
        name: "Triple Sec",
        updates: {
          category: "Liqueur",
          type: "Orange Liqueur",
          aroma: "Orange peel, citrus, floral",
          tasteProfile: "Sweet orange, crisp citrus, clean finish",
          texture: "Light-bodied, smooth, crisp",
          alcoholContent: 40,
          sugarContent: 18,
          acidity: 2,
        }
      },
      // === AMARETTO ===
      {
        name: "Amaretto",
        updates: {
          category: "Liqueur",
          type: "Almond Liqueur",
          aroma: "Almond, cherry, sweet, vanilla",
          tasteProfile: "Sweet almond, cherry, smooth finish",
          texture: "Syrupy, smooth, creamy",
          alcoholContent: 28,
          sugarContent: 20,
          acidity: 0,
        }
      },
      // === CRÈME DE CACAO ===
      {
        name: "Crème de Cacao",
        updates: {
          category: "Liqueur",
          type: "Chocolate Liqueur",
          aroma: "Chocolate, vanilla, cocoa",
          tasteProfile: "Rich chocolate, vanilla, sweet",
          texture: "Syrupy, smooth, creamy",
          alcoholContent: 25,
          sugarContent: 30,
          acidity: 0,
        }
      },
      // === COFFEE LIQUEUR ===
      {
        name: "Coffee Liqueur",
        updates: {
          category: "Liqueur",
          type: "Coffee Liqueur",
          aroma: "Coffee, cocoa, vanilla",
          tasteProfile: "Rich coffee, chocolate, smooth",
          texture: "Rich, oily, creamy",
          alcoholContent: 20,
          sugarContent: 40,
          acidity: 0,
        }
      },
      // === COINTREAU ===
      {
        name: "Cointreau",
        updates: {
          category: "Liqueur",
          type: "Orange Liqueur",
          productName: "Cointreau",
          aroma: "Orange, citrus, floral",
          tasteProfile: "Sweet orange, bright citrus, clean",
          texture: "Light-bodied, smooth, crisp",
          alcoholContent: 40,
          sugarContent: 18,
          acidity: 2,
        }
      },
      // === CAMPARI ===
      {
        name: "Campari",
        updates: {
          category: "Liqueur",
          type: "Bitter Liqueur",
          productName: "Campari",
          aroma: "Herbs, spice, citrus, bitter",
          tasteProfile: "Bittersweet, herbal, complex, citrus",
          texture: "Medium-bodied, warming",
          alcoholContent: 28,
          sugarContent: 12,
          acidity: 3,
        }
      },
      // === APEROL ===
      {
        name: "Aperol",
        updates: {
          category: "Liqueur",
          type: "Aperitif Liqueur",
          productName: "Aperol",
          aroma: "Orange, herbs, subtle bitter",
          tasteProfile: "Sweet orange, herbal, slightly bitter",
          texture: "Light-bodied, refreshing",
          alcoholContent: 11,
          sugarContent: 15,
          acidity: 1.5,
        }
      },
      // === WHITE CREME DE MENTHE ===
      {
        name: "White Crème de Menthe",
        updates: {
          category: "Liqueur",
          type: "Mint Liqueur",
          aroma: "Peppermint, menthol, floral",
          tasteProfile: "Fresh mint, crisp, sweet",
          texture: "Light-bodied, cooling aftertaste",
          alcoholContent: 25,
          sugarContent: 20,
          acidity: 0,
        }
      },
      // === GRENADINE ===
      {
        name: "Grenadine",
        updates: {
          category: "Syrup",
          type: "Pomegranate Syrup",
          aroma: "Pomegranate, sweet, fruity",
          tasteProfile: "Sweet pomegranate, fruity, smooth",
          texture: "Syrupy, thick, sweet",
          alcoholContent: 0,
          sugarContent: 65,
          acidity: 2,
        }
      },
      // === LIME JUICE ===
      {
        name: "Lime Juice",
        updates: {
          category: "Juice",
          type: "Fresh Lime Juice",
          aroma: "Lime, citrus, fresh",
          tasteProfile: "Sour, bright, acidic citrus",
          texture: "Thin, watery, acidic",
          alcoholContent: 0,
          sugarContent: 3,
          acidity: 9,
        }
      },
      // === LEMON JUICE ===
      {
        name: "Lemon Juice",
        updates: {
          category: "Juice",
          type: "Fresh Lemon Juice",
          aroma: "Lemon, citrus, fresh",
          tasteProfile: "Sour, bright, acidic citrus",
          texture: "Thin, watery, acidic",
          alcoholContent: 0,
          sugarContent: 2,
          acidity: 9,
        }
      },
      // === ORANGE JUICE ===
      {
        name: "Orange Juice",
        updates: {
          category: "Juice",
          type: "Fresh Orange Juice",
          aroma: "Orange, citrus, fruity, sweet",
          tasteProfile: "Sweet, fruity, citrus, balanced",
          texture: "Thin, watery, refreshing",
          alcoholContent: 0,
          sugarContent: 10,
          acidity: 3,
        }
      },
      // === GINGER BEER ===
      {
        name: "Ginger Beer",
        updates: {
          category: "Soft Drink",
          type: "Spiced Non-Alcoholic Drink",
          aroma: "Ginger, spice, slight carbonation",
          tasteProfile: "Spicy ginger, slightly sweet, warming",
          texture: "Carbonated, spicy finish",
          alcoholContent: 0,
          sugarContent: 8,
          acidity: 2,
        }
      },
      // === COLA ===
      {
        name: "Cola",
        updates: {
          category: "Soft Drink",
          type: "cola",
          aroma: "Cola, vanilla, sweet",
          tasteProfile: "Sweet, vanilla, caramel, fizzy",
          texture: "Carbonated, crisp, sweet",
          alcoholContent: 0,
          sugarContent: 11,
          acidity: 2.5,
        }
      },
      // === TONIC WATER ===
      {
        name: "Tonic Water",
        updates: {
          category: "Soft Drink",
          type: "Tonic",
          aroma: "Quinine, citrus, herbal",
          tasteProfile: "Bitter quinine, citrus, herbaceous",
          texture: "Carbonated, crisp, bitter",
          alcoholContent: 0,
          sugarContent: 8,
          acidity: 3,
        }
      },
      // === SODA WATER ===
      {
        name: "Soda Water",
        updates: {
          category: "Soft Drink",
          type: "Soda Water",
          aroma: "Neutral, slight mineral",
          tasteProfile: "Neutral, clean, slightly mineral",
          texture: "Carbonated, crisp, neutral",
          alcoholContent: 0,
          sugarContent: 0,
          acidity: 1,
        }
      },
      // === SIMPLE SYRUP ===
      {
        name: "Simple Syrup",
        updates: {
          category: "Syrup",
          type: "Sugar Syrup",
          aroma: "Sweet, neutral",
          tasteProfile: "Pure sweet, neutral flavor",
          texture: "Syrupy, thick, smooth",
          alcoholContent: 0,
          sugarContent: 50,
          acidity: 0,
        }
      },
      // === EGG WHITE ===
      {
        name: "Egg White",
        updates: {
          category: "Ingredient",
          type: "Egg White",
          aroma: "Neutral, subtle egg",
          tasteProfile: "Neutral, creates foamy texture",
          texture: "Creates silky, foamy texture",
          alcoholContent: 0,
          sugarContent: 0,
          acidity: 0,
        }
      },
    ];

    let updated = 0;
    let notFound = 0;

    for (const item of bottleUpdates) {
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

    console.log(`\n=== Update Summary ===`);
    console.log(`Updated: ${updated}`);
    console.log(`Not found: ${notFound}`);

  } catch (error) {
    console.error('Critical error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
