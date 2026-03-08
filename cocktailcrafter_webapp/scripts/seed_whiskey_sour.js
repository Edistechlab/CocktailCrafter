const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    // --- Lookup IDs ---
    const bourbon = await p.bottle.findFirst({ where: { name: 'Bourbon Whiskey' } })
    const lemonJuice = await p.bottle.findFirst({ where: { name: 'Lemon Juice' } })

    const glass = await p.glassType.findFirst({ where: { name: 'Rocks Glass / Old Fashioned' } })
    const ice = await p.iceType.findFirst({ where: { name: 'Large Cube / King Cube' } })
    const technique = await p.shakeTechnique.findFirst({ where: { name: 'Dry Shake' } })
    const garnishWheel = await p.garnish.findFirst({ where: { name: 'Citrus Wheels / Slices' } })
    const garnishCherry = await p.garnish.findFirst({ where: { name: 'Cocktail Cherries' } })

    const tasteBalanced = await p.tasteProfile.findFirst({ where: { name: 'Balanced' } })
    const tasteSour = await p.tasteProfile.findFirst({ where: { name: 'Sour' } })
    const tasteRefresh = await p.tasteProfile.findFirst({ where: { name: 'Refreshing' } })

    // Validate
    const missing = []
    if (!bourbon) missing.push('Bottle: Bourbon Whiskey')
    if (!lemonJuice) missing.push('Bottle: Lemon Juice')
    if (!glass) missing.push('Glass: Rocks Glass / Old Fashioned')
    if (!ice) missing.push('Ice: Large Cube / King Cube')
    if (!technique) missing.push('Technique: Dry Shake')
    if (!garnishWheel) missing.push('Garnish: Citrus Wheels / Slices')
    if (!garnishCherry) missing.push('Garnish: Cocktail Cherries')
    if (!tasteBalanced) missing.push('Taste: Balanced')
    if (!tasteSour) missing.push('Taste: Sour')
    if (!tasteRefresh) missing.push('Taste: Refreshing')

    if (missing.length > 0) {
        console.error('❌ Missing catalog entries:', missing)
        process.exit(1)
    }

    const user = await p.user.findFirst()
    if (!user) { process.exit(1) }

    // Check if exists
    const existing = await p.cocktail.findFirst({ where: { name: 'Whiskey Sour' } })
    if (existing) {
        console.log('⚠️  Whiskey Sour already exists, skipping.')
        await p.$disconnect()
        return
    }

    // Build recipe JSON (Simple Syrup and Egg White removed as requested/per pattern)
    const recipeJson = JSON.stringify([
        { bottleId: bourbon.id, name: 'Bourbon Whiskey', amount: 2 },
        { bottleId: lemonJuice.id, name: 'Lemon Juice', amount: 1 },
    ])

    // --- Create Whiskey Sour ---
    const whiskeySour = await p.cocktail.create({
        data: {
            name: 'Whiskey Sour',
            description: 'A smooth balance of whiskey, citrus, and sweetness with a silky texture.',
            history: 'A classic sour cocktail dating back to the mid-1800s.',
            instruction: 'Add 0.75 part Simple Syrup and 0.5 part Egg White (optional) manually.\nDry shake all ingredients without ice.\nAdd ice and shake again until cold.\nStrain over a large cube.\nGarnish with lemon and cherry.\nServe immediately.',
            pictureUrl: '/images/cocktails/Whiskey Sour.webp',
            volume: 3,
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            garnishes: { connect: [{ id: garnishWheel.id }, { id: garnishCherry.id }] },
            tastes: { connect: [{ id: tasteBalanced.id }, { id: tasteSour.id }, { id: tasteRefresh.id }] },
        }
    })

    console.log(`✅ Whiskey Sour created! ID: ${whiskeySour.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
