const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const cocktails = await prisma.cocktail.findMany({
        include: {
            techniques: true,
        }
    });

    const audit = cocktails.map(c => ({
        name: c.name,
        technique: c.techniques?.[0]?.name || "Unknown",
        recipe: JSON.parse(c.recipe || '[]'),
        instruction: c.instruction
    }));

    console.log(JSON.stringify(audit, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
