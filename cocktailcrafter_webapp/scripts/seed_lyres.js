const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();

  try {
    // First, check if Lyre's bottles exist
    const lyresCount = await prisma.bottle.count({
      where: { name: { contains: "Lyre" } }
    });
    console.log(`Existing Lyre's bottles: ${lyresCount}`);

    // Lyre's product data with proper metrics
    const lyresProducts = [
      {
        name: "Lyre's American Malt",
        category: "Whiskey Alternative",
        type: "Non-Alcoholic Whiskey",
        productName: "Lyre's American Malt",
        alcoholContent: 0,
        aroma: "Caramel, vanilla, oak",
        tasteProfile: "Warm, smooth, woody with sweet caramel notes",
        texture: "Light-bodied, warming finish",
        sugarContent: 0.5,
        acidity: 1.0,
      },
      {
        name: "Lyre's Highland Malt",
        category: "Whiskey Alternative",
        type: "Non-Alcoholic Whiskey",
        productName: "Lyre's Highland Malt",
        alcoholContent: 0,
        aroma: "Smoky, peat, heather",
        tasteProfile: "Smoky, earthy with subtle sweetness",
        texture: "Light-bodied, smoky finish",
        sugarContent: 0.5,
        acidity: 1.0,
      },
      {
        name: "Lyre's Dry London Spirit",
        category: "Gin Alternative",
        type: "Non-Alcoholic Gin",
        productName: "Lyre's Dry London Spirit",
        alcoholContent: 0,
        aroma: "Juniper, botanicals, citrus",
        tasteProfile: "Crisp juniper-forward, herbaceous, dry",
        texture: "Light-bodied, clean, refreshing",
        sugarContent: 0.5,
        acidity: 2.5,
      },
      {
        name: "Lyre's White Cane Spirit",
        category: "Rum Alternative",
        type: "Non-Alcoholic Rum",
        productName: "Lyre's White Cane Spirit",
        alcoholContent: 0,
        aroma: "Vanilla, sugarcane, tropical",
        tasteProfile: "Sweet, light, tropical with vanilla finish",
        texture: "Light-bodied, smooth",
        sugarContent: 1.0,
        acidity: 0.5,
      },
      {
        name: "Lyre's Dark Cane Spirit",
        category: "Rum Alternative",
        type: "Non-Alcoholic Dark Rum",
        productName: "Lyre's Dark Cane Spirit",
        alcoholContent: 0,
        aroma: "Molasses, caramel, spice",
        tasteProfile: "Rich, dark caramel, molasses, spiced",
        texture: "Medium-bodied, warming",
        sugarContent: 2.0,
        acidity: 0.5,
      },
      {
        name: "Lyre's Agave Blanco",
        category: "Tequila Alternative",
        type: "Non-Alcoholic Tequila",
        productName: "Lyre's Agave Blanco",
        alcoholContent: 0,
        aroma: "Agave, citrus, mineral",
        tasteProfile: "Crisp agave forward, citrus notes, clean",
        texture: "Light-bodied, refreshing",
        sugarContent: 0.5,
        acidity: 2.0,
      },
      {
        name: "Lyre's Aperitif Dry",
        category: "Vermouth Alternative",
        type: "Non-Alcoholic Dry Vermouth",
        productName: "Lyre's Aperitif Dry",
        alcoholContent: 0,
        aroma: "Herbal, botanical, dry",
        tasteProfile: "Dry, herbal, bitter-sweet balance",
        texture: "Thin, crisp",
        sugarContent: 0.5,
        acidity: 3.5,
      },
      {
        name: "Lyre's Aperitif Rosso",
        category: "Vermouth Alternative",
        type: "Non-Alcoholic Sweet Vermouth",
        productName: "Lyre's Aperitif Rosso",
        alcoholContent: 0,
        aroma: "Herbal, spice, cherry",
        tasteProfile: "Sweet, herbal, fruit-forward",
        texture: "Syrupy, smooth",
        sugarContent: 15.0,
        acidity: 0.5,
      },
      {
        name: "Lyre's Aperitif White",
        category: "Vermouth Alternative",
        type: "Non-Alcoholic Vermouth",
        productName: "Lyre's Aperitif White",
        alcoholContent: 0,
        aroma: "Herbal, citrus, botanical",
        tasteProfile: "Light, herbal, citrus notes",
        texture: "Light, crisp",
        sugarContent: 10.0,
        acidity: 3.5,
      },
      {
        name: "Lyre's Italian Spritz",
        category: "Aperol Alternative",
        type: "Non-Alcoholic Spritz",
        productName: "Lyre's Italian Spritz",
        alcoholContent: 0,
        aroma: "Orange, herbal, bitter",
        tasteProfile: "Bittersweet, orange, herbaceous",
        texture: "Syrupy, smooth",
        sugarContent: 12.0,
        acidity: 2.0,
      },
      {
        name: "Lyre's Coffee Originale",
        category: "Liqueur Alternative",
        type: "Non-Alcoholic Coffee Liqueur",
        productName: "Lyre's Coffee Originale",
        alcoholContent: 0,
        aroma: "Coffee, chocolate, vanilla",
        tasteProfile: "Rich coffee, chocolate, smooth finish",
        texture: "Rich and oily, creamy",
        sugarContent: 40.0,
        acidity: 0.0,
      },
      {
        name: "Lyre's Amaretti",
        category: "Liqueur Alternative",
        type: "Non-Alcoholic Almond Liqueur",
        productName: "Lyre's Amaretti",
        alcoholContent: 0,
        aroma: "Almond, vanilla, sweet",
        tasteProfile: "Sweet almond, vanilla, smooth",
        texture: "Velvety, creamy",
        sugarContent: 15.0,
        acidity: 0.0,
      },
      {
        name: "Lyre's Absinthe",
        category: "Absinthe Alternative",
        type: "Non-Alcoholic Absinthe",
        productName: "Lyre's Absinthe",
        alcoholContent: 0,
        aroma: "Anise, herbal, botanical",
        tasteProfile: "Anise-forward, herbal, complex",
        texture: "Light, crisp",
        sugarContent: 0.5,
        acidity: 0.0,
      },
    ];

    let created = 0;
    let skipped = 0;

    for (const product of lyresProducts) {
      const existingBottle = await prisma.bottle.findUnique({
        where: { name: product.name }
      });

      if (!existingBottle) {
        await prisma.bottle.create({ data: product });
        console.log(`✓ Created: ${product.name}`);
        created++;
      } else {
        console.log(`✓ Already exists: ${product.name}`);
        skipped++;
      }
    }

    console.log(`\n=== Summary ===`);
    console.log(`Created: ${created}`);
    console.log(`Skipped: ${skipped}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
