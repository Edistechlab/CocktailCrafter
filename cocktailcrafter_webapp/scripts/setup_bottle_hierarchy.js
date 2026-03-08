const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Setting up Bottle Hierarchy...");

    // 1. Identify/Ensure Generic Parents exist
    const categories = [
        { name: "Whiskey", subcategories: ["Bourbon Whiskey", "Rye Whiskey", "Irish Whiskey", "Scotch Whisky"] },
        { name: "Gin", subcategories: ["London Dry Gin"] },
        { name: "Rum", subcategories: ["White Rum", "Dark Rum", "Overproof Rum"] },
        { name: "Tequila", subcategories: ["Tequila Blanco", "Tequila Reposado"] },
        { name: "Vermouth", subcategories: ["Sweet Vermouth", "Dry Vermouth", "Bianco Vermouth"] },
        { name: "Juice", subcategories: ["Lime Juice", "Lemon Juice", "Orange Juice", "Pineapple Juice", "Grapefruit Juice", "Cherry Juice"] }
    ];

    for (const cat of categories) {
        // Find or create the parent
        let parent = await prisma.bottle.findUnique({ where: { name: cat.name } });

        if (!parent) {
            parent = await prisma.bottle.create({
                data: {
                    name: cat.name,
                    description: `Generic category for ${cat.name}`,
                    alcoholContent: 0 // Generic category itself might not have fixed %
                }
            });
            console.log(`Created generic parent: ${cat.name}`);
        }

        // Link subcategories as children
        for (const subName of cat.subcategories) {
            const child = await prisma.bottle.findUnique({ where: { name: subName } });
            if (child && !child.parentId) {
                await prisma.bottle.update({
                    where: { id: child.id },
                    data: { parentId: parent.id }
                });
                console.log(`Linked ${subName} to parent ${cat.name}`);
            }
        }
    }

    // Special case: Ensure a generic "Liqueur" parent exists if needed
    const liqueurParent = await prisma.bottle.findUnique({ where: { name: "Liqueur" } });
    if (!liqueurParent) {
        await prisma.bottle.create({
            data: {
                name: "Liqueur",
                description: "Generic category for various liqueurs"
            }
        });
    }

    console.log("\nHierarchy setup complete.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
