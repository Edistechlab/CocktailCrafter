const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    // --- Lookup IDs ---
    const gin = await p.bottle.findFirst({ where: { name: 'Gin' } })
    const limeJuice = await p.bottle.findFirst({ where: { name: 'Lime Juice' } })

    const glass = await p.glassType.findFirst({ where: { name: 'Coupe Glass / Coupette' } })
    const ice = await p.iceType.findFirst({ where: { name: 'No Ice (straight up/neat)' } })
    const technique = await p.shakeTechnique.findFirst({ where: { name: 'Standard Shake' } })
    const garnish = await p.garnish.findFirst({ where: { name: 'Citrus Twists / Peels' } })

    const tasteClean = await p.tasteProfile.findFirst({ where: { name: 'Clean' } })
    const tasteCitrus = await p.tasteProfile.findFirst({ where: { name: 'Citrus-forward' } })
    const tasteDry = await p.tasteProfile.findFirst({ where: { name: 'Dry' } })

    // Validate internals
    const missing = []
    if (!gin) missing.push('Bottle: Gin')
    if (!limeJuice) missing.push('Bottle: Lime Juice')
    if (!glass) missing.push('Glass: Coupe Glass / Coupette')
    if (!ice) missing.push('Ice: No Ice (straight up/neat)')
    if (!technique) missing.push('Technique: Standard Shake')
    if (!tasteClean) missing.push('Taste: Clean')
    if (!tasteCitrus) missing.push('Taste: Citrus-forward')
    if (!tasteDry) missing.push('Taste: Dry')

    if (missing.length > 0) {
        console.error('❌ Missing catalog entries:', missing)
        process.exit(1)
    }

    const user = await p.user.findFirst()
    if (!user) { process.exit(1) }

    // Check if exists
    const existing = await p.cocktail.findFirst({ where: { name: 'Gimlet' } })
    if (existing) {
        console.log('⚠️  Gimlet already exists, skipping.')
        await p.$disconnect()
        return
    }

    // Build recipe JSON
    const recipeJson = JSON.stringify([
        { bottleId: gin.id, name: 'Gin', amount: 2 },
        { bottleId: limeJuice.id, name: 'Lime Juice', amount: 1 },
    ])

    // --- Create Gimlet ---
    const gimlet = await p.cocktail.create({
        data: {
            name: 'Gimlet',
            description: 'A clean and sharp gin cocktail with bright lime character.',
            history: 'Originally used by British sailors to prevent scurvy using lime cordial and gin.',
            instruction: 'Shake all ingredients (Gin and Lime Juice/Cordial) with ice.\nStrain into a chilled coupe.\nGarnish with lime twist.\nServe immediately.\nEnjoy cold.',
            pictureUrl: '/images/cocktails/Gimlet.webp',
            volume: 3,
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            garnishes: { connect: garnish ? [{ id: garnish.id }] : [] },
            tastes: { connect: [{ id: tasteClean.id }, { id: tasteCitrus.id }, { id: tasteDry.id }] },
        }
    })

    console.log(`✅ Gimlet created! ID: ${gimlet.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
