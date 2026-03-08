const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const updates = [
        { name: "Martini", url: "/images/cocktails/Martini.webp" },
        { name: "Espresso Martini", url: "/images/cocktails/Espresso Martini.webp" },
        { name: "Vesper Martini", url: "/images/cocktails/Vesper Martini.webp" },
        { name: "Margarita", url: "/images/cocktails/Magarita.webp" }, // Note the spelling difference in file from earlier
        { name: "Zombie", url: "/images/cocktails/Zombie.webp" }
    ];

    for (const update of updates) {
        const res = await prisma.cocktail.updateMany({
            where: { name: update.name },
            data: { pictureUrl: update.url }
        });
        console.log(`Updated ${update.name}: ${res.count} record(s)`);
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
