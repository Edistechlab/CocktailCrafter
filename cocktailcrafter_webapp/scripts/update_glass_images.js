const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const glassImages = {
    "Coupe Glass / Coupette": "/images/glasses/coupe_glass.webp",
    "Highball Glass": "/images/glasses/highball_glass.webp",
    "Collins Glass": "/images/glasses/collins_glass.webp",
    "Rocks Glass / Old Fashioned": "/images/glasses/rocks_glass.webp",
    "Martini Glass": "/images/glasses/martini_glass.webp",
    "Nick & Nora Glass": "/images/glasses/nick_nora_glass.webp",
    "Hurricane Glass": "/images/glasses/hurricane_glass.webp",
    "Margarita Glass": "/images/glasses/margarita_glass.webp",
    "Shot Glass": "/images/glasses/shot_glass.webp",
    "Flute / Champagne Flute": "/images/glasses/champagne_flute.webp",
    "Poco Grande / Tulip Glass": "/images/glasses/poco_grande.webp",
    "Copper Mug": "/images/glasses/copper_mug.webp",
    "Tiki Mug": "/images/glasses/tiki_mug.webp"
};

async function main() {
    console.log("Updating glass images...");

    for (const [name, url] of Object.entries(glassImages)) {
        try {
            const updated = await prisma.glassType.updateMany({
                where: { name: name },
                data: { pictureUrl: url }
            });
            console.log(`Updated ${name}: ${updated.count} record(s)`);
        } catch (error) {
            console.error(`Error updating ${name}:`, error.message);
        }
    }

    console.log("Done!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
