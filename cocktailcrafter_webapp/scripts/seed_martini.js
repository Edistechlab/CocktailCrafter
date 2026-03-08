const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    // --- Lookup IDs ---
    const gin = await p.bottle.findFirst({ where: { name: 'Gin' } })
    const dryVerm = await p.bottle.findFirst({ where: { name: 'Dry Vermouth' } })

    const glass = await p.glassType.findFirst({ where: { name: 'Martini Glass' } })
    const ice = await p.iceType.findFirst({ where: { name: 'No Ice (straight up/neat)' } })
    const technique = await p.shakeTechnique.findFirst({ where: { name: 'Standard Stir' } })
    const garnishOlive = await p.garnish.findFirst({ where: { name: 'Olives' } })
    const garnishPeel = await p.garnish.findFirst({ where: { name: 'Citrus Twists / Peels' } })

    const tasteDry = await p.tasteProfile.findFirst({ where: { name: 'Dry' } })
    const tasteClean = await p.tasteProfile.findFirst({ where: { name: 'Clean' } })
    const tasteBoozy = await p.tasteProfile.findFirst({ where: { name: 'Boozy' } })

    // Validate
    const missing = []
    if (!gin) missing.push('Bottle: Gin')
    if (!dryVerm) missing.push('Bottle: Dry Vermouth')
    if (!glass) missing.push('Glass: Martini Glass')
    if (!ice) missing.push('Ice: No Ice (straight up/neat)')
    if (!technique) missing.push('Technique: Standard Stir')
    if (!garnishOlive) missing.push('Garnish: Olives')
    if (!garnishPeel) missing.push('Garnish: Citrus Twists / Peels')
    if (!tasteDry) missing.push('Taste: Dry')
    if (!tasteClean) missing.push('Taste: Clean')
    if (!tasteBoozy) missing.push('Taste: Boozy')

    if (missing.length > 0) {
        console.error('❌ Missing catalog entries:', missing)
        process.exit(1)
    }

    const user = await p.user.findFirst()
    if (!user) { process.exit(1) }

    // Check if exists
    const existing = await p.cocktail.findFirst({ where: { name: 'Martini' } })
    if (existing) {
        console.log('⚠️  Martini already exists, skipping.')
        await p.$disconnect()
        return
    }

    // Build recipe JSON
    const recipeJson = JSON.stringify([
        { bottleId: gin.id, name: 'Gin', amount: 2.5 },
        { bottleId: dryVerm.id, name: 'Dry Vermouth', amount: 0.5 },
    ])

    // --- Create Martini ---
    const martini = await p.cocktail.create({
        data: {
            name: 'Martini',
            description: 'A timeless, elegant cocktail known for its clarity, strength, and simplicity.',
            history: 'Originated in the late 19th century, evolving from earlier gin and vermouth drinks into a refined classic.',
            instruction: 'Stir gin and vermouth with ice until chilled.\nStrain into a chilled martini glass.\nGarnish with olive or lemon twist.\nServe very cold.\nEnjoy immediately.',
            pictureUrl: '/images/cocktails/Martini.webp',
            volume: 3,
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            garnishes: { connect: [{ id: garnishOlive.id }, { id: garnishPeel.id }] },
            tastes: { connect: [{ id: tasteDry.id }, { id: tasteClean.id }, { id: tasteBoozy.id }] },
        }
    })

    console.log(`✅ Martini created! ID: ${martini.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
