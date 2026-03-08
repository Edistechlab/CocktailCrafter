const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const cocktails = await prisma.cocktail.findMany({ select: { id: true, name: true, recipe: true } });
    const bottles = await prisma.bottle.findMany({
        select: { id: true, name: true, alcoholContent: true, nonAlcoholicId: true }
    });

    const bottleMap = new Map(bottles.map(b => [b.id, b]));

    const problematicCocktails = [];
    const alcoholicBottlesWithNoAlt = new Set();

    for (const cocktail of cocktails) {
        let recipeArray = [];
        try {
            recipeArray = JSON.parse(cocktail.recipe || '[]');
        } catch (e) {
            continue;
        }

        const missingAlts = [];
        for (const ingredient of recipeArray) {
            const bottle = bottleMap.get(ingredient.bottleId);
            if (!bottle) {
                // missingAlts.push({ name: ingredient.name, reason: 'Bottle not found in database' });
                continue;
            }

            // If it's an alcoholic bottle (> 0% alcohol) and has no linked non-alcoholic alternative
            if (bottle.alcoholContent > 0 && !bottle.nonAlcoholicId) {
                missingAlts.push({
                    name: bottle.name,
                    alcoholContent: bottle.alcoholContent
                });
                alcoholicBottlesWithNoAlt.add(bottle.name);
            }
        }

        if (missingAlts.length > 0) {
            problematicCocktails.push({
                name: cocktail.name,
                missingAlts
            });
        }
    }

    console.log('--- Summary ---');
    console.log(`Total Cocktails: ${cocktails.length}`);
    console.log(`Problematic Cocktails (Missing NA Alternatives): ${problematicCocktails.length}`);
    console.log('----------------\n');

    if (alcoholicBottlesWithNoAlt.size > 0) {
        console.log('Alcoholic Bottles with NO Non-Alcoholic Alternative:');
        console.log([...alcoholicBottlesWithNoAlt].sort().join(', '));
        console.log('\n');
    }

    if (problematicCocktails.length > 0) {
        console.log('Breakdown of problematic cocktails:');
        problematicCocktails.forEach(c => {
            console.log(`- ${c.name}: missing ${c.missingAlts.map(a => `${a.name} (${a.alcoholContent}%)`).join(', ')}`);
        });
    } else {
        console.log('All cocktails have non-alcoholic alternatives linked for all alcoholic ingredients!');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
