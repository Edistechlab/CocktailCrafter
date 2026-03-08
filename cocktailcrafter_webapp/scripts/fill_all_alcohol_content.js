const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();

  try {
    console.log('Filling alcohol content for ALL bottles by category...\n');

    // Get all unique categories
    const categories = await prisma.bottle.findMany({
      select: { category: true },
      distinct: ['category']
    });

    // Map of category to default alcohol content
    const categoryDefaults = {
      'Whiskey': 40,
      'Bourbon Whiskey': 40,
      'Rye Whiskey': 40,
      'Scotch Whisky': 40,
      'Irish Whiskey': 40,
      'Whiskey Alternative': 0,
      'Gin': 40,
      'London Dry Gin': 40,
      'Old Tom Gin': 40,
      'Plymouth Gin': 41.2,
      'Gin Alternative': 0,
      'Rum': 40,
      'White Rum': 40,
      'Dark Rum': 40,
      'Spiced Rum': 35,
      'Aged Rum': 40,
      'Rum Alternative': 0,
      'Vodka': 40,
      'Tequila': 40,
      'Tequila Alternative': 0,
      'Mezcal': 42,
      'Brandy': 40,
      'Cognac': 40,
      'Vermouth': 16,
      'Dry Vermouth': 18,
      'Sweet Vermouth': 16,
      'Vermouth Alternative': 0,
      'Liqueur': 28,
      'Coffee Liqueur': 20,
      'Amaretto': 28,
      'Hazelnut Liqueur': 20,
      'Almond Liqueur': 28,
      'Chocolate Liqueur': 25,
      'Cream Liqueur': 17,
      'Liqueur Alternative': 0,
      'Absinthe': 68,
      'Absinthe Alternative': 0,
      'Amaro': 30,
      'Bitters': 45,
      'Aperitif Wine': 12,
      'Sparkling Wine': 12,
      'Aperol Alternative': 0,
      'Juice': 0,
      'Soft Drink': 0,
      'Syrup': 0,
      'Ingredient': 0,
    };

    let updated = 0;
    let total = 0;

    for (const cat of categories) {
      const category = cat.category;
      const defaultAlcohol = categoryDefaults[category] || 0;

      // Find all bottles in this category WITHOUT alcohol content
      const bottlesWithoutAlcohol = await prisma.bottle.findMany({
        where: {
          category: category,
          alcoholContent: null
        }
      });

      total += bottlesWithoutAlcohol.length;

      // Update these bottles with the category default
      for (const bottle of bottlesWithoutAlcohol) {
        await prisma.bottle.update({
          where: { id: bottle.id },
          data: { alcoholContent: defaultAlcohol }
        });
        updated++;
      }

      if (bottlesWithoutAlcohol.length > 0) {
        console.log(`✓ ${category}: ${bottlesWithoutAlcohol.length} bottles updated → ${defaultAlcohol}%`);
      }
    }

    // Check final result
    const withAlcohol = await prisma.bottle.count({
      where: { alcoholContent: { not: null } }
    });
    const totalBottles = await prisma.bottle.count();

    console.log(`\n=== FINAL RESULT ===`);
    console.log(`Total bottles with alcohol content: ${withAlcohol} / ${totalBottles}`);
    console.log(`Coverage: ${Math.round(withAlcohol / totalBottles * 100)}%`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
