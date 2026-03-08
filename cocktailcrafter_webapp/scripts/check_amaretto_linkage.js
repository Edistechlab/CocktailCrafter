const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const amaretto = await prisma.bottle.findFirst({
        where: { name: 'Amaretto' }
    });
    console.log(JSON.stringify(amaretto, null, 2));

    const naAmaretto = await prisma.bottle.findFirst({
        where: { name: 'Lyre’s Amaretti' }
    });
    console.log(JSON.stringify(naAmaretto, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
