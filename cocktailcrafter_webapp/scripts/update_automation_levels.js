const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const automationLevels = {
        "Aperol Spritz": 4,
        "Aviation": 5,
        "Black Russian": 5,
        "Boulevardier": 5,
        "Caipirinha": 3,
        "Clover Club": 3,
        "Cosmopolitan": 5,
        "Cuba Libre": 4,
        "Daiquiri": 5,
        "Dark ’n’ Stormy": 4,
        "Espresso Martini": 3,
        "French 75": 4,
        "Gimlet": 5,
        "Godfather": 5,
        "Hurricane": 5,
        "Kir Royale": 4,
        "Mai Tai": 5,
        "Manhattan": 5,
        "Margarita": 5,
        "Martini": 5,
        "Mint Julep": 2,
        "Mojito": 3,
        "Moscow Mule": 4,
        "Negroni": 5,
        "Old Fashioned": 5,
        "Paloma": 4,
        "Pisco Sour": 2,
        "Piña Colada": 3,
        "Ramos Gin Fizz": 2,
        "Rusty Nail": 5,
        "Sazerac": 4,
        "Sidecar": 5,
        "Singapore Sling": 4,
        "Tom Collins": 4,
        "Vesper Martini": 5,
        "Whiskey Sour": 5,
        "White Russian": 3,
        "Zombie": 3
    };

    console.log("Updating automation levels for cocktails...");

    for (const [name, level] of Object.entries(automationLevels)) {
        const cocktail = await prisma.cocktail.findFirst({
            where: { name: name }
        });

        if (cocktail) {
            await prisma.cocktail.update({
                where: { id: cocktail.id },
                data: { automationLevel: level }
            });
            console.log(`✅ ${name}: Set to Level ${level}`);
        } else {
            console.log(`⚠️ ${name}: Not found in database.`);
        }
    }

    console.log("\nUpdate complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
