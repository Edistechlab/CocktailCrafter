const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const cocktails = await prisma.cocktail.findMany();

    const topUpIngredients = [
        'Soda Water',
        'Champagne',
        'Prosecco',
        'Tonic Water',
        'Ginger Beer',
        'Sparkling Wine 0%',
        'Sprite',
        'Cola',
        'Ginger Ale'
    ];

    console.log("Updating pour orders (background execution plan)...");

    for (const cocktail of cocktails) {
        if (!cocktail.recipe) continue;

        let recipe;
        try {
            recipe = JSON.parse(cocktail.recipe);
        } catch (e) {
            console.error(`Failed to parse recipe for ${cocktail.name}`);
            continue;
        }

        if (!Array.isArray(recipe)) continue;

        let hasChanges = false;
        const updatedRecipe = recipe.map(ing => {
            // Default to 1 if not set
            let pourOrder = 1;

            // Logic for top-ups
            if (topUpIngredients.some(top => ing.name === top)) {
                pourOrder = 2;
            }

            // Special cases
            // Float of Overproof Rum in Zombie
            if (cocktail.name === 'Zombie' && ing.name === 'Overproof Rum') {
                pourOrder = 2;
            }

            // Cream in White Russian (for layering if needed, but usually stirred)
            // If user wants it layered:
            if (cocktail.name === 'White Russian' && ing.name === 'Cream') {
                pourOrder = 2;
            }

            // Check if the current pourOrder is different from the existing one (if any)
            if (ing.pourOrder !== pourOrder) {
                hasChanges = true;
            }

            return { ...ing, pourOrder };
        });

        if (hasChanges) {
            await prisma.cocktail.update({
                where: { id: cocktail.id },
                data: { recipe: JSON.stringify(updatedRecipe) }
            });
            console.log(`✅ ${cocktail.name}: Pour orders updated.`);
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
