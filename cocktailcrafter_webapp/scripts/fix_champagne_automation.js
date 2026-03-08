const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Adjusting Automation Levels for Champagne cocktails...");

    // 1. Update Kir Royale
    const kirRoyale = await prisma.cocktail.findFirst({ where: { name: 'Kir Royale' } });
    if (kirRoyale) {
        await prisma.cocktail.update({
            where: { id: kirRoyale.id },
            data: { automationLevel: 1 }
        });
        console.log("✅ Kir Royale set to Level 1 (Contains Champagne)");
    }

    // 2. Update French 75
    // First, let's fix the recipe JSON to include Champagne as a manual step
    const french75 = await prisma.cocktail.findFirst({ where: { name: 'French 75' } });
    if (french75) {
        let recipe = JSON.parse(french75.recipe || '[]');

        // Add Champagne to recipe if not present
        if (!recipe.some(ing => ing.name === 'Champagne')) {
            // Find Champagne bottle id if possible
            const champagneBottle = await prisma.bottle.findFirst({ where: { name: 'Champagne' } });
            recipe.push({
                bottleId: champagneBottle?.id || null,
                name: 'Champagne',
                amount: 2,
                pourOrder: 2
            });
        }

        await prisma.cocktail.update({
            where: { id: french75.id },
            data: {
                automationLevel: 1,
                recipe: JSON.stringify(recipe)
            }
        });
        console.log("✅ French 75 set to Level 1 and recipe updated with Champagne");
    }

    // 3. Check for any other cocktails that might have Champagne in instructions but not recipe
    const others = await prisma.cocktail.findMany({
        where: {
            OR: [
                { recipe: { contains: 'Champagne' } },
                { instruction: { contains: 'Champagne' } }
            ],
            NOT: [
                { name: 'Kir Royale' },
                { name: 'French 75' }
            ]
        }
    });

    for (const c of others) {
        await prisma.cocktail.update({
            where: { id: c.id },
            data: { automationLevel: 1 }
        });
        console.log(`✅ ${c.name} set to Level 1 (Contains Champagne)`);
    }

    console.log("\nUpdate complete.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
