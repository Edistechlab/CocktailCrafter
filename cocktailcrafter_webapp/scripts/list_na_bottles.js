const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const naBottles = await prisma.bottle.findMany({
        where: {
            OR: [
                { name: { contains: 'Non-Alcoholic' } },
                { alcoholContent: 0 }
            ]
        },
        select: { id: true, name: true, alcoholContent: true }
    });
    console.log(JSON.stringify(naBottles, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
