const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

async function main() {
    const cocktailsDir = path.join(process.cwd(), 'public', 'images', 'cocktails');
    if (!fs.existsSync(cocktailsDir)) {
        console.error('Directory not found:', cocktailsDir);
        return;
    }

    const files = fs.readdirSync(cocktailsDir).filter(f => f.endsWith('.webp'));
    console.log(`Found ${files.length} webp images.`);

    const cocktails = await prisma.cocktail.findMany();

    for (const cocktail of cocktails) {
        // Try to find a matching file
        // Some filenames might have spaces or slight differences
        const match = files.find(f => {
            const base = f.replace('.webp', '').toLowerCase();
            const name = cocktail.name.toLowerCase();
            return base === name || base.includes(name) || name.includes(base);
        });

        if (match) {
            const url = `/images/cocktails/${match}`;
            if (cocktail.pictureUrl !== url) {
                await prisma.cocktail.update({
                    where: { id: cocktail.id },
                    data: { pictureUrl: url }
                });
                console.log(`Updated ${cocktail.name} -> ${url}`);
            }
        }
    }

    console.log('Update complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
