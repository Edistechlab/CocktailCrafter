import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const updates = [
        // Link Non-Alcoholic Options
        { name: 'Gin', naId: 'cmmadim8a00039i7884u2uvmn' },
        { name: 'Bourbon Whiskey', naId: 'cmmaddo670000nvz9jfjf0rpl' },
        { name: 'Rye Whiskey', naId: 'cmmaddo670000nvz9jfjf0rpl' },
        { name: 'Scotch Whisky', naId: 'cmmaitjzr0000frb5zw1gekwv' },
        { name: 'Aperol', naId: 'cmmad5lfx0001126hj4a4zn60' },
        { name: 'Campari', naId: 'cmmadfn7o0000gb2yjqnf7y5j' },
        { name: 'Tequila Blanco', naId: 'cmmaivw980000h2smfcn15wf1' },
        { name: 'Tequila Reposado', naId: 'cmmaivw980000h2smfcn15wf1' },
        { name: 'Tequila', naId: 'cmmaivw980000h2smfcn15wf1' },
        { name: 'White Rum', naId: 'cmmaiy95u00005u3a1raaq4p7' },
        { name: 'Dark Rum', naId: 'cmmadh4y30000g3timxf9dz1u' },
        { name: 'Amaretto', naId: 'cmmaaxg6u0000bkr67onkwq7j' },
        { name: 'Absinthe', naId: 'cmmacr5ae0001111d2gqzmw2b' },
        { name: 'Dry Vermouth', naId: 'cmmadim8900029i78bxmf3c7x' },
        { name: 'Lillet Blanc', naId: 'cmmadbz3n0000koo6dkyk0djc' },
        { name: 'Sweet Vermouth', naId: 'cmmaitk050001frb5kin0ijks' },
        { name: 'Kahlúa', naId: 'cmmairobg00025gem6olkdngw' },
        { name: 'Vodka', naId: 'cmmaiy95u00005u3a1raaq4p7' },
        { name: 'Cognac', naId: 'cmmaddo670000nvz9jfjf0rpl' }, // Nearest malt profile for Sidecar/Stinger
        { name: 'Pisco', naId: 'cmmaiy95u00005u3a1raaq4p7' }, // Neutral White Cane
        { name: 'Triple Sec', naId: 'cmmaivw9q0001h2smxmuzzdfn' }, // Syrup version
        { name: 'Cointreau', naId: 'cmmaivw9q0001h2smxmuzzdfn' },
        { name: 'Strucchi Vermouth Rosso', naId: 'cmmaitk050001frb5kin0ijks' },
        { name: 'Champagne', naId: 'cmmadfn810001gb2y78bj2es6' },
        { name: 'Prosecco', naId: 'cmmadfn810001gb2y78bj2es6' },
    ]

    for (const update of updates) {
        await prisma.bottle.updateMany({
            where: { name: update.name },
            data: { nonAlcoholicId: update.naId }
        })
    }

    // Ensure all Lyre's have metrics to prevent 0 results
    const lyresUpdates = [
        { name: "Lyre's American Malt", sugar: 0.5, acidity: 1.0, texture: "Light-bodied" },
        { name: "Lyre's Highland Malt", sugar: 0.5, acidity: 1.0, texture: "Light-bodied" },
        { name: "Lyre's Dry London Spirit", sugar: 0.5, acidity: 0.5, texture: "Light-bodied" },
        { name: "Lyre's White Cane Spirit", sugar: 0.5, acidity: 0.5, texture: "Light-bodied" },
        { name: "Lyre's Dark Cane Spirit", sugar: 0.5, acidity: 0.5, texture: "Light-bodied" },
        { name: "Lyre's Agave Blanco", sugar: 0.5, acidity: 0.5, texture: "Light-bodied" },
        { name: "Lyre's Aperitif Dry", sugar: 0.5, acidity: 3.5, texture: "Thin" },
        { name: "Lyre's Aperitif Rosso", sugar: 15.0, acidity: 0.5, texture: "Syrupy" },
        { name: "Lyre's Italian Spritz", sugar: 12.0, acidity: 2.0, texture: "Syrupy" },
        { name: "Lyre's Coffee Originale", sugar: 40.0, acidity: 0.0, texture: "Rich and oily" },
        { name: "Lyre's Amaretti", sugar: 15.0, acidity: 0.0, texture: "Velvety" },
        { name: "Lyre's Absinthe", sugar: 0.5, acidity: 0.0, texture: "Light" },
        { name: "Lyre's Aperitif White", sugar: 10.0, acidity: 3.5, texture: "Light" },
    ]

    for (const l of lyresUpdates) {
        await prisma.bottle.updateMany({
            where: { name: l.name },
            data: { sugarContent: l.sugar, acidity: l.acidity, texture: l.texture }
        })
    }

    console.log('Finished linking NA alternatives and updating metrics.')
}

main().finally(() => prisma.$disconnect())
