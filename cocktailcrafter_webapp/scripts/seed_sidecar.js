const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    // --- Lookup IDs ---
    const cognac = await p.bottle.findFirst({ where: { name: 'Cognac' } })
    const tripleSec = await p.bottle.findFirst({ where: { name: 'Triple Sec' } })
    const lemon = await p.bottle.findFirst({ where: { name: 'Lemon Juice' } })

    const glass = await p.glassType.findFirst({ where: { name: 'Coupe Glass / Coupette' } })
    const ice = await p.iceType.findFirst({ where: { name: 'No Ice (straight up/neat)' } })
    const technique = await p.shakeTechnique.findFirst({ where: { name: 'Standard Shake' } })
    const garnishRim = await p.garnish.findFirst({ where: { name: 'Rims' } })
    const garnishPeel = await p.garnish.findFirst({ where: { name: 'Citrus Twists / Peels' } })

    const tasteCitrus = await p.tasteProfile.findFirst({ where: { name: 'Citrus-forward' } })
    const tasteDry = await p.tasteProfile.findFirst({ where: { name: 'Dry' } })
    const tasteBalanced = await p.tasteProfile.findFirst({ where: { name: 'Balanced' } })

    // Validate internals
    const missing = []
    if (!cognac) missing.push('Bottle: Cognac')
    if (!tripleSec) missing.push('Bottle: Triple Sec')
    if (!lemon) missing.push('Bottle: Lemon Juice')
    if (!glass) missing.push('Glass: Coupe Glass / Coupette')
    if (!ice) missing.push('Ice: No Ice (straight up/neat)')
    if (!technique) missing.push('Technique: Standard Shake')
    if (!tasteCitrus) missing.push('Taste: Citrus-forward')
    if (!tasteDry) missing.push('Taste: Dry')

    if (missing.length > 0) {
        console.error('❌ Missing catalog entries:', missing)
        process.exit(1)
    }

    const user = await p.user.findFirst()
    if (!user) { process.exit(1) }

    // Check if exists
    const existing = await p.cocktail.findFirst({ where: { name: 'Sidecar' } })
    if (existing) {
        console.log('⚠️  Sidecar already exists, skipping.')
        await p.$disconnect()
        return
    }

    // Build recipe JSON
    const recipeJson = JSON.stringify([
        { bottleId: cognac.id, name: 'Cognac', amount: 2 },
        { bottleId: tripleSec.id, name: 'Triple Sec', amount: 1 },
        { bottleId: lemon.id, name: 'Lemon Juice', amount: 1 },
    ])

    // --- Create Sidecar ---
    const sidecar = await p.cocktail.create({
        data: {
            name: 'Sidecar',
            description: 'A classic cognac sour with citrus brightness and subtle sweetness.',
            history: 'Created in the early 20th century in Paris or London, exact origin debated.',
            instruction: 'Shake all ingredients (Cognac, Triple Sec, Lemon Juice) with ice.\nStrain into a sugar-rimmed coupe.\nGarnish with orange peel.\nServe chilled.\nEnjoy immediately.',
            pictureUrl: '/images/cocktails/Sidecar.webp',
            volume: 4,
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            garnishes: { connect: (garnishRim && garnishPeel) ? [{ id: garnishRim.id }, { id: garnishPeel.id }] : (garnishPeel ? [{ id: garnishPeel.id }] : []) },
            tastes: { connect: [{ id: tasteCitrus.id }, { id: tasteDry.id }, { id: tasteBalanced.id }] },
        }
    })

    console.log(`✅ Sidecar created! ID: ${sidecar.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
