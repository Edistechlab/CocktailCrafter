const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const pourOrderMap = {
        "Aperol Spritz": {
            "Aperol": 1,
            "Prosecco": 1,
            "Soda Water": 2
        },
        "Dark ’n’ Stormy": {
            "Lime Juice": 1,
            "Ginger Beer": 1,
            "Dark Rum": 2 // Floated
        },
        "White Russian": {
            "Vodka": 1,
            "Kahlua": 1,
            "Cream": 2 // Layered/Top
        },
        "Mojito": {
            "White Rum": 1,
            "Lime Juice": 1,
            "Simple Syrup": 1,
            "Soda Water": 2
        },
        "Tom Collins": {
            "London Dry Gin": 1,
            "Gin": 1,
            "Lemon Juice": 1,
            "Simple Syrup": 1,
            "Soda Water": 2
        },
        "French 75": {
            "Gin": 1,
            "Lemon Juice": 1,
            "Simple Syrup": 1,
            "Champagne": 2
        },
        "Kir Royale": {
            "Crème de Cassis": 1,
            "Champagne": 2
        },
        "Ramos Gin Fizz": {
            "Gin": 1,
            "Lemon Juice": 1,
            "Lime Juice": 1,
            "Simple Syrup": 1,
            "Cream": 1,
            "Soda Water": 2
        },
        "Cuba Libre": {
            "White Rum": 1,
            "Lime Juice": 1,
            "Cola": 2
        },
        "Paloma": {
            "Tequila Blanco": 1,
            "Lime Juice": 1,
            "Soda Water": 2,
            "Grapefruit Soda": 2
        },
        "Moscow Mule": {
            "Vodka": 1,
            "Lime Juice": 1,
            "Ginger Beer": 2
        },
        "Zombie": {
            "White Rum": 1,
            "Dark Rum": 1,
            "Lime Juice": 1,
            "Pineapple Juice": 1,
            "Grapefruit Juice": 1,
            "Apricot Liqueur": 1,
            "Grenadine": 1,
            "Overproof Rum": 2 // Float
        },
        "Americano": {
            "Campari": 1,
            "Sweet Vermouth": 1,
            "Soda Water": 2
        },
        "Gin Tonic": {
            "Gin": 1,
            "Tonic Water": 2
        }
    };

    const cocktails = await prisma.cocktail.findMany();

    console.log("Starting precision pour order update...");

    for (const cocktail of cocktails) {
        if (!cocktail.recipe) continue;

        let recipe;
        try {
            recipe = JSON.parse(cocktail.recipe);
        } catch (e) {
            continue;
        }

        if (!Array.isArray(recipe)) continue;

        const customOrders = pourOrderMap[cocktail.name];
        let hasChanges = false;

        const updatedRecipe = recipe.map(ing => {
            let order = 1; // Default

            if (customOrders && customOrders[ing.name]) {
                order = customOrders[ing.name];
            } else {
                // Fallback logic for sparkling/top-ups if not explicitly in map
                const topUps = ['Soda Water', 'Champagne', 'Prosecco', 'Tonic Water', 'Ginger Beer', 'Sparkling Wine 0%', 'Sprite', 'Cola'];
                if (topUps.includes(ing.name)) {
                    order = 2;
                }
            }

            if (ing.pourOrder !== order) {
                hasChanges = true;
            }
            return { ...ing, pourOrder: order };
        });

        if (hasChanges) {
            await prisma.cocktail.update({
                where: { id: cocktail.id },
                data: { recipe: JSON.stringify(updatedRecipe) }
            });
            console.log(`✅ ${cocktail.name}: Applied custom pour logic.`);
        }
    }

    console.log("\nBatch update complete.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
