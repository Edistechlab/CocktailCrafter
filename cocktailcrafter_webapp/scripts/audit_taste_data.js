const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const tasteProfiles = await prisma.tasteProfile.findMany({
        include: {
            _count: {
                select: { cocktails: true }
            }
        }
    });

    const cocktails = await prisma.cocktail.findMany({
        include: {
            tastes: true
        }
    });

    const missingTastes = cocktails.filter(c => c.tastes.length === 0);

    console.log('--- Taste Profiles Summary ---');
    console.log(`Total Taste Profiles in Database: ${tasteProfiles.length}`);
    tasteProfiles.forEach(tp => {
        console.log(`- ${tp.name}: ${tp._count.cocktails} cocktails`);
    });

    console.log('\n--- Cocktails Coverage ---');
    console.log(`Total Cocktails: ${cocktails.length}`);
    console.log(`Cocktails with Taste Profiles: ${cocktails.length - missingTastes.length}`);
    console.log(`Cocktails MISSING Taste Profiles: ${missingTastes.length}`);

    if (missingTastes.length > 0) {
        console.log('\nCocktails without Taste Profiles:');
        console.log(missingTastes.map(c => c.name).sort().join(', '));
    }

    // Also check bottles for taste profile strings
    const bottles = await prisma.bottle.findMany();
    const missingBottleTaste = bottles.filter(b => !b.tasteProfile);
    console.log('\n--- Bottles Coverage ---');
    console.log(`Total Bottles: ${bottles.length}`);
    console.log(`Bottles missing Taste Profile field: ${missingBottleTaste.length}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
