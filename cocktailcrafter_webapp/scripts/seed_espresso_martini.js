const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    // --- Lookup IDs ---
    const vodka = await p.bottle.findFirst({ where: { name: 'Vodka' } })
    const kahlua = await p.bottle.findFirst({ where: { name: 'Kahlua' } })

    const glass = await p.glassType.findFirst({ where: { name: 'Martini Glass' } })
    const ice = await p.iceType.findFirst({ where: { name: 'No Ice (straight up/neat)' } })
    const technique = await p.shakeTechnique.findFirst({ where: { name: 'Standard Shake' } })
    const garnish = await p.garnish.findFirst({ where: { name: 'Grated Spices' } }) // Using Grated Spices as placeholder for beans context or Fresh Fruits if preferred

    const tasteRich = await p.tasteProfile.findFirst({ where: { name: 'Rich' } })
    const tasteAroma = await p.tasteProfile.findFirst({ where: { name: 'Fragrant / Aromatic' } })

    // Validate
    const missing = []
    if (!vodka) missing.push('Bottle: Vodka')
    if (!kahlua) missing.push('Bottle: Kahlua')
    if (!glass) missing.push('Glass: Martini Glass')
    if (!ice) missing.push('Ice: No Ice (straight up/neat)')
    if (!technique) missing.push('Technique: Standard Shake')
    if (!tasteRich) missing.push('Taste: Rich')
    if (!tasteAroma) missing.push('Taste: Fragrant / Aromatic')

    if (missing.length > 0) {
        console.error('❌ Missing catalog entries:', missing)
        process.exit(1)
    }

    const user = await p.user.findFirst()
    if (!user) { process.exit(1) }

    // Check if exists
    const existing = await p.cocktail.findFirst({ where: { name: 'Espresso Martini' } })
    if (existing) {
        console.log('⚠️  Espresso Martini already exists, skipping.')
        await p.$disconnect()
        return
    }

    // Build recipe JSON
    const recipeJson = JSON.stringify([
        { bottleId: vodka.id, name: 'Vodka', amount: 1.5 },
        { bottleId: kahlua.id, name: 'Kahlua', amount: 1 },
    ])

    // --- Create Espresso Martini ---
    const espressoMartini = await p.cocktail.create({
        data: {
            name: 'Espresso Martini',
            description: 'A rich and aromatic cocktail combining vodka, coffee, and sweetness into a smooth after-dinner drink.',
            history: 'Created in the 1980s by London bartender Dick Bradsell for a guest who wanted something to “wake her up”.',
            instruction: 'Add 1 part Fresh Espresso and 0.5 part Simple Syrup (manually).\nShake all ingredients (including Vodka and Kahlua) hard with ice.\nStrain into a chilled martini glass.\nEnsure a smooth crema foam on top.\nGarnish with three coffee beans.\nServe immediately.',
            pictureUrl: '/images/cocktails/Espresso Martini.webp',
            volume: 4,
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            tastes: { connect: [{ id: tasteRich.id }, { id: tasteAroma.id }] },
        }
    })

    console.log(`✅ Espresso Martini created! ID: ${espressoMartini.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
