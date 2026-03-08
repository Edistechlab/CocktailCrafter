const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Starting migration...");
    const bottles = await prisma.bottle.findMany({
        include: {
            alternative: true,
            nonAlcoholic: true
        }
    });

    for (const bottle of bottles) {
        console.log(`Processing ${bottle.name}...`);

        let altLinks = [];
        let naLinks = [];

        // 1. Existing foreign key references
        if (bottle.alternativeId) {
            altLinks.push({ id: bottle.alternativeId });
        }
        if (bottle.nonAlcoholicId) {
            naLinks.push({ id: bottle.nonAlcoholicId });
        }

        // 2. Parse 'alternatives' string ("Alt 1, Alt 2")
        if (bottle.alternatives) {
            const rawAlts = bottle.alternatives.split(',').map(s => s.trim()).filter(Boolean);
            for (const altName of rawAlts) {
                // Find or create
                let altBottle = await prisma.bottle.findFirst({
                    where: { name: { equals: altName } } // Case sensitive usually fine, or lowercase search?
                });

                if (!altBottle) {
                    console.log(`Creating missing alternative bottle: ${altName}`);
                    altBottle = await prisma.bottle.create({
                        data: {
                            name: altName,
                            // Copy some parameters from the parent?
                            tasteProfile: bottle.tasteProfile,
                            alcoholContent: bottle.alcoholContent,
                            texture: bottle.texture,
                            aroma: bottle.aroma,
                            acidity: bottle.acidity,
                            sugarContent: bottle.sugarContent,
                        }
                    });
                }
                // Avoid self-referencing if someone put its own name
                if (altBottle.id !== bottle.id) {
                    altLinks.push({ id: altBottle.id });
                }
            }
        }

        // 3. Parse 'nonAlcoholicOptions' string
        if (bottle.nonAlcoholicOptions) {
            const rawNAs = bottle.nonAlcoholicOptions.split(',').map(s => s.trim()).filter(Boolean);
            for (const naName of rawNAs) {
                let naBottle = await prisma.bottle.findFirst({
                    where: { name: { equals: naName } }
                });

                if (!naBottle) {
                    console.log(`Creating missing NA bottle: ${naName}`);
                    naBottle = await prisma.bottle.create({
                        data: {
                            name: naName,
                            tasteProfile: bottle.tasteProfile,
                            alcoholContent: 0, // Force NA
                            texture: bottle.texture,
                            aroma: bottle.aroma,
                            acidity: bottle.acidity,
                            sugarContent: bottle.sugarContent,
                            // Non-alcoholic typically fall under the same category or root?
                        }
                    });
                }
                if (naBottle.id !== bottle.id) {
                    naLinks.push({ id: naBottle.id });
                }
            }
        }

        // De-duplicate links just in case
        const uniqueAltLinks = Array.from(new Set(altLinks.map(a => a.id))).map(id => ({ id }));
        const uniqueNaLinks = Array.from(new Set(naLinks.map(a => a.id))).map(id => ({ id }));

        // Connect everything in the new arrays
        if (uniqueAltLinks.length > 0 || uniqueNaLinks.length > 0) {
            await prisma.bottle.update({
                where: { id: bottle.id },
                data: {
                    alternativeBottles: { connect: uniqueAltLinks },
                    nonAlcoholicBottles: { connect: uniqueNaLinks }
                }
            });
            console.log(`-> Linked ${uniqueAltLinks.length} alternatives and ${uniqueNaLinks.length} N/A options.`);
        }
    }

    console.log("Migration finished.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
