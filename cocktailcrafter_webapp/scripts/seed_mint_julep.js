const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    // --- Lookup IDs ---
    const bourbon = await p.bottle.findFirst({ where: { name: 'Bourbon Whiskey' } })

    const glass = await p.glassType.findFirst({ where: { name: 'Rocks Glass / Old Fashioned' } })
    const ice = await p.iceType.findFirst({ where: { name: 'Crushed Ice / Pebble Ice' } })
    const technique = await p.shakeTechnique.findFirst({ where: { name: 'Built / Built over Ice' } })
    const garnish = await p.garnish.findFirst({ where: { name: 'Fresh Herbs' } })

    const tasteRefresh = await p.tasteProfile.findFirst({ where: { name: 'Refreshing' } })
    const tasteHerbs = await p.tasteProfile.findFirst({ where: { name: 'Herbaceous' } })
    const tasteBoozy = await p.tasteProfile.findFirst({ where: { name: 'Boozy' } })

    // Validate internals
    const missing = []
    if (!bourbon) missing.push('Bottle: Bourbon Whiskey')
    if (!glass) missing.push('Glass: Rocks Glass / Old Fashioned')
    if (!ice) missing.push('Ice: Crushed Ice / Pebble Ice')
    if (!technique) missing.push('Technique: Built / Built over Ice')
    if (!garnish) missing.push('Garnish: Fresh Herbs')
    if (!tasteRefresh) missing.push('Taste: Refreshing')
    if (!tasteHerbs) missing.push('Taste: Herbaceous')
    if (!tasteBoozy) missing.push('Taste: Boozy')

    if (missing.length > 0) {
        console.error('❌ Missing catalog entries:', missing)
        process.exit(1)
    }

    const user = await p.user.findFirst()
    if (!user) { process.exit(1) }

    // Check if exists
    const existing = await p.cocktail.findFirst({ where: { name: 'Mint Julep' } })
    if (existing) {
        console.log('⚠️  Mint Julep already exists, skipping.')
        await p.$disconnect()
        return
    }

    // Build recipe JSON (Simple Syrup and Mint muddling in instructions)
    const recipeJson = JSON.stringify([
        { bottleId: bourbon.id, name: 'Bourbon Whiskey', amount: 2 },
    ])

    // --- Create Mint Julep ---
    const mintJulep = await p.cocktail.create({
        data: {
            name: 'Mint Julep',
            description: 'A refreshing bourbon cocktail with mint and crushed ice.',
            history: 'Originated in the southern United States and is the official drink of the Kentucky Derby.',
            instruction: 'Gently muddle Fresh Mint Leaves and 0.5 part Simple Syrup (manually) in the glass.\nFill glass with crushed ice.\nAdd Bourbon Whiskey.\nStir gently.\nGarnish with mint bouquet.\nServe immediately.',
            pictureUrl: '/images/cocktails/Mint Julep.webp',
            volume: 2.5,
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            garnishes: { connect: [{ id: garnish.id }] },
            tastes: { connect: [{ id: tasteRefresh.id }, { id: tasteHerbs.id }, { id: tasteBoozy.id }] },
        }
    })

    console.log(`✅ Mint Julep created! ID: ${mintJulep.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
