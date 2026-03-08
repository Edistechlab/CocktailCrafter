const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🧪 Starting data population for Sugar, Acidity and Dilution...');

    const updates = [
        // --- BASE SPIRITS (0 sugar, low acidity) ---
        { name: 'Vodka', sugar: 0, acid: 0 },
        { name: 'Gin', sugar: 0, acid: 0 },
        { name: 'London Dry Gin', sugar: 0, acid: 0 },
        { name: 'Tequila', sugar: 0, acid: 1 },
        { name: 'Tequila Blanco', sugar: 0, acid: 1 },
        { name: 'Tequila Reposado', sugar: 0, acid: 1 },
        { name: 'White Rum', sugar: 0, acid: 0 },
        { name: 'Dark Rum', sugar: 0, acid: 0.5 },
        { name: 'Overproof Rum', sugar: 0, acid: 0 },
        { name: 'Whiskey', sugar: 0, acid: 0.5 },
        { name: 'Bourbon', sugar: 0, acid: 0.5 },
        { name: 'Rye Whiskey', sugar: 0, acid: 0.5 },
        { name: 'Scotch Whisky', sugar: 0, acid: 0.5 },
        { name: 'Pisco', sugar: 0, acid: 0.5 },
        { name: 'Grappa', sugar: 0, acid: 0.5 },

        // --- CITRUS & JUICES ---
        { name: 'Lemon Juice', sugar: 2.5, acid: 8.5 },
        { name: 'Lime Juice', sugar: 2.0, acid: 9.0 },
        { name: 'Orange Juice', sugar: 9.0, acid: 4.5 },
        { name: 'Pineapple Juice', sugar: 12.0, acid: 4.0 },
        { name: 'Grapefruit Juice', sugar: 8.0, acid: 6.0 },
        { name: 'Cranberry Juice', sugar: 12.0, acid: 6.5 },
        { name: 'Apple Juice', sugar: 10.0, acid: 3.5 },

        // --- SYRUPS ---
        { name: 'Simple Syrup', sugar: 65, acid: 0 },
        { name: 'Rich Simple Syrup', sugar: 85, acid: 0 },
        { name: 'Honey Syrup', sugar: 70, acid: 1 },
        { name: 'Agave Syrup', sugar: 75, acid: 0.5 },
        { name: 'Grenadine', sugar: 60, acid: 2 },
        { name: 'Raspberry Syrup', sugar: 60, acid: 2.5 },
        { name: 'Passion Fruit Syrup', sugar: 55, acid: 4 },
        { name: 'Orgeat', sugar: 50, acid: 0 },
        { name: 'Hazelnut Syrup', sugar: 60, acid: 0 },
        { name: 'Vanilla Syrup', sugar: 60, acid: 0 },
        { name: 'Cherry Syrup', sugar: 60, acid: 3 },
        { name: 'Cassis Syrup', sugar: 60, acid: 3 },
        { name: 'Violet Syrup', sugar: 60, acid: 2 },
        { name: 'Blue Curacao Syrup', sugar: 60, acid: 1 },

        // --- LIQUEURS ---
        { name: 'Triple Sec', sugar: 30, acid: 0 },
        { name: 'Cointreau', sugar: 25, acid: 0 },
        { name: 'Kahlúa', sugar: 45, acid: 0 },
        { name: 'Amaretto', sugar: 35, acid: 0 },
        { name: 'Maraschino Liqueur', sugar: 35, acid: 1 },
        { name: 'Apricot Liqueur', sugar: 30, acid: 2 },
        { name: 'Cherry Liqueur', sugar: 35, acid: 2.5 },
        { name: 'Crème de Cassis', sugar: 50, acid: 3 },
        { name: 'Crème de Violette', sugar: 45, acid: 1 },
        { name: 'Drambuie', sugar: 35, acid: 0.5 },
        { name: 'St-Germain', sugar: 25, acid: 1.5 },
        { name: 'Frangelico', sugar: 30, acid: 0 },
        { name: 'Hazelnut Liqueur', sugar: 30, acid: 0 },
        { name: 'Chocolate Liqueur', sugar: 40, acid: 0 },
        { name: 'Campari', sugar: 25, acid: 2 },
        { name: 'Aperol', sugar: 25, acid: 2 },
        { name: 'Select Aperitivo', sugar: 24, acid: 2 },

        // --- VERMOUTHS & WINES ---
        { name: 'Dry Vermouth', sugar: 5, acid: 3 },
        { name: 'Sweet Vermouth', sugar: 15, acid: 3 },
        { name: 'Lillet Blanc', sugar: 10, acid: 3.5 },
        { name: 'Prosecco', sugar: 1.2, acid: 4 },
        { name: 'Champagne', sugar: 1.0, acid: 4.5 },
        { name: 'Red Wine', sugar: 0.2, acid: 3.5 },
        { name: 'White Wine', sugar: 0.2, acid: 4 },

        // --- SODAS & MIXERS ---
        { name: 'Tonic Water', sugar: 9.0, acid: 4.5 },
        { name: 'Ginger Beer', sugar: 12.0, acid: 4.0 },
        { name: 'Ginger Ale', sugar: 9.0, acid: 3.5 },
        { name: 'Cola', sugar: 10.5, acid: 4.5 },
        { name: 'Sprite', sugar: 10.0, acid: 4.5 },
        { name: 'Soda Water', sugar: 0, acid: 2.5 },

        // --- NON ALCOHOLIC ALTERNATIVES (Lyre's etc) ---
        { name: 'Lyre’s Amaretti', sugar: 15, acid: 0 },
        { name: 'Lyre\'s Italian Spritz', sugar: 12, acid: 2 },
        { name: 'Lyre\'s American Malt', sugar: 0.5, acid: 1 },
        { name: 'Lyre\'s Dark Cane Spirit', sugar: 0.5, acid: 0.5 },
        { name: 'Lyre\'s Dry London Spirit', sugar: 0.5, acid: 0.5 },
        { name: 'Lyre\'s Italian Rosso', sugar: 10, acid: 3 },
        { name: 'Lyre\'s Aperitif Dry', sugar: 0.5, acid: 3.5 }
    ];

    for (const item of updates) {
        await prisma.bottle.updateMany({
            where: { name: { contains: item.name } },
            data: {
                sugarContent: item.sugar,
                acidity: item.acid
            }
        });
        console.log(`✅ Updated ${item.name}`);
    }

    // --- TECHNIOUE DILUTION ---
    const techniques = [
        { name: 'Standard Shake', dilution: 0.25 },
        { name: 'Double Shake', dilution: 0.30 },
        { name: 'Stirred', dilution: 0.18 },
        { name: 'Built in Glass', dilution: 0.05 },
        { name: 'Frozen / Blended', dilution: 0.50 }
    ];

    for (const tech of techniques) {
        await prisma.shakeTechnique.updateMany({
            where: { name: { contains: tech.name } },
            data: { dilution: tech.dilution }
        });
        console.log(`✅ Updated Technique: ${tech.name}`);
    }

    console.log('✨ All data populated successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
