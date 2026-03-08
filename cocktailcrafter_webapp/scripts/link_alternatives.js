const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();

  try {
    console.log('Setting up bottle alternatives (alcoholic ↔ non-alcoholic)...\n');

    // Map of alcoholic → non-alcoholic Lyre's alternative
    const alternativeMappings = [
      { alcoholic: "Whiskey", nonAlcoholic: "Lyre's American Malt" },
      { alcoholic: "Gin", nonAlcoholic: "Lyre's Dry London Spirit" },
      { alcoholic: "Rum", nonAlcoholic: "Lyre's White Cane Spirit" },
      { alcoholic: "Tequila", nonAlcoholic: "Lyre's Agave Blanco" },
      { alcoholic: "Vodka", nonAlcoholic: "Lyre's Dry London Spirit" }, // Use Gin alternative
      { alcoholic: "Brandy", nonAlcoholic: "Lyre's Aperitif Rosso" },
      { alcoholic: "Vermouth", nonAlcoholic: "Lyre's Aperitif Dry" }, // Dry vermouth option
      { alcoholic: "Triple Sec", nonAlcoholic: "Lyre's Aperitif White" },
      { alcoholic: "Amaretto", nonAlcoholic: "Lyre's Amaretti" },
      { alcoholic: "Coffee Liqueur", nonAlcoholic: "Lyre's Coffee Originale" },
      { alcoholic: "Cointreau", nonAlcoholic: "Lyre's Aperitif White" },
      { alcoholic: "Campari", nonAlcoholic: "Lyre's Italian Spritz" },
      { alcoholic: "Aperol", nonAlcoholic: "Lyre's Italian Spritz" },
    ];

    let linked = 0;
    let failed = 0;

    for (const mapping of alternativeMappings) {
      try {
        const alcoholicBottle = await prisma.bottle.findFirst({
          where: { name: mapping.alcoholic }
        });

        const nonAlcoholicBottle = await prisma.bottle.findFirst({
          where: { name: mapping.nonAlcoholic }
        });

        if (alcoholicBottle && nonAlcoholicBottle) {
          // Update alcoholic bottle to point to non-alcoholic
          await prisma.bottle.update({
            where: { id: alcoholicBottle.id },
            data: { nonAlcoholicId: nonAlcoholicBottle.id }
          });

          console.log(`✓ Linked: ${mapping.alcoholic} (0%) ← ${mapping.nonAlcoholic}`);
          linked++;
        } else {
          if (!alcoholicBottle) console.log(`✗ Not found (alcoholic): ${mapping.alcoholic}`);
          if (!nonAlcoholicBottle) console.log(`✗ Not found (NA): ${mapping.nonAlcoholic}`);
          failed++;
        }
      } catch (error) {
        console.error(`✗ Error linking ${mapping.alcoholic}:`, error.message);
        failed++;
      }
    }

    console.log(`\n=== Alternative Linking Summary ===`);
    console.log(`Linked: ${linked}`);
    console.log(`Failed: ${failed}`);

  } catch (error) {
    console.error('Critical error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
