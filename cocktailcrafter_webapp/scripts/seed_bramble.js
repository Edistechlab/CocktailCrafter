const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    console.log('🚀 Starting Bramble seed script...')

    const existing = await p.cocktail.findFirst({ where: { name: 'Bramble' } })
    if (existing) { await p.$disconnect(); return }

    const gin = await p.bottle.findFirst({ where: { name: 'Gin' } })
    const lemon = await p.bottle.findFirst({ where: { name: 'Lemon Juice' } })
    const syrup = await p.bottle.findFirst({ where: { name: 'Simple Syrup' } })

    let cremeMure = await p.bottle.findFirst({ where: { name: 'Crème de Mûre' } })
    if (!cremeMure) {
        cremeMure = await p.bottle.create({ data: { name: 'Crème de Mûre', category: 'Liqueur', type: 'Fruit Liqueur', description: 'A sweet, dark purple liqueur made from blackberries.' } })
    }

    const glass = await p.glassType.findFirst({ where: { name: 'Rocks Glass / Old Fashioned' } })
    const ice = await p.iceType.findFirst({ where: { name: 'Crushed Ice / Pebble Ice' } })
    const techniqueShake = await p.shakeTechnique.findFirst({ where: { name: 'Standard Shake (Hard/Regular)' } })

    const tasteFruity = await p.tasteProfile.findFirst({ where: { name: 'Fruity' } })
    const tasteBalanced = await p.tasteProfile.findFirst({ where: { name: 'Balanced' } })

    const user = await p.user.findFirst()
    if (!user) { process.exit(1) }

    const recipe = JSON.stringify([
        { bottleId: gin.id, name: 'Gin', amount: 1.5 },
        { bottleId: lemon.id, name: 'Lemon Juice', amount: 0.75 },
        { bottleId: syrup.id, name: 'Simple Syrup', amount: 0.5 },
        { bottleId: cremeMure.id, name: 'Crème de Mûre', amount: 0.5 },
    ])

    const cocktail = await p.cocktail.create({
        data: {
            name: 'Bramble',
            description: 'A quintessential spring cocktail, the Bramble is a refreshing mix of gin and lemon, drizzled with sweet blackberry liqueur.',
            history: 'Created by Dick Bradsell in 1984 at Fred\'s Club in London.',
            instruction: 'Add gin, lemon juice, and simple syrup into a shaker with ice.\nShake well and strain into a rocks glass filled with crushed ice.\nDrizzle the Crème de Mûre over the top, allowing it to "bleed" through the ice.\nGarnish with a lemon slice and a fresh blackberry.\nServe immediately.',
            pictureUrl: '/images/cocktails/Bramble.webp',
            volume: 3.25,
            recipe: recipe,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: techniqueShake.id }] },
            tastes: { connect: [{ id: tasteFruity.id }, { id: tasteBalanced.id }] },
            automationLevel: 3
        }
    })

    console.log(`✅ Created ${cocktail.name}`)
    await p.$disconnect()
}

main().catch(console.error)
