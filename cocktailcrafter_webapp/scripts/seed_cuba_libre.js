const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    // --- Lookup IDs ---
    const rum = await p.bottle.findFirst({ where: { name: 'White Rum' } })
    const cola = await p.bottle.findFirst({ where: { name: 'Cola' } })
    const limeJuice = await p.bottle.findFirst({ where: { name: 'Lime Juice' } })

    const glass = await p.glassType.findFirst({ where: { name: 'Highball Glass' } })
    const ice = await p.iceType.findFirst({ where: { name: 'Standard Cube' } })
    const technique = await p.shakeTechnique.findFirst({ where: { name: 'Built / Built over Ice' } })
    const garnish = await p.garnish.findFirst({ where: { name: 'Citrus Wedges' } })

    const tasteRefresh = await p.tasteProfile.findFirst({ where: { name: 'Refreshing' } })
    const tasteCitrus = await p.tasteProfile.findFirst({ where: { name: 'Citrus-forward' } })
    const tasteSweet = await p.tasteProfile.findFirst({ where: { name: 'Subtly sweet' } })

    // Validate internals
    const missing = []
    if (!rum) missing.push('Bottle: White Rum')
    if (!cola) missing.push('Bottle: Cola')
    if (!limeJuice) missing.push('Bottle: Lime Juice')
    if (!glass) missing.push('Glass: Highball Glass')
    if (!ice) missing.push('Ice: Standard Cube')
    if (!technique) missing.push('Technique: Built / Built over Ice')
    if (!tasteRefresh) missing.push('Taste: Refreshing')
    if (!tasteCitrus) missing.push('Taste: Citrus-forward')

    if (missing.length > 0) {
        console.error('❌ Missing catalog entries:', missing)
        process.exit(1)
    }

    const user = await p.user.findFirst()
    if (!user) { process.exit(1) }

    // Check if exists
    const existing = await p.cocktail.findFirst({ where: { name: 'Cuba Libre' } })
    if (existing) {
        console.log('⚠️  Cuba Libre already exists, skipping.')
        await p.$disconnect()
        return
    }

    // Build recipe JSON (Cola included with 0.5 as requested)
    const recipeJson = JSON.stringify([
        { bottleId: rum.id, name: 'White Rum', amount: 2 },
        { bottleId: limeJuice.id, name: 'Lime Juice', amount: 0.5 },
        { bottleId: cola.id, name: 'Cola', amount: 0.5 },
    ])

    // --- Create Cuba Libre ---
    const cubaLibre = await p.cocktail.create({
        data: {
            name: 'Cuba Libre',
            description: 'A simple and refreshing rum and cola cocktail with a citrus twist.',
            history: 'Created in Cuba around 1900 celebrating independence, meaning “Free Cuba”.',
            instruction: 'Fill glass with ice.\nAdd rum and lime juice.\nTop with cola (0.5 part included in recipe, top up as desired).\nStir gently.\nGarnish with a lime wedge and serve.',
            pictureUrl: '/images/cocktails/Cuba Libre.webp',
            volume: 3,
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            garnishes: { connect: garnish ? [{ id: garnish.id }] : [] },
            tastes: { connect: [{ id: tasteRefresh.id }, { id: tasteCitrus.id }, { id: tasteSweet.id }] },
        }
    })

    console.log(`✅ Cuba Libre created! ID: ${cubaLibre.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
