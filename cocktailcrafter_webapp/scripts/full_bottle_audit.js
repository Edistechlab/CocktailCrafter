const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const bottles = await prisma.bottle.findMany();

    const stats = {
        total: bottles.length,
        missingDescription: 0,
        missingAroma: 0,
        missingTaste: 0,
        missingTexture: 0,
        missingAlcohol: 0,
        missingAcidity: 0,
        missingSugar: 0
    };

    const incompleteBottles = [];

    for (const b of bottles) {
        let incomplete = false;
        if (!b.description) { stats.missingDescription++; incomplete = true; }
        if (!b.aroma) { stats.missingAroma++; incomplete = true; }
        if (!b.tasteProfile) { stats.missingTaste++; incomplete = true; }
        if (!b.texture) { stats.missingTexture++; incomplete = true; }
        if (b.alcoholContent === null) { stats.missingAlcohol++; incomplete = true; }

        if (incomplete) {
            incompleteBottles.push(b.name);
        }
    }

    console.log('--- Bottle Field Coverage ---');
    console.log(`Total Bottles: ${stats.total}`);
    console.log(`Missing Description: ${stats.missingDescription}`);
    console.log(`Missing Aroma: ${stats.missingAroma}`);
    console.log(`Missing Taste Profile: ${stats.missingTaste}`);
    console.log(`Missing Texture: ${stats.missingTexture}`);
    console.log(`Missing Alcohol Content: ${stats.missingAlcohol}`);

    if (incompleteBottles.length > 0) {
        console.log(`\nIncomplete Bottles (${incompleteBottles.length}):`);
        console.log(incompleteBottles.sort().join(', '));
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
