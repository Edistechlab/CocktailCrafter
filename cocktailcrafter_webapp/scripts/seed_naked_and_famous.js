const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    console.log('🚀 Starting Naked and Famous seed script...')

    // --- 1. Check if exists ---
    const existing = await p.cocktail.findFirst({ where: { name: 'Naked and Famous' } })
    if (existing) {
        console.log('⚠️  Naked and Famous exists, skipping.')
        await p.$disconnect()
        return
    }

    // --- 2. Dependencies ---
    const mezcal = await p.bottle.findFirst({ where: { name: 'Mezcal' } })
    const aperol = await p.bottle.findFirst({ where: { name: 'Aperol' } })

    let yellowChartreuse = await p.bottle.findFirst({ where: { name: 'Yellow Chartreuse' } })
    if (!yellowChartreuse) {
        yellowChartreuse = await p.bottle.create({
            data: {
                name: 'Yellow Chartreuse',
                category: 'Liqueur',
                type: 'Herbal Liqueur',
                description: 'A milder and sweeter version of the famous French herbal liqueur.',
                alcoholContent: 40
            }
        })
    }

    const lime = await p.bottle.findFirst({ where: { name: 'Lime Juice' } })

    const glass = await p.glassType.findFirst({ where: { name: 'Coupe Glass / Coupette' } })
    const ice = await p.iceType.findFirst({ where: { name: 'No Ice (straight up/neat)' } })
    const technique = await p.shakeTechnique.findFirst({ where: { name: 'Standard Shake (Hard/Regular)' } })

    const tasteBalanced = await p.tasteProfile.findFirst({ where: { name: 'Balanced' } })
    const tasteCitrus = await p.tasteProfile.findFirst({ where: { name: 'Citrus-forward' } })
    const tasteSmoky = await p.tasteProfile.upsert({
        where: { name: 'Smoky' },
        update: {},
        create: { name: 'Smoky', description: 'Strong smoky or peaty flavor profiles.' }
    })

    const user = await p.user.findFirst()
    if (!user) { process.exit(1) }

    const recipe = JSON.stringify([
        { bottleId: mezcal.id, name: 'Mezcal', amount: 0.75 },
        { bottleId: yellowChartreuse.id, name: 'Yellow Chartreuse', amount: 0.75 },
        { bottleId: aperol.id, name: 'Aperol', amount: 0.75 },
        { bottleId: lime.id, name: 'Lime Juice', amount: 0.75 },
    ])

    const cocktail = await p.cocktail.create({
        data: {
            name: 'Naked and Famous',
            description: 'A modern classic with equal parts of mezcal, Aperol, lime, and yellow Chartreuse. It is a smoky, tart, and complex masterpiece.',
            history: 'Created in 2011 by Joaquín Simó at Death & Co in New York City.',
            instruction: 'Chill a coupe glass.\nCombine mezcal, yellow Chartreuse, Aperol, and fresh lime juice in a shaker with plenty of ice.\nShake vigorously until well-chilled.\nFine-strain into the chilled coupe glass.\nGarnish with a lime twist (optional).\nServe immediately.',
            pictureUrl: '/images/cocktails/Naked_and_Famous.webp',
            volume: 3,
            recipe: recipe,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            tastes: { connect: [{ id: tasteBalanced.id }, { id: tasteCitrus.id }, { id: tasteSmoky.id }] },
            automationLevel: 3
        }
    })

    console.log(`✅ Created ${cocktail.name}`)
    await p.$disconnect()
}

main().catch(console.error)
