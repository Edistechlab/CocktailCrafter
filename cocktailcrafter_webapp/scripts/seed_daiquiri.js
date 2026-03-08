const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    // --- Lookup IDs ---
    const rum = await p.bottle.findFirst({ where: { name: 'White Rum' } })
    const limeJuice = await p.bottle.findFirst({ where: { name: 'Lime Juice' } })

    const glass = await p.glassType.findFirst({ where: { name: 'Coupe Glass / Coupette' } })
    const ice = await p.iceType.findFirst({ where: { name: 'No Ice (straight up/neat)' } })
    const technique = await p.shakeTechnique.findFirst({ where: { name: 'Standard Shake' } })
    const garnish = await p.garnish.findFirst({ where: { name: 'Citrus Twists / Peels' } })

    const tasteRefresh = await p.tasteProfile.findFirst({ where: { name: 'Refreshing' } })
    const tasteCitrus = await p.tasteProfile.findFirst({ where: { name: 'Citrus-forward' } })
    const tasteBalanced = await p.tasteProfile.findFirst({ where: { name: 'Balanced' } })

    // Validate
    const missing = []
    if (!rum) missing.push('Bottle: White Rum')
    if (!limeJuice) missing.push('Bottle: Lime Juice')
    if (!glass) missing.push('Glass: Coupe Glass / Coupette')
    if (!ice) missing.push('Ice: No Ice (straight up/neat)')
    if (!technique) missing.push('Technique: Standard Shake')
    if (!garnish) missing.push('Garnish: Citrus Twists / Peels')
    if (!tasteRefresh) missing.push('Taste: Refreshing')
    if (!tasteCitrus) missing.push('Taste: Citrus-forward')
    if (!tasteBalanced) missing.push('Taste: Balanced')

    if (missing.length > 0) {
        console.error('❌ Missing catalog entries:', missing)
        process.exit(1)
    }

    const user = await p.user.findFirst()
    if (!user) { process.exit(1) }

    // Check if exists
    const existing = await p.cocktail.findFirst({ where: { name: 'Daiquiri' } })
    if (existing) {
        console.log('⚠️  Daiquiri already exists, skipping.')
        await p.$disconnect()
        return
    }

    // Build recipe JSON (Simple Syrup removed as requested)
    const recipeJson = JSON.stringify([
        { bottleId: rum.id, name: 'White Rum', amount: 2 },
        { bottleId: limeJuice.id, name: 'Lime Juice', amount: 1 },
    ])

    // --- Create Daiquiri ---
    const daiquiri = await p.cocktail.create({
        data: {
            name: 'Daiquiri',
            description: 'A crisp and refreshing rum sour highlighting lime and subtle sweetness.',
            history: 'Originated in Cuba in the early 1900s and became famous in Havana bars.',
            instruction: 'Add 0.75 part Simple Syrup (manually).\nShake all ingredients (including Rum and Lime Juice) with ice for 12–15 seconds.\nStrain into a chilled coupe glass.\nGarnish with lime twist.\nServe immediately.\nKeep it cold and fresh.',
            pictureUrl: '/images/cocktails/Daiquiri.webp',
            volume: 3,
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            garnishes: { connect: [{ id: garnish.id }] },
            tastes: { connect: [{ id: tasteRefresh.id }, { id: tasteCitrus.id }, { id: tasteBalanced.id }] },
        }
    })

    console.log(`✅ Daiquiri created! ID: ${daiquiri.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
