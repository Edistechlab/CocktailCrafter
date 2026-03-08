const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    // --- Lookup IDs ---
    const tequila = await p.bottle.findFirst({ where: { name: 'Tequila Blanco' } })
    const limeJuice = await p.bottle.findFirst({ where: { name: 'Lime Juice' } })

    const glass = await p.glassType.findFirst({ where: { name: 'Highball Glass' } })
    const ice = await p.iceType.findFirst({ where: { name: 'Collins Spear / Ice Spear' } })
    const technique = await p.shakeTechnique.findFirst({ where: { name: 'Built / Built over Ice' } })
    const garnishWheel = await p.garnish.findFirst({ where: { name: 'Citrus Wheels / Slices' } })
    const garnishRim = await p.garnish.findFirst({ where: { name: 'Rims' } })

    const tasteRefresh = await p.tasteProfile.findFirst({ where: { name: 'Refreshing' } })
    const tasteCitrus = await p.tasteProfile.findFirst({ where: { name: 'Citrus-forward' } })
    const tasteBitter = await p.tasteProfile.findFirst({ where: { name: 'Bitter' } })

    // Validate essentials
    const missing = []
    if (!tequila) missing.push('Bottle: Tequila Blanco')
    if (!limeJuice) missing.push('Bottle: Lime Juice')
    if (!glass) missing.push('Glass: Highball Glass')
    if (!ice) missing.push('Ice: Collins Spear / Ice Spear')
    if (!technique) missing.push('Technique: Built / Built over Ice')
    if (!tasteRefresh) missing.push('Taste: Refreshing')
    if (!tasteCitrus) missing.push('Taste: Citrus-forward')

    if (missing.length > 0) {
        console.error('❌ Missing catalog entries:', missing)
        process.exit(1)
    }

    const user = await p.user.findFirst()
    if (!user) { process.exit(1) }

    // --- Check if already exists ---
    const existing = await p.cocktail.findFirst({ where: { name: 'Paloma' } })
    if (existing) {
        console.log('⚠️  Paloma already exists, skipping.')
        await p.$disconnect()
        return
    }

    // Recipe JSON (Grapefruit Soda excluded as requested per pattern)
    const recipeJson = JSON.stringify([
        { bottleId: tequila.id, name: 'Tequila Blanco', amount: 2 },
        { bottleId: limeJuice.id, name: 'Lime Juice', amount: 0.5 },
    ])

    // --- Create Paloma ---
    const paloma = await p.cocktail.create({
        data: {
            name: 'Paloma',
            description: 'A refreshing tequila highball combining citrus and gentle bitterness.',
            history: 'Originating in Mexico, the Paloma is one of the most popular tequila cocktails.',
            instruction: 'Fill glass with ice.\nAdd tequila and lime juice.\nTop with Grapefruit Soda (add manually).\nStir gently.\nGarnish with a grapefruit wheel and salt rim.\nServe immediately.',
            pictureUrl: '/images/cocktails/Paloma.webp',
            volume: 3,
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            garnishes: { connect: (garnishWheel && garnishRim) ? [{ id: garnishWheel.id }, { id: garnishRim.id }] : (garnishWheel ? [{ id: garnishWheel.id }] : []) },
            tastes: { connect: [{ id: tasteRefresh.id }, { id: tasteCitrus.id }, { id: tasteBitter.id }] },
        }
    })

    console.log(`✅ Paloma created! ID: ${paloma.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
