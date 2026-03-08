const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Finding Mai Tai...");
    const maiTai = await prisma.cocktail.findFirst({
        where: { name: { contains: 'Mai Tai' } },
        orderBy: { createdAt: 'asc' }
    });

    if (maiTai) {
        console.log(`Found Mai Tai (id: ${maiTai.id}). Deleting others...`);
        const result = await prisma.cocktail.deleteMany({
            where: {
                id: { not: maiTai.id }
            }
        });

        console.log(`Deleted ${result.count} other cocktails.`);

        await prisma.cocktail.update({
            where: { id: maiTai.id },
            data: {
                pictureUrl: "https://cocktailcrafter.ch/images/cocktails/Mai%20Tai.webp"
            }
        });
        console.log("Updated Mai Tai pictureUrl.");
    } else {
        console.log("Mai Tai not found.");
    }
}
main().catch(console.error).finally(() => prisma.$disconnect());
