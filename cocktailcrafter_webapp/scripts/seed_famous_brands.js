const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Seeding famous brands...");

    const brands = [
        { name: "Jack Daniel's", parentName: "Whiskey", alcohol: 40, desc: "Classic Tennessee Whiskey" },
        { name: "Tanqueray", parentName: "Gin", alcohol: 43.1, desc: "London Dry Gin with heavy juniper" },
        { name: "Absolut Vodka", parentName: "Vodka", alcohol: 40, desc: "Clean Swedish Vodka" },
        { name: "Bacardi Carta Blanca", parentName: "White Rum", alcohol: 37.5, desc: "Standard light mixing rum" },
        { name: "Jose Cuervo Especial", parentName: "Tequila", alcohol: 38, desc: "Popular gold tequila" }
    ];

    for (const b of brands) {
        const parent = await prisma.bottle.findUnique({ where: { name: b.parentName } });

        if (parent) {
            await prisma.bottle.upsert({
                where: { name: b.name },
                update: {
                    parentId: parent.id,
                    alcoholContent: b.alcohol,
                    description: b.desc
                },
                create: {
                    name: b.name,
                    parentId: parent.id,
                    description: b.desc,
                    alcoholContent: b.alcohol,
                    tasteProfile: parent.tasteProfile,
                    aroma: parent.aroma
                }
            });
            console.log(`✅ Seeded ${b.name} under ${b.parentName}`);
        } else {
            console.log(`⚠️ Parent ${b.parentName} not found for ${b.name}`);
        }
    }

    console.log("\nSeeding complete.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
