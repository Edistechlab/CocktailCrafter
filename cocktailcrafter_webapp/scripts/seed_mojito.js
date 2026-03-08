const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    // --- Lookup IDs ---
    const rum = await p.bottle.findFirst({ where: { name: 'White Rum' } })
    const limeJuice = await p.bottle.findFirst({ where: { name: 'Lime Juice' } })
    const soda = await p.bottle.findFirst({ where: { name: 'Soda Water' } })

    const glass = await p.glassType.findFirst({ where: { name: 'Highball Glass' } })
    const ice = await p.iceType.findFirst({ where: { name: 'Crushed Ice / Pebble Ice' } })
    const technique = await p.shakeTechnique.findFirst({ where: { name: 'Built / Built over Ice' } })
    const garnishMint = await p.garnish.findFirst({ where: { name: 'Fresh Herbs' } })
    const garnishLime = await p.garnish.findFirst({ where: { name: 'Citrus Wedges' } })

    const tasteRefresh = await p.tasteProfile.findFirst({ where: { name: 'Refreshing' } })
    const tasteCitrus = await p.tasteProfile.findFirst({ where: { name: 'Citrus-forward' } })
    const tasteSweet = await p.tasteProfile.findFirst({ where: { name: 'Subtly sweet' } })

    // Validate
    const missing = []
    if (!rum) missing.push('Bottle: White Rum')
    if (!limeJuice) missing.push('Bottle: Lime Juice')
    if (!soda) missing.push('Bottle: Soda Water')
    if (!glass) missing.push('Glass: Highball Glass')
    if (!ice) missing.push('Ice: Crushed Ice / Pebble Ice')
    if (!technique) missing.push('Technique: Built / Built over Ice')
    if (!garnishMint) missing.push('Garnish: Fresh Herbs')
    if (!garnishLime) missing.push('Garnish: Citrus Wedges')
    if (!tasteRefresh) missing.push('Taste: Refreshing')
    if (!tasteCitrus) missing.push('Taste: Citrus-forward')
    if (!tasteSweet) missing.push('Taste: Subtly sweet')

    if (missing.length > 0) {
        console.error('❌ Missing catalog entries:', missing)
        process.exit(1)
    }

    const user = await p.user.findFirst()
    if (!user) { process.exit(1) }

    // Check if exists
    const existing = await p.cocktail.findFirst({ where: { name: 'Mojito' } })
    if (existing) {
        console.log('⚠️  Mojito already exists, skipping.')
        await p.$disconnect()
        return
    }

    // Build recipe JSON (Zucker entfernt wie gewünscht, nur Spirituose/Mixer)
    const recipeJson = JSON.stringify([
        { bottleId: rum.id, name: 'White Rum', amount: 2 },
        { bottleId: limeJuice.id, name: 'Lime Juice', amount: 1 },
        { bottleId: soda.id, name: 'Soda Water', amount: 1 }, // "Top with" als 1 part für die Ratio
    ])

    // --- Create Mojito ---
    const mojito = await p.cocktail.create({
        data: {
            name: 'Mojito',
            description: 'A refreshing Cuban highball combining rum, mint, lime, and soda for a cooling tropical drink.',
            history: 'Originated in Havana, Cuba; associated with local rum culture and popularized globally in the 20th century.',
            instruction: 'Gently muddle mint with sugar and lime juice (add sugar manually).\nFill glass with crushed ice.\nAdd rum and top with soda.\nLightly stir to combine.\nGarnish with mint and lime wedge.',
            pictureUrl: '/images/cocktails/Mojito.webp',
            volume: 4,
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            garnishes: { connect: [{ id: garnishMint.id }, { id: garnishLime.id }] },
            tastes: { connect: [{ id: tasteRefresh.id }, { id: tasteCitrus.id }, { id: tasteSweet.id }] },
        }
    })

    console.log(`✅ Mojito created! ID: ${mojito.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
