const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debug() {
    const aperolSpritz = await prisma.cocktail.findFirst({
        where: { name: "Aperol Spritz" },
        include: { techniques: true }
    });

    const mixList = JSON.parse(aperolSpritz.mixList);
    const bottles = await prisma.bottle.findMany();
    const bottlesMap = bottles.reduce((acc, b) => ({ ...acc, [b.id]: b }), {});

    console.log("Checking Aperol Spritz mixList coverage:");
    mixList.forEach(item => {
        const bottle = bottlesMap[item.bottleId];
        if (bottle) {
            console.log(`- FOUND: ${item.name} (ID: ${item.bottleId}) -> Sugar: ${bottle.sugarContent}, Acid: ${bottle.acidity}, Alc: ${bottle.alcoholContent}`);
        } else {
            console.log(`- NOT FOUND: ${item.name} (ID: ${item.bottleId})`);
        }
    });
}

debug().finally(() => process.exit(0));
