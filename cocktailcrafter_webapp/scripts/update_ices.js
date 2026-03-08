const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const updates = [
    {
        name: "Crushed Ice",
        description: "Small, irregular ice fragments for rapid chilling and significant dilution.",
        instructions: "Essential for Tiki drinks, Juleps, and Brambles. It provides the maximum surface area, chilling the drink instantly while also diluting it to the perfect balance."
    },
    {
        name: "Large Ice Cube",
        description: "A 2x2 inch clear ice cube.",
        instructions: "Best for spirit-forward drinks like Negronis or Old Fashioneds. The low surface-to-volume ratio ensures minimal dilution while keeping the drink cold."
    },
    {
        name: "Standard Ice Cubes",
        description: "Regular ice machine cubes.",
        instructions: "The workhorse of the bar. Ideal for shaking and stirring as they provide consistent dilution and chilling."
    },
    {
        name: "Ice Sphere",
        description: "A solid ball of clear ice.",
        instructions: "Offers even less surface area than a cube, meaning even slower melting. Perfect for high-end spirits served neat but cold."
    },
    {
        name: "Collins Spear",
        description: "A long, rectangular clear ice block.",
        instructions: "Specifically designed for Collins or Highball glasses. It looks stunning and provides a consistent chill throughout the long glass."
    }
];

async function main() {
    for (const item of updates) {
        await prisma.iceType.upsert({
            where: { name: item.name },
            update: {
                description: item.description,
                instructions: item.instructions
            },
            create: {
                name: item.name,
                description: item.description,
                instructions: item.instructions
            }
        });
        console.log(`Updated ice type: ${item.name}`);
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
