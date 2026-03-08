const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    console.log('🚀 Starting Tequila Sunrise seed script...')

    const existing = await p.cocktail.findFirst({ where: { name: 'Tequila Sunrise' } })
    if (existing) { await p.$disconnect(); return }

    const tequila = await p.bottle.findFirst({ where: { name: 'Blanco' } }) || await p.bottle.findFirst({ where: { category: 'Tequila' } })
    const orangeJuice = await p.bottle.findFirst({ where: { name: 'Orange Juice' } })
    const grenadine = await p.bottle.findFirst({ where: { name: 'Grenadine' } })

    const glass = await p.glassType.findFirst({ where: { name: 'Highball Glass' } })
    const ice = await p.iceType.findFirst({ where: { name: 'Standard Cube' } })
    const technique = await p.shakeTechnique.findFirst({ where: { name: 'Build / Build over Ice' } })

    const tasteFruity = await p.tasteProfile.findFirst({ where: { name: 'Fruity' } })
    const tasteSweet = await p.tasteProfile.findFirst({ where: { name: 'Sweet' } })

    const user = await p.user.findFirst()
    if (!user) { process.exit(1) }

    const recipe = JSON.stringify([
        { bottleId: tequila.id, name: 'Tequila', amount: 1.5 },
        { bottleId: orangeJuice.id, name: 'Orange Juice', amount: 3 },
        { bottleId: grenadine.id, name: 'Grenadine', amount: 0.5 },
    ])

    const cocktail = await p.cocktail.create({
        data: {
            name: 'Tequila Sunrise',
            description: 'Famous for its beautiful layered appearance, this cocktail offers a sweet and fruity flavor profile that is as vibrant as its look.',
            history: 'While earlier versions existed, the modern version was created by Bobby Lozoff and Billy Rice in Sausalito in the early 1970s.',
            instruction: 'Pour the tequila and orange juice into a highball glass filled with ice.\nSlowly pour the grenadine syrup over the back of a bar spoon or down the side of the glass.\nDo not stir, allowing the syrup to settle at the bottom to create the "sunrise" effect.\nGarnish with an orange slice and a cherry.\nServe immediately.',
            pictureUrl: '/images/cocktails/Tequila_Sunrise.webp',
            volume: 5,
            recipe: recipe,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            tastes: { connect: [{ id: tasteFruity.id }, { id: tasteSweet.id }] },
            automationLevel: 5
        }
    })

    console.log(`✅ Created ${cocktail.name}`)
    await p.$disconnect()
}

main().catch(console.error)
