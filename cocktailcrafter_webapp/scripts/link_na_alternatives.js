const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const bottles = await prisma.bottle.findMany();

    for (const bottle of bottles) {
        if (bottle.alcoholContent > 0 && !bottle.nonAlcoholicId) {
            if (bottle.nonAlcoholicOptions) {
                // Try to find the non-alcoholic bottle by name in the options
                const naName = bottle.nonAlcoholicOptions.trim();
                const naBottle = await prisma.bottle.findFirst({
                    where: { name: naName, alcoholContent: 0 }
                });

                if (naBottle) {
                    await prisma.bottle.update({
                        where: { id: bottle.id },
                        data: { nonAlcoholicId: naBottle.id }
                    });
                    console.log(`Linked ${bottle.name} to ${naBottle.name} (via Options)`);
                    continue;
                }
            }

            // Try automatic mapping (e.g. "Gin" -> "Lyre's Dry London Spirit")
            // This part is manual mapping for some common ones
            const commonMappings = {
                'Gin': 'Lyre\'s Dry London Spirit',
                'White Rum': 'Lyre\'s White Cane Spirit',
                'Dark Rum': 'Lyre\'s Dark Cane Spirit',
                'Whiskey': 'Lyre\'s Highland Malt',
                'Bourbon': 'Lyre\'s American Malt',
                'Tequila': 'Lyre\'s Agave Blanco',
                'Campari': 'Lyre\'s Italian Orange',
                'Aperol': 'Lyre\'s Italian Spritz',
                'Sweet Vermouth': 'Lyre\'s Aperitif Rosso',
                'Dry Vermouth': 'Lyre\'s Aperitif Dry',
                'Absinthe': 'Lyre’s Absinthe',
                'Amaretto': 'Lyre’s Amaretti',
                'Coffee Liqueur': 'Lyre\'s Coffee Originale',
                'Triple Sec': 'Triple Sec Syrup'
            };

            const mappedName = commonMappings[bottle.name];
            if (mappedName) {
                const naBottle = await prisma.bottle.findFirst({
                    where: { name: mappedName }
                });

                if (naBottle) {
                    await prisma.bottle.update({
                        where: { id: bottle.id },
                        data: { nonAlcoholicId: naBottle.id }
                    });
                    console.log(`Linked ${bottle.name} to ${naBottle.name} (via Map)`);
                }
            }
        }
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
