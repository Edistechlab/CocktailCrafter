const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const toDelete = [
    "Double Shake",
    "Built / Built over Ice",
    "No Shake / Build",
    "Standard Shake"
];

async function main() {
    console.log("Cleaning up redundant techniques...");

    for (const name of toDelete) {
        try {
            const deleted = await prisma.shakeTechnique.deleteMany({
                where: { name: name }
            });
            console.log(`Deleted entries for "${name}": ${deleted.count}`);
        } catch (error) {
            console.error(`Error deleting "${name}":`, error.message);
        }
    }

    // Listing remaining to verify
    const remaining = await prisma.shakeTechnique.findMany({
        orderBy: { name: 'asc' }
    });
    console.log("\nRemaining clean techniques:");
    remaining.forEach(t => console.log(`- ${t.name}`));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
