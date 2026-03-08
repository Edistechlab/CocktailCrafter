const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const cocktail = await prisma.cocktail.findFirst({
        where: { name: 'Zombie' }
    });
    console.log(JSON.stringify(cocktail, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
