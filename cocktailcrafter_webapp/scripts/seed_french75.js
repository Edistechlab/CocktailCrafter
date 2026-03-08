const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    // --- Lookup IDs ---
    const gin = await p.bottle.findFirst({ where: { name: 'Gin' } })
    const lemon = await p.bottle.findFirst({ where: { name: 'Lemon Juice' } })

    const glass = await p.glassType.findFirst({ where: { name: 'Flute / Champagne Flute' } })
    const ice = await p.iceType.findFirst({ where: { name: 'No Ice (straight up/neat)' } })
    const technique = await p.shakeTechnique.findFirst({ where: { name: 'Standard Shake' } })
    const garnish = await p.garnish.findFirst({ where: { name: 'Citrus Twists / Peels' } })

    const tasteRefresh = await p.tasteProfile.findFirst({ where: { name: 'Refreshing' } })
    const tasteCitrus = await p.tasteProfile.findFirst({ where: { name: 'Citrus-forward' } })
    const tasteElegant = await p.tasteProfile.findFirst({ where: { name: 'Fragrant / Aromatic' } }) // Using Aromatic as equivalent for Elegant context or just Citrus-forward

    // Validate
    const missing = []
    if (!gin) missing.push('Bottle: Gin')
    if (!lemon) missing.push('Bottle: Lemon Juice')
    if (!glass) missing.push('Glass: Flute / Champagne Flute')
    if (!ice) missing.push('Ice: No Ice (straight up/neat)')
    if (!technique) missing.push('Technique: Standard Shake')
    if (!garnish) missing.push('Garnish: Citrus Twists / Peels')
    if (!tasteRefresh) missing.push('Taste: Refreshing')
    if (!tasteCitrus) missing.push('Taste: Citrus-forward')

    if (missing.length > 0) {
        console.error('❌ Missing catalog entries:', missing)
        process.exit(1)
    }

    const user = await p.user.findFirst()
    if (!user) { process.exit(1) }

    // Check if exists
    const existing = await p.cocktail.findFirst({ where: { name: 'French 75' } })
    if (existing) {
        console.log('⚠️  French 75 already exists, skipping.')
        await p.$disconnect()
        return
    }

    // Build recipe JSON (Champagne and Syrup removed as requested)
    const recipeJson = JSON.stringify([
        { bottleId: gin.id, name: 'Gin', amount: 1 },
        { bottleId: lemon.id, name: 'Lemon Juice', amount: 0.5 },
    ])

    // --- Create French 75 ---
    const french75 = await p.cocktail.create({
        data: {
            name: 'French 75',
            description: 'A sparkling, elegant cocktail combining gin, citrus, and champagne.',
            history: 'Created during World War I and named after a French artillery gun.',
            instruction: 'Add 0.5 part Simple Syrup (manually).\nShake gin, lemon, and syrup with ice.\nStrain into a flute.\nTop with Champagne (add manually).\nGarnish with lemon twist.\nServe immediately.',
            pictureUrl: '/images/cocktails/French 75.webp',
            volume: 3.5,
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            garnishes: { connect: [{ id: garnish.id }] },
            tastes: { connect: [{ id: tasteRefresh.id }, { id: tasteCitrus.id }] },
        }
    })

    console.log(`✅ French 75 created! ID: ${french75.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
