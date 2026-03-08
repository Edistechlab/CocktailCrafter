const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    // --- Lookup IDs ---
    const cachaca = await p.bottle.findFirst({ where: { name: 'Cachaça' } })

    const glass = await p.glassType.findFirst({ where: { name: 'Rocks Glass / Old Fashioned' } })
    const ice = await p.iceType.findFirst({ where: { name: 'Crushed Ice / Pebble Ice' } })
    const technique = await p.shakeTechnique.findFirst({ where: { name: 'Built / Built over Ice' } })
    const garnishLime = await p.garnish.findFirst({ where: { name: 'Citrus Wedges' } })

    const tasteRefresh = await p.tasteProfile.findFirst({ where: { name: 'Refreshing' } })
    const tasteTart = await p.tasteProfile.findFirst({ where: { name: 'Tart' } })
    const tasteBalanced = await p.tasteProfile.findFirst({ where: { name: 'Balanced' } })

    // Validate Essentials
    const missing = []
    if (!cachaca) missing.push('Bottle: Cachaça')
    if (!glass) missing.push('Glass: Rocks Glass / Old Fashioned')
    if (!ice) missing.push('Ice: Crushed Ice / Pebble Ice')
    if (!technique) missing.push('Technique: Built / Built over Ice')
    if (!tasteRefresh) missing.push('Taste: Refreshing')
    if (!tasteTart) missing.push('Taste: Tart')

    if (missing.length > 0) {
        console.error('❌ Missing catalog entries:', missing)
        process.exit(1)
    }

    const user = await p.user.findFirst()
    if (!user) { process.exit(1) }

    // Check if exists
    const existing = await p.cocktail.findFirst({ where: { name: 'Caipirinha' } })
    if (existing) {
        console.log('⚠️  Caipirinha already exists, skipping.')
        await p.$disconnect()
        return
    }

    // Recipe JSON (Sugar and Lime wedges manually added in instructions)
    const recipeJson = JSON.stringify([
        { bottleId: cachaca.id, name: 'Cachaça', amount: 2 },
    ])

    // --- Create Caipirinha ---
    const caipirinha = await p.cocktail.create({
        data: {
            name: 'Caipirinha',
            description: 'Brazil’s national cocktail made with cachaça, lime, and sugar.',
            history: 'Originated in Brazil and became internationally popular in the late 20th century.',
            instruction: 'Muddle 1 lime (cut into wedges) and 2 tsp Sugar (manually) in the glass.\nAdd crushed ice.\nPour in Cachaça.\nStir well.\nServe fresh.',
            pictureUrl: '/images/cocktails/Caipirinha.webp',
            volume: 2.5,
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            garnishes: { connect: garnishLime ? [{ id: garnishLime.id }] : [] },
            tastes: { connect: [{ id: tasteRefresh.id }, { id: tasteTart.id }, { id: tasteBalanced.id }] },
        }
    })

    console.log(`✅ Caipirinha created! ID: ${caipirinha.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
