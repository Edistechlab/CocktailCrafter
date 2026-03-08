const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

const IMAGE_DIR = '/Users/edi/Documents/Edis Techlab/Projekte/05_CocktailCrafter/cocktailcrafter_webapp/public/images/cocktails';

async function main() {
    console.log('🚀 Starting image rename and database update script...');

    // 1. Fetch all cocktails from DB
    const cocktails = await prisma.cocktail.findMany({
        select: { id: true, name: true, pictureUrl: true }
    });

    for (const cocktail of cocktails) {
        if (!cocktail.pictureUrl) continue;

        // Current filename from URL (e.g., "Clover Club.webp")
        const currentFilename = path.basename(cocktail.pictureUrl);

        // Skip if there are no spaces in the filename
        if (!currentFilename.includes(' ')) {
            console.log(`skipping ${currentFilename} (no spaces)`);
            continue;
        }

        const newFilename = currentFilename.replace(/ /g, '_');
        const oldFilePath = path.join(IMAGE_DIR, currentFilename);
        const newFilePath = path.join(IMAGE_DIR, newFilename);
        const newUrl = `/images/cocktails/${newFilename}`;

        // 2. Rename file if it exists
        if (fs.existsSync(oldFilePath)) {
            try {
                fs.renameSync(oldFilePath, newFilePath);
                console.log(`✅ Renamed file: ${currentFilename} -> ${newFilename}`);
            } catch (err) {
                console.error(`❌ Failed to rename file ${currentFilename}:`, err.message);
            }
        } else {
            console.warn(`⚠️  File not found on disk: ${currentFilename}`);
        }

        // 3. Update database record
        try {
            await prisma.cocktail.update({
                where: { id: cocktail.id },
                data: { pictureUrl: newUrl }
            });
            console.log(`✅ Updated DB for "${cocktail.name}": -> ${newUrl}`);
        } catch (err) {
            console.error(`❌ Failed to update DB for "${cocktail.name}":`, err.message);
        }
    }

    console.log('🏁 Process finished.');
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
