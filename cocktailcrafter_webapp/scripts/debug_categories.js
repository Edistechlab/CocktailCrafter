const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const initialBottles = await prisma.bottle.findMany();

    const parentIds = new Set(initialBottles.map(b => b.parentId).filter(Boolean));
    console.log("Parent IDs found:", Array.from(parentIds));

    const cats = initialBottles
        .filter(b => parentIds.has(b.id))
        .sort((a, b) => a.name.localeCompare(b.name));

    console.log("Categories identifying as parents:", cats.map(c => ({ name: c.name, id: c.id })));
}

main().catch(console.error).finally(() => prisma.$disconnect());
