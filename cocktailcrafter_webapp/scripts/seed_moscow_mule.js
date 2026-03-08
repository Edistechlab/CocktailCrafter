const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    // --- Lookup IDs ---
    const vodka = await p.bottle.findFirst({ where: { name: 'Vodka' } })
    const limeJuice = await p.bottle.findFirst({ where: { name: 'Lime Juice' } })

    const glass = await p.glassType.findFirst({ where: { name: 'Copper Mug' } })
    const ice = await p.iceType.findFirst({ where: { name: 'Standard Cube' } })
    const technique = await p.shakeTechnique.findFirst({ where: { name: 'Built / Built over Ice' } })
    const garnishWedge = await p.garnish.findFirst({ where: { name: 'Citrus Wedges' } })
    const garnishHerbs = await p.garnish.findFirst({ where: { name: 'Fresh Herbs' } })

    const tasteRefresh = await p.tasteProfile.findFirst({ where: { name: 'Refreshing' } })
    const tasteSpicy = await p.tasteProfile.findFirst({ where: { name: 'Spicy' } })
    const tasteCitrus = await p.tasteProfile.findFirst({ where: { name: 'Citrus-forward' } })

    // Validate
    const missing = []
    if (!vodka) missing.push('Bottle: Vodka')
    if (!limeJuice) missing.push('Bottle: Lime Juice')
    if (!glass) missing.push('Glass: Copper Mug')
    if (!ice) missing.push('Ice: Standard Cube')
    if (!technique) missing.push('Technique: Built / Built over Ice')
    if (!garnishWedge) missing.push('Garnish: Citrus Wedges')
    if (!garnishHerbs) missing.push('Garnish: Fresh Herbs')
    if (!tasteRefresh) missing.push('Taste: Refreshing')
    if (!tasteSpicy) missing.push('Taste: Spicy')
    if (!tasteCitrus) missing.push('Taste: Citrus-forward')

    if (missing.length > 0) {
        console.error('❌ Missing catalog entries:', missing)
        process.exit(1)
    }

    const user = await p.user.findFirst()
    if (!user) { process.exit(1) }

    // Check if exists
    const existing = await p.cocktail.findFirst({ where: { name: 'Moscow Mule' } })
    if (existing) {
        console.log('⚠️  Moscow Mule already exists, skipping.')
        await p.$disconnect()
        return
    }

    // Build recipe JSON (Ginger Beer removed as requested)
    const recipeJson = JSON.stringify([
        { bottleId: vodka.id, name: 'Vodka', amount: 2 },
        { bottleId: limeJuice.id, name: 'Lime Juice', amount: 0.5 },
    ])

    // --- Create Moscow Mule ---
    const moscowMule = await p.cocktail.create({
        data: {
            name: 'Moscow Mule',
            description: 'A refreshing vodka highball with spicy ginger beer and bright lime.',
            history: 'Created in the 1940s in the USA to promote vodka and ginger beer together.',
            instruction: 'Fill mug with ice.\nAdd vodka and lime juice.\nTop with Ginger Beer (add manually).\nStir gently.\nGarnish with lime and mint.',
            pictureUrl: '/images/cocktails/Moscow Mule.webp',
            volume: 3,
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            garnishes: { connect: [{ id: garnishWedge.id }, { id: garnishHerbs.id }] },
            tastes: { connect: [{ id: tasteRefresh.id }, { id: tasteSpicy.id }, { id: tasteCitrus.id }] },
        }
    })

    console.log(`✅ Moscow Mule created! ID: ${moscowMule.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
