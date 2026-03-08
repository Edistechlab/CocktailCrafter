const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const cocktails = await prisma.cocktail.findMany({
        include: {
            techniques: true,
            garnishes: true
        }
    });

    const audit = cocktails.map(c => ({
        id: c.id,
        name: c.name,
        recipe: JSON.parse(c.recipe || '[]'),
        technique: c.techniques?.[0]?.name,
        automationLevels: c.automationLevel
    }));

    console.log(JSON.stringify(audit, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
