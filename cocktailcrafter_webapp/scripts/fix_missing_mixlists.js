const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Fixing missing mixList data for library cocktails...');

    const bottles = await prisma.bottle.findMany();
    const findId = (name) => {
        const b = bottles.find(b => b.name === name);
        if (!b) console.warn(`⚠️ Bottle not found: ${name}`);
        return b ? b.id : null;
    };

    const updates = [
        {
            name: "Gin Tonic",
            mixList: [
                { bottleId: findId("Gin"), name: "Gin", amount: 2, pourOrder: 1 },
                { bottleId: findId("Tonic Water"), name: "Tonic Water", amount: 4, pourOrder: 2 }
            ]
        },
        {
            name: "Moscow Mule",
            mixList: [
                { bottleId: findId("Vodka"), name: "Vodka", amount: 2, pourOrder: 1 },
                { bottleId: findId("Lime Juice"), name: "Lime Juice", amount: 0.5, pourOrder: 2 },
                { bottleId: findId("Ginger Beer"), name: "Ginger Beer", amount: 4, pourOrder: 3 }
            ]
        },
        {
            name: "Americano",
            mixList: [
                { bottleId: findId("Campari"), name: "Campari", amount: 1, pourOrder: 1 },
                { bottleId: findId("Sweet Vermouth"), name: "Sweet Vermouth", amount: 1, pourOrder: 1 },
                { bottleId: findId("Soda Water"), name: "Soda Water", amount: 1, pourOrder: 2 }
            ]
        },
        {
            name: "Espresso Martini",
            mixList: [
                { bottleId: findId("Vodka"), name: "Vodka", amount: 2, pourOrder: 1 },
                { bottleId: findId("Coffee Liqueur"), name: "Coffee Liqueur", amount: 1, pourOrder: 1 },
                { bottleId: findId("Simple Syrup"), name: "Simple Syrup", amount: 0.25, pourOrder: 1 }
            ]
        },
        {
            name: "Gimlet",
            mixList: [
                { bottleId: findId("Gin"), name: "Gin", amount: 2, pourOrder: 1 },
                { bottleId: findId("Lime Juice"), name: "Lime Juice", amount: 0.75, pourOrder: 1 },
                { bottleId: findId("Simple Syrup"), name: "Simple Syrup", amount: 0.75, pourOrder: 1 }
            ]
        },
        {
            name: "Black Russian",
            mixList: [
                { bottleId: findId("Vodka"), name: "Vodka", amount: 2, pourOrder: 1 },
                { bottleId: findId("Coffee Liqueur"), name: "Coffee Liqueur", amount: 1, pourOrder: 1 }
            ]
        },
        {
            name: "Negroni",
            mixList: [
                { bottleId: findId("Gin"), name: "Gin", amount: 1, pourOrder: 1 },
                { bottleId: findId("Campari"), name: "Campari", amount: 1, pourOrder: 1 },
                { bottleId: findId("Sweet Vermouth"), name: "Sweet Vermouth", amount: 1, pourOrder: 1 }
            ]
        },
        {
            name: "Whiskey Sour",
            mixList: [
                { bottleId: findId("Bourbon Whiskey"), name: "Bourbon Whiskey", amount: 2, pourOrder: 1 },
                { bottleId: findId("Lemon Juice"), name: "Lemon Juice", amount: 0.75, pourOrder: 1 },
                { bottleId: findId("Simple Syrup"), name: "Simple Syrup", amount: 0.5, pourOrder: 1 }
            ]
        },
        {
            name: "Daiquiri",
            mixList: [
                { bottleId: findId("White Rum"), name: "White Rum", amount: 2, pourOrder: 1 },
                { bottleId: findId("Lime Juice"), name: "Lime Juice", amount: 0.75, pourOrder: 1 },
                { bottleId: findId("Simple Syrup"), name: "Simple Syrup", amount: 0.5, pourOrder: 1 }
            ]
        },
        {
            name: "Dark and Stormy",
            mixList: [
                { bottleId: findId("Dark Rum"), name: "Dark Rum", amount: 2, pourOrder: 1 },
                { bottleId: findId("Lime Juice"), name: "Lime Juice", amount: 0.5, pourOrder: 2 },
                { bottleId: findId("Ginger Beer"), name: "Ginger Beer", amount: 4, pourOrder: 3 }
            ]
        },
        {
            name: "Kir Royale",
            mixList: [
                { bottleId: findId("Champagne"), name: "Champagne", amount: 4, pourOrder: 1 },
                { bottleId: findId("Creme de Cassis"), name: "Creme de Cassis", amount: 0.5, pourOrder: 2 }
            ]
        },
        {
            name: "Singapore Sling",
            mixList: [
                { bottleId: findId("Gin"), name: "Gin", amount: 1.5, pourOrder: 1 },
                { bottleId: findId("Cherry Liqueur"), name: "Cherry Liqueur", amount: 0.5, pourOrder: 1 },
                { bottleId: findId("Triple Sec"), name: "Triple Sec", amount: 0.25, pourOrder: 1 },
                { bottleId: findId("Pineapple Juice"), name: "Pineapple Juice", amount: 4, pourOrder: 2 },
                { bottleId: findId("Lime Juice"), name: "Lime Juice", amount: 0.5, pourOrder: 2 }
            ]
        },
        {
            name: "Zombie",
            mixList: [
                { bottleId: findId("White Rum"), name: "White Rum", amount: 1.5, pourOrder: 1 },
                { bottleId: findId("Dark Rum"), name: "Dark Rum", amount: 1.5, pourOrder: 1 },
                { bottleId: findId("Apricot Brandy"), name: "Apricot Brandy", amount: 0.5, pourOrder: 1 },
                { bottleId: findId("Pineapple Juice"), name: "Pineapple Juice", amount: 2, pourOrder: 2 },
                { bottleId: findId("Lime Juice"), name: "Lime Juice", amount: 1, pourOrder: 2 }
            ]
        },
        {
            name: "Caipirinha",
            mixList: [
                { bottleId: findId("Cachaca"), name: "Cachaca", amount: 2, pourOrder: 1 },
                { bottleId: findId("Simple Syrup"), name: "Simple Syrup", amount: 0.75, pourOrder: 1 },
                { bottleId: findId("Lime Juice"), name: "Lime Juice", amount: 1, pourOrder: 1 }
            ]
        },
        {
            name: "Hurricane",
            mixList: [
                { bottleId: findId("White Rum"), name: "White Rum", amount: 2, pourOrder: 1 },
                { bottleId: findId("Dark Rum"), name: "Dark Rum", amount: 2, pourOrder: 1 },
                { bottleId: findId("Passion Fruit Syrup"), name: "Passion Fruit Syrup", amount: 1, pourOrder: 1 },
                { bottleId: findId("Orange Juice"), name: "Orange Juice", amount: 2, pourOrder: 2 },
                { bottleId: findId("Lime Juice"), name: "Lime Juice", amount: 1, pourOrder: 2 }
            ]
        }
    ];

    for (const update of updates) {
        if (update.mixList.some(i => !i.bottleId)) {
            console.error(`❌ Skipping ${update.name} due to missing bottles.`);
            continue;
        }
        await prisma.cocktail.updateMany({
            where: { name: update.name },
            data: { mixList: JSON.stringify(update.mixList) }
        });
        console.log(`✅ Fixed ${update.name}`);
    }
}

main().finally(() => process.exit(0));
