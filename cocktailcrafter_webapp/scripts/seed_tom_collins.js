const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    // --- Lookup IDs ---
    const gin = await p.bottle.findFirst({ where: { name: 'Gin' } })
    const lemon = await p.bottle.findFirst({ where: { name: 'Lemon Juice' } })
    const soda = await p.bottle.findFirst({ where: { name: 'Soda Water' } })

    const glass = await p.glassType.findFirst({ where: { name: 'Collins Glass' } })
    const ice = await p.iceType.findFirst({ where: { name: 'Collins Spear / Ice Spear' } })
    const technique = await p.shakeTechnique.findFirst({ where: { name: 'Built / Built over Ice' } })
    const garnishWheel = await p.garnish.findFirst({ where: { name: 'Citrus Wheels / Slices' } })
    const garnishCherry = await p.garnish.findFirst({ where: { name: 'Cocktail Cherries' } })

    const tasteRefresh = await p.tasteProfile.findFirst({ where: { name: 'Refreshing' } })
    const tasteCitrus = await p.tasteProfile.findFirst({ where: { name: 'Citrus-forward' } })
    const tasteClean = await p.tasteProfile.findFirst({ where: { name: 'Clean' } })

    // Validate
    const missing = []
    if (!gin) missing.push('Bottle: Gin')
    if (!lemon) missing.push('Bottle: Lemon Juice')
    if (!soda) missing.push('Bottle: Soda Water')
    if (!glass) missing.push('Glass: Collins Glass')
    if (!ice) missing.push('Ice: Collins Spear / Ice Spear')
    if (!technique) missing.push('Technique: Built / Built over Ice')
    if (!garnishWheel) missing.push('Garnish: Citrus Wheels / Slices')
    if (!garnishCherry) missing.push('Garnish: Cocktail Cherries')
    if (!tasteRefresh) missing.push('Taste: Refreshing')
    if (!tasteCitrus) missing.push('Taste: Citrus-forward')
    if (!tasteClean) missing.push('Taste: Clean')

    if (missing.length > 0) {
        console.error('❌ Missing catalog entries:', missing)
        process.exit(1)
    }

    const user = await p.user.findFirst()
    if (!user) { process.exit(1) }

    // Check if exists
    const existing = await p.cocktail.findFirst({ where: { name: 'Tom Collins' } })
    if (existing) {
        console.log('⚠️  Tom Collins already exists, skipping.')
        await p.$disconnect()
        return
    }

    // Build recipe JSON (Simple Syrup removed as requested)
    const recipeJson = JSON.stringify([
        { bottleId: gin.id, name: 'Gin', amount: 2 },
        { bottleId: lemon.id, name: 'Lemon Juice', amount: 1 },
        { bottleId: soda.id, name: 'Soda Water', amount: 1 }, // Representing "Top with"
    ])

    // --- Create Tom Collins ---
    const tomCollins = await p.cocktail.create({
        data: {
            name: 'Tom Collins',
            description: 'A light, refreshing gin cocktail with citrus and soda.',
            history: 'Popular in the 19th century and named after a famous practical joke (“Tom Collins Hoax”).',
            instruction: 'Build gin and lemon over ice. Add 0.75 part Simple Syrup manually.\nTop with soda water.\nStir gently.\nGarnish with lemon and cherry.\nServe fresh and fizzy.',
            pictureUrl: '/images/cocktails/Tom Collins.webp',
            volume: 4,
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            garnishes: { connect: [{ id: garnishWheel.id }, { id: garnishCherry.id }] },
            tastes: { connect: [{ id: tasteRefresh.id }, { id: tasteCitrus.id }, { id: tasteClean.id }] },
        }
    })

    console.log(`✅ Tom Collins created! ID: ${tomCollins.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
