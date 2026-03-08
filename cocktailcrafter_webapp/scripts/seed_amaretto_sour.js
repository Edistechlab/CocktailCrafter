const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    console.log('🚀 Starting Amaretto Sour seed script...')

    const existing = await p.cocktail.findFirst({ where: { name: 'Amaretto Sour' } })
    if (existing) { await p.$disconnect(); return }

    const amaretto = await p.bottle.findFirst({ where: { name: 'Amaretto' } })
    const bourbon = await p.bottle.findFirst({ where: { name: 'Bourbon' } })
    const lemon = await p.bottle.findFirst({ where: { name: 'Lemon Juice' } })
    const syrup = await p.bottle.findFirst({ where: { name: 'Simple Syrup' } })

    const glass = await p.glassType.findFirst({ where: { name: 'Rocks Glass / Old Fashioned' } })
    const ice = await p.iceType.findFirst({ where: { name: 'Large Cube / King Cube' } })
    const techniqueShake = await p.shakeTechnique.findFirst({ where: { name: 'Standard Shake (Hard/Regular)' } })
    const techniqueDryShake = await p.shakeTechnique.findFirst({ where: { name: 'Dry Shake' } })

    const tasteSour = await p.tasteProfile.findFirst({ where: { name: 'Sour' } })
    const tasteSweet = await p.tasteProfile.findFirst({ where: { name: 'Sweet' } })
    const tasteNutty = await p.tasteProfile.findFirst({ where: { name: 'Nutty' } })

    const user = await p.user.findFirst()
    if (!user) { process.exit(1) }

    const recipe = JSON.stringify([
        { bottleId: amaretto.id, name: 'Amaretto', amount: 1.5 },
        { bottleId: bourbon.id, name: 'Bourbon (Cask Strength preferred)', amount: 0.75 },
        { bottleId: lemon.id, name: 'Lemon Juice', amount: 1 },
        { bottleId: syrup.id, name: 'Simple Syrup', amount: 0.25 },
    ])

    const cocktail = await p.cocktail.create({
        data: {
            name: 'Amaretto Sour',
            description: 'A rich and frothy classic that balances the sweet almond notes of amaretto with the bite of bourbon and fresh lemon.',
            history: 'While a 70s disco-era staple, the modern "Morgenthaler" version with added bourbon transformed it into a respected classic.',
            instruction: 'Combine amaretto, bourbon, lemon juice, simple syrup, and 0.5 parts egg white in a shaker.\nDry-shake (without ice) to emulsify the egg white.\nAdd ice and shake again until very cold.\nFine-strain into a rocks glass over a large ice cube.\nGarnish with a lemon twist and a brandied cherry.\nServe immediately.',
            pictureUrl: '/images/cocktails/Amaretto_Sour.webp',
            volume: 4,
            recipe: recipe,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: techniqueShake.id }, { id: techniqueDryShake.id }] },
            tastes: { connect: [{ id: tasteSour.id }, { id: tasteSweet.id }, { id: tasteNutty.id }] },
            automationLevel: 2
        }
    })

    console.log(`✅ Created ${cocktail.name}`)
    await p.$disconnect()
}

main().catch(console.error)
