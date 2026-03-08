const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    console.log('🚀 Starting Last Word seed script...')

    const existing = await p.cocktail.findFirst({ where: { name: 'Last Word' } })
    if (existing) { await p.$disconnect(); return }

    const gin = await p.bottle.findFirst({ where: { name: 'Gin' } })
    const maraschino = await p.bottle.findFirst({ where: { name: 'Maraschino Liqueur' } })
    const lime = await p.bottle.findFirst({ where: { name: 'Lime Juice' } })

    let greenChartreuse = await p.bottle.findFirst({ where: { name: 'Green Chartreuse' } })
    if (!greenChartreuse) {
        greenChartreuse = await p.bottle.create({ data: { name: 'Green Chartreuse', category: 'Liqueur', type: 'Herbal Liqueur', description: 'A powerful and complex liqueur made by Carthusian Monks with 130 herbs and botanicals.', alcoholContent: 55 } })
    }

    const glass = await p.glassType.findFirst({ where: { name: 'Coupe Glass / Coupette' } })
    const ice = await p.iceType.findFirst({ where: { name: 'No Ice (straight up/neat)' } })
    const technique = await p.shakeTechnique.findFirst({ where: { name: 'Standard Shake (Hard/Regular)' } })

    const tasteHerbaceous = await p.tasteProfile.findFirst({ where: { name: 'Herbaceous' } })
    const tasteStrong = await p.tasteProfile.findFirst({ where: { name: 'Strong' } })

    const user = await p.user.findFirst()
    if (!user) { process.exit(1) }

    const recipe = JSON.stringify([
        { bottleId: gin.id, name: 'Gin', amount: 0.75 },
        { bottleId: greenChartreuse.id, name: 'Green Chartreuse', amount: 0.75 },
        { bottleId: maraschino.id, name: 'Maraschino Liqueur', amount: 0.75 },
        { bottleId: lime.id, name: 'Lime Juice', amount: 0.75 },
    ])

    const cocktail = await p.cocktail.create({
        data: {
            name: 'Last Word',
            description: 'A sharp, herbal, and perfectly balanced Prohibition-era cocktail that has seen a massive resurgence in the modern bar scene.',
            history: 'Originally developed at the Detroit Athletic Club in the early 1920s.',
            instruction: 'Add all ingredients into a shaker with ice.\nShake vigorously until well-chilled.\nFine-strain into a chilled coupe or Nick & Nora glass.\nGarnish with a brandied cherry.\nServe immediately.',
            pictureUrl: '/images/cocktails/Last_Word.webp',
            volume: 3,
            recipe: recipe,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            tastes: { connect: [{ id: tasteHerbaceous.id }, { id: tasteStrong.id }] },
            automationLevel: 3
        }
    })

    console.log(`✅ Created ${cocktail.name}`)
    await p.$disconnect()
}

main().catch(console.error)
