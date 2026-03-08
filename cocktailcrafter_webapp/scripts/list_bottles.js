const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const bottles = await prisma.bottle.findMany();
    bottles.forEach(b => console.log(b.name));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
