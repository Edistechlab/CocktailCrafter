const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    console.log('🚀 Starting Penicillin seed script...')

    const existing = await p.cocktail.findFirst({ where: { name: 'Penicillin' } })
    if (existing) { await p.$disconnect(); return }

    const scotchBlended = await p.bottle.findFirst({ where: { name: 'Scotch Blended' } })
    const scotchIslay = await p.bottle.findFirst({ where: { name: 'Talisker' } }) // Using Talisker as a representative Islay-style/Smoky scotch if general is missing
    const lemon = await p.bottle.findFirst({ where: { name: 'Lemon Juice' } })
    const honey = await p.bottle.findFirst({ where: { name: 'Honey Syrup' } })

    let gingerSyrup = await p.bottle.findFirst({ where: { name: 'Honey-Ginger Syrup' } })
    if (!gingerSyrup) {
        gingerSyrup = await p.bottle.create({ data: { name: 'Honey-Ginger Syrup', category: 'Syrup', type: 'Special Syrup', description: 'A sweet and spicy syrup made with honey and fresh ginger.' } })
    }

    const glass = await p.glassType.findFirst({ where: { name: 'Rocks Glass / Old Fashioned' } })
    const ice = await p.iceType.findFirst({ where: { name: 'Large Cube / King Cube' } })
    const techniqueShake = await p.shakeTechnique.findFirst({ where: { name: 'Standard Shake (Hard/Regular)' } })
    const techniqueFloat = await p.shakeTechnique.findFirst({ where: { name: 'Layered / Float' } })

    const tasteSmoky = await p.tasteProfile.findFirst({ where: { name: 'Smoky' } })
    const tasteSpicy = await p.tasteProfile.findFirst({ where: { name: 'Spicy' } })

    const user = await p.user.findFirst()
    if (!user) { process.exit(1) }

    const recipe = JSON.stringify([
        { bottleId: scotchBlended.id, name: 'Blended Scotch', amount: 2 },
        { bottleId: lemon.id, name: 'Lemon Juice', amount: 0.75 },
        { bottleId: honey.id, name: 'Honey Syrup', amount: 0.375 },
        { bottleId: gingerSyrup.id, name: 'Honey-Ginger Syrup', amount: 0.375 },
        { bottleId: (scotchIslay?.id || scotchBlended.id), name: 'Islay Single Malt', amount: 0.25 },
    ])

    const cocktail = await p.cocktail.create({
        data: {
            name: 'Penicillin',
            description: 'A gold-standard modern classic combining the spice of ginger, the sweetness of honey, and the deep smokiness of Islay Scotch.',
            history: 'Created in 2005 by Sam Ross at Milk & Honey in New York.',
            instruction: 'Add blended scotch, lemon juice, and honey-ginger syrup into a shaker with ice.\nShake vigorously until well-chilled.\nStrain into a rocks glass over one large ice cube.\nGently float the Islay single malt scotch over the back of a bar spoon on top of the drink.\nGarnish with candied ginger.\nServe immediately.',
            pictureUrl: '/images/cocktails/Penicillin.webp',
            volume: 3.75,
            recipe: recipe,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: techniqueShake.id }, { id: techniqueFloat.id }] },
            tastes: { connect: [{ id: tasteSmoky.id }, { id: tasteSpicy.id }] },
            automationLevel: 2
        }
    })

    console.log(`✅ Created ${cocktail.name}`)
    await p.$disconnect()
}

main().catch(console.error)
