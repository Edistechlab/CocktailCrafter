const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    // --- Lookup IDs ---
    const vodka = await p.bottle.findFirst({ where: { name: 'Vodka' } })
    const tripleSec = await p.bottle.findFirst({ where: { name: 'Triple Sec' } })
    const cranberry = await p.bottle.findFirst({ where: { name: 'Cranberry Juice' } })
    const limeJuice = await p.bottle.findFirst({ where: { name: 'Lime Juice' } })

    const glass = await p.glassType.findFirst({ where: { name: 'Martini Glass' } })
    const ice = await p.iceType.findFirst({ where: { name: 'No Ice (straight up/neat)' } })
    const technique = await p.shakeTechnique.findFirst({ where: { name: 'Standard Shake' } })
    const garnish = await p.garnish.findFirst({ where: { name: 'Citrus Twists / Peels' } })

    const tasteCitrus = await p.tasteProfile.findFirst({ where: { name: 'Citrus-forward' } })
    const tasteRefresh = await p.tasteProfile.findFirst({ where: { name: 'Refreshing' } })
    const tasteSweet = await p.tasteProfile.findFirst({ where: { name: 'Subtly sweet' } })

    // Validate
    const missing = []
    if (!vodka) missing.push('Bottle: Vodka')
    if (!tripleSec) missing.push('Bottle: Triple Sec')
    if (!cranberry) missing.push('Bottle: Cranberry Juice')
    if (!limeJuice) missing.push('Bottle: Lime Juice')
    if (!glass) missing.push('Glass: Martini Glass')
    if (!ice) missing.push('Ice: No Ice (straight up/neat)')
    if (!technique) missing.push('Technique: Standard Shake')
    if (!garnish) missing.push('Garnish: Citrus Twists / Peels')
    if (!tasteCitrus) missing.push('Taste: Citrus-forward')
    if (!tasteRefresh) missing.push('Taste: Refreshing')
    if (!tasteSweet) missing.push('Taste: Subtly sweet')

    if (missing.length > 0) {
        console.error('❌ Missing catalog entries:', missing)
        process.exit(1)
    }

    const user = await p.user.findFirst()
    if (!user) { process.exit(1) }

    // Check if exists
    const existing = await p.cocktail.findFirst({ where: { name: 'Cosmopolitan' } })
    if (existing) {
        console.log('⚠️  Cosmopolitan already exists, skipping.')
        await p.$disconnect()
        return
    }

    // Build recipe JSON
    const recipeJson = JSON.stringify([
        { bottleId: vodka.id, name: 'Vodka', amount: 1.5 },
        { bottleId: tripleSec.id, name: 'Triple Sec', amount: 1 },
        { bottleId: cranberry.id, name: 'Cranberry Juice', amount: 1 },
        { bottleId: limeJuice.id, name: 'Lime Juice', amount: 0.5 },
    ])

    // --- Create Cosmopolitan ---
    const cosmopolitan = await p.cocktail.create({
        data: {
            name: 'Cosmopolitan',
            description: 'A stylish, citrus-forward vodka cocktail with a vibrant pink color and crisp finish.',
            history: 'Popularized in the 1990s, especially in New York and through pop culture, becoming a modern classic.',
            instruction: 'Shake all ingredients with ice until well chilled.\nStrain into a chilled martini glass.\nGarnish with a lime twist.\nServe immediately.\nEnjoy fresh and cold.',
            pictureUrl: '/images/cocktails/Cosmopolitan.webp',
            volume: 4,
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            garnishes: { connect: [{ id: garnish.id }] },
            tastes: { connect: [{ id: tasteCitrus.id }, { id: tasteRefresh.id }, { id: tasteSweet.id }] },
        }
    })

    console.log(`✅ Cosmopolitan created! ID: ${cosmopolitan.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
