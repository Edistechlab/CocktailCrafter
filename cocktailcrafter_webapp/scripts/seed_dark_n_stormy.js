const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    // --- Lookup IDs ---
    const darkRum = await p.bottle.findFirst({ where: { name: 'Dark Rum' } })
    const limeJuice = await p.bottle.findFirst({ where: { name: 'Lime Juice' } })

    const glass = await p.glassType.findFirst({ where: { name: 'Highball Glass' } })
    const ice = await p.iceType.findFirst({ where: { name: 'Standard Cube' } })
    const technique = await p.shakeTechnique.findFirst({ where: { name: 'Layered / Float' } })
    const garnishWedge = await p.garnish.findFirst({ where: { name: 'Citrus Wedges' } })

    const tasteSpicy = await p.tasteProfile.findFirst({ where: { name: 'Spicy' } })
    const tasteBold = await p.tasteProfile.findFirst({ where: { name: 'Bold' } })
    const tasteRefresh = await p.tasteProfile.findFirst({ where: { name: 'Refreshing' } })

    // Validate internals
    const missing = []
    if (!darkRum) missing.push('Bottle: Dark Rum')
    if (!limeJuice) missing.push('Bottle: Lime Juice')
    if (!glass) missing.push('Glass: Highball Glass')
    if (!ice) missing.push('Ice: Standard Cube')
    if (!technique) missing.push('Technique: Layered / Float')
    if (!tasteSpicy) missing.push('Taste: Spicy')
    if (!tasteBold) missing.push('Taste: Bold')
    if (!tasteRefresh) missing.push('Taste: Refreshing')

    if (missing.length > 0) {
        console.error('❌ Missing catalog entries:', missing)
        process.exit(1)
    }

    const user = await p.user.findFirst()
    if (!user) { process.exit(1) }

    // Check if exists
    const existing = await p.cocktail.findFirst({ where: { name: 'Dark ’n’ Stormy' } })
    if (existing) {
        console.log('⚠️  Dark ’n’ Stormy already exists, skipping.')
        await p.$disconnect()
        return
    }

    // Build recipe JSON (Ginger Beer manually added in instructions as requested)
    const recipeJson = JSON.stringify([
        { bottleId: darkRum.id, name: 'Dark Rum', amount: 2 },
        { bottleId: limeJuice.id, name: 'Lime Juice', amount: 0.5 },
    ])

    // --- Create Dark ’n’ Stormy ---
    const darkNStormy = await p.cocktail.create({
        data: {
            name: 'Dark ’n’ Stormy',
            description: 'A bold highball combining dark rum and spicy ginger beer.',
            history: 'Originated in Bermuda and traditionally made with Goslings Black Seal rum.',
            instruction: 'Fill glass with ice.\nAdd Ginger Beer (add manually) and lime juice.\nFloat Dark Rum on top.\nDo not stir heavily.\nGarnish with lime and serve.',
            pictureUrl: '/images/cocktails/Dark n Stormy.webp',
            volume: 3.5,
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            garnishes: { connect: garnishWedge ? [{ id: garnishWedge.id }] : [] },
            tastes: { connect: [{ id: tasteSpicy.id }, { id: tasteBold.id }, { id: tasteRefresh.id }] },
        }
    })

    console.log(`✅ Dark ’n’ Stormy created! ID: ${darkNStormy.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
