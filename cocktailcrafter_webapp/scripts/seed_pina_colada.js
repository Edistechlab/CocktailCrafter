const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    // --- Lookup IDs ---
    const rum = await p.bottle.findFirst({ where: { name: 'White Rum' } })
    const pineapple = await p.bottle.findFirst({ where: { name: 'Pineapple Juice' } })

    const glass = await p.glassType.findFirst({ where: { name: 'Hurricane Glass' } })
    const ice = await p.iceType.findFirst({ where: { name: 'Crushed Ice / Pebble Ice' } })
    const technique = await p.shakeTechnique.findFirst({ where: { name: 'Standard Shake' } })
    const garnishFruit = await p.garnish.findFirst({ where: { name: 'Tropical / Exotic Fruits' } })
    const garnishCherry = await p.garnish.findFirst({ where: { name: 'Cocktail Cherries' } })

    const tasteCreamy = await p.tasteProfile.findFirst({ where: { name: 'Creamy' } })
    const tasteSweet = await p.tasteProfile.findFirst({ where: { name: 'Sweet' } })

    // Validate
    const missing = []
    if (!rum) missing.push('Bottle: White Rum')
    if (!pineapple) missing.push('Bottle: Pineapple Juice')
    if (!glass) missing.push('Glass: Hurricane Glass')
    if (!ice) missing.push('Ice: Crushed Ice / Pebble Ice')
    if (!technique) missing.push('Technique: Standard Shake')
    if (!garnishFruit) missing.push('Garnish: Tropical / Exotic Fruits')
    if (!garnishCherry) missing.push('Garnish: Cocktail Cherries')
    if (!tasteCreamy) missing.push('Taste: Creamy')
    if (!tasteSweet) missing.push('Taste: Sweet')

    if (missing.length > 0) {
        console.error('❌ Missing catalog entries:', missing)
        process.exit(1)
    }

    const user = await p.user.findFirst()
    if (!user) { process.exit(1) }

    // Check if exists
    const existing = await p.cocktail.findFirst({ where: { name: 'Piña Colada' } })
    if (existing) {
        console.log('⚠️  Piña Colada already exists, skipping.')
        await p.$disconnect()
        return
    }

    // Build recipe JSON (Coconut Cream removed as requested)
    const recipeJson = JSON.stringify([
        { bottleId: rum.id, name: 'White Rum', amount: 2 },
        { bottleId: pineapple.id, name: 'Pineapple Juice', amount: 1.5 },
    ])

    // --- Create Piña Colada ---
    const pinaColada = await p.cocktail.create({
        data: {
            name: 'Piña Colada',
            description: 'A creamy tropical cocktail combining rum, coconut, and pineapple.',
            history: 'Originated in Puerto Rico in the 1950s and became the national drink.',
            instruction: 'Add 1 part Coconut Cream (manually).\nShake or blend all ingredients (including Rum and Pineapple Juice) with ice.\nPour into a chilled hurricane glass.\nGarnish with pineapple and cherry.\nServe immediately.\nEnjoy cold and creamy.',
            pictureUrl: '/images/cocktails/Pina Colada.webp',
            volume: 4.5,
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            garnishes: { connect: [{ id: garnishFruit.id }, { id: garnishCherry.id }] },
            tastes: { connect: [{ id: tasteCreamy.id }, { id: tasteSweet.id }] },
        }
    })

    console.log(`✅ Piña Colada created! ID: ${pinaColada.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
