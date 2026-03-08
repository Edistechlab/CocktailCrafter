const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    // --- Lookup IDs ---
    const gin = await p.bottle.findFirst({ where: { name: 'Gin' } })
    const vodka = await p.bottle.findFirst({ where: { name: 'Vodka' } })
    const lillet = await p.bottle.findFirst({ where: { name: 'Lillet Blanc' } })

    const glass = await p.glassType.findFirst({ where: { name: 'Martini Glass' } })
    const ice = await p.iceType.findFirst({ where: { name: 'No Ice (straight up/neat)' } })
    const technique = await p.shakeTechnique.findFirst({ where: { name: 'Standard Shake' } })
    const garnish = await p.garnish.findFirst({ where: { name: 'Citrus Twists / Peels' } })

    const tasteBoozy = await p.tasteProfile.findFirst({ where: { name: 'Boozy' } })
    const tasteClean = await p.tasteProfile.findFirst({ where: { name: 'Clean' } })
    const tasteDry = await p.tasteProfile.findFirst({ where: { name: 'Dry' } })

    // Validate internals
    const missing = []
    if (!gin) missing.push('Bottle: Gin')
    if (!vodka) missing.push('Bottle: Vodka')
    if (!lillet) missing.push('Bottle: Lillet Blanc')
    if (!glass) missing.push('Glass: Martini Glass')
    if (!ice) missing.push('Ice: No Ice (straight up/neat)')
    if (!technique) missing.push('Technique: Standard Shake')
    if (!garnish) missing.push('Garnish: Citrus Twists / Peels')
    if (!tasteBoozy) missing.push('Taste: Boozy')
    if (!tasteClean) missing.push('Taste: Clean')
    if (!tasteDry) missing.push('Taste: Dry')

    if (missing.length > 0) {
        console.error('❌ Missing catalog entries:', missing)
        process.exit(1)
    }

    const user = await p.user.findFirst()
    if (!user) { process.exit(1) }

    // Check if exists
    const existing = await p.cocktail.findFirst({ where: { name: 'Vesper Martini' } })
    if (existing) {
        console.log('⚠️  Vesper Martini already exists, skipping.')
        await p.$disconnect()
        return
    }

    // Build recipe JSON
    const recipeJson = JSON.stringify([
        { bottleId: gin.id, name: 'Gin', amount: 3 },
        { bottleId: vodka.id, name: 'Vodka', amount: 1 },
        { bottleId: lillet.id, name: 'Lillet Blanc', amount: 0.5 },
    ])

    // --- Create Vesper Martini ---
    const vesper = await p.cocktail.create({
        data: {
            name: 'Vesper Martini',
            description: 'A strong and refined martini variation combining gin, vodka, and aromatized wine.',
            history: 'Created by Ian Fleming in the James Bond novel “Casino Royale”.',
            instruction: 'Shake ingredients (Gin, Vodka, Lillet Blanc) with ice until very cold.\nStrain into a chilled martini glass.\nGarnish with lemon peel.\nServe immediately.\nEnjoy ice cold.',
            pictureUrl: '/images/cocktails/Vesper Martini.webp',
            volume: 4.5,
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            garnishes: { connect: garnish ? [{ id: garnish.id }] : [] },
            tastes: { connect: [{ id: tasteBoozy.id }, { id: tasteClean.id }, { id: tasteDry.id }] },
        }
    })

    console.log(`✅ Vesper Martini created! ID: ${vesper.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
