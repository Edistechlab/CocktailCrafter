const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const bottles = await prisma.bottle.findMany();
    const missing = bottles.filter(b => !b.tasteProfile || b.tasteProfile.trim() === '');

    console.log(`Bottles with missing or empty taste profile: ${missing.length}`);
    missing.forEach(b => console.log(`- ${b.name}`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
