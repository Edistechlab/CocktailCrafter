const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    // --- Lookup IDs ---
    const bourbon = await p.bottle.findFirst({ where: { name: 'Bourbon Whiskey' } })
    const bitters = await p.bottle.findFirst({ where: { name: 'Angostura Bitters' } })

    const glass = await p.glassType.findFirst({ where: { name: 'Rocks Glass / Old Fashioned' } })
    const ice = await p.iceType.findFirst({ where: { name: 'Large Cube / King Cube' } })
    const technique = await p.shakeTechnique.findFirst({ where: { name: 'Built / Built over Ice' } })
    const garnishTwist = await p.garnish.findFirst({ where: { name: 'Citrus Twists / Peels' } })
    const garnishChery = await p.garnish.findFirst({ where: { name: 'Cocktail Cherries' } })

    const tasteBoozy = await p.tasteProfile.findFirst({ where: { name: 'Boozy' } })
    const tasteBold = await p.tasteProfile.findFirst({ where: { name: 'Bold' } })
    const tasteBalanced = await p.tasteProfile.findFirst({ where: { name: 'Balanced' } })

    // Validate
    const missing = []
    if (!bourbon) missing.push('Bottle: Bourbon Whiskey')
    if (!bitters) missing.push('Bottle: Angostura Bitters')
    if (!glass) missing.push('Glass: Rocks Glass / Old Fashioned')
    if (!ice) missing.push('Ice: Large Cube / King Cube')
    if (!technique) missing.push('Technique: Built / Built over Ice')
    if (!garnishTwist) missing.push('Garnish: Citrus Twists / Peels')
    if (!garnishChery) missing.push('Garnish: Cocktail Cherries')
    if (!tasteBoozy) missing.push('Taste: Boozy')
    if (!tasteBold) missing.push('Taste: Bold')
    if (!tasteBalanced) missing.push('Taste: Balanced')

    if (missing.length > 0) {
        console.error('❌ Missing catalog entries:', missing)
        process.exit(1)
    }

    const user = await p.user.findFirst()
    if (!user) { process.exit(1) }

    // Check if exists
    const existing = await p.cocktail.findFirst({ where: { name: 'Old Fashioned' } })
    if (existing) {
        console.log('⚠️  Old Fashioned already exists, skipping.')
        await p.$disconnect()
        return
    }

    // Build recipe JSON
    const recipeJson = JSON.stringify([
        { bottleId: bourbon.id, name: 'Bourbon Whiskey', amount: 2 },
        { bottleId: bitters.id, name: 'Angostura Bitters', amount: 3 }, // 3 dashes
    ])

    // --- Create Old Fashioned ---
    const oldFashioned = await p.cocktail.create({
        data: {
            name: 'Old Fashioned',
            description: 'A spirit-forward cocktail highlighting whiskey, sugar, and bitters in a simple, elegant form.',
            history: 'One of the oldest known cocktails, dating back to early 19th century America.',
            instruction: 'Dissolve sugar (add sugar manually) with bitters in the glass.\nAdd whiskey and a large ice cube.\nStir gently until chilled.\nExpress orange peel oils over drink.\nAdd peel and cherry.',
            pictureUrl: '/images/cocktails/Old Fashioned.webp',
            volume: 2.5,
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            garnishes: { connect: [{ id: garnishTwist.id }, { id: garnishChery.id }] },
            tastes: { connect: [{ id: tasteBoozy.id }, { id: tasteBold.id }, { id: tasteBalanced.id }] },
        }
    })

    console.log(`✅ Old Fashioned created! ID: ${oldFashioned.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
