const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const p = new PrismaClient();

async function main() {
    const cocktails = await p.cocktail.findMany();
    const imageFiles = fs.readdirSync(path.join(__dirname, '../public/images/cocktails'));

    for (const cocktail of cocktails) {
        // Try exact match or slight variation
        let fileName = cocktail.name + '.webp';

        // Handle special cases based on file list
        if (cocktail.name === 'Dark ’n’ Stormy') fileName = 'Dark n Stormy.webp';
        if (cocktail.name === 'Margarita') fileName = 'Magarita.webp'; // based on user typo in file name
        if (cocktail.name === 'Piña Colada') fileName = 'Pina Colada.webp';

        if (imageFiles.includes(fileName)) {
            const localUrl = `/images/cocktails/${fileName}`;
            await p.cocktail.update({
                where: { id: cocktail.id },
                data: { pictureUrl: localUrl }
            });
            console.log(`✅ Updated ${cocktail.name} -> ${localUrl}`);
        } else {
            // Check for case insensitive or partial matches if not found
            const match = imageFiles.find(f => f.toLowerCase() === fileName.toLowerCase());
            if (match) {
                const localUrl = `/images/cocktails/${match}`;
                await p.cocktail.update({
                    where: { id: cocktail.id },
                    data: { pictureUrl: localUrl }
                });
                console.log(`✅ Updated ${cocktail.name} -> ${localUrl} (case-match)`);
            } else {
                console.log(`⚠️  No image found for ${cocktail.name} (searched for ${fileName})`);
            }
        }
    }
}

main().catch(console.error).finally(() => p.$disconnect());
