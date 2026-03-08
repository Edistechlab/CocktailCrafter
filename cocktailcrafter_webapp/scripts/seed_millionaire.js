const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    console.log('🚀 Starting Millionaire seed script...')

    const existing = await p.cocktail.findFirst({ where: { name: 'Millionaire' } })
    if (existing) { await p.$disconnect(); return }

    const bourbon = await p.bottle.findFirst({ where: { name: 'Bourbon' } })
    const lemon = await p.bottle.findFirst({ where: { name: 'Lemon Juice' } })
    const grenadine = await p.bottle.findFirst({ where: { name: 'Grenadine' } })
    const absinthe = await p.bottle.findFirst({ where: { name: 'Absinthe' } }) || await p.bottle.findFirst({ where: { name: 'Verte' } })

    const glass = await p.glassType.findFirst({ where: { name: 'Coupe Glass / Coupette' } })
    const ice = await p.iceType.findFirst({ where: { name: 'No Ice (straight up/neat)' } })
    const techniqueShake = await p.shakeTechnique.findFirst({ where: { name: 'Standard Shake (Hard/Regular)' } })
    const techniqueDryShake = await p.shakeTechnique.findFirst({ where: { name: 'Dry Shake' } })

    const tasteRich = await p.tasteProfile.findFirst({ where: { name: 'Rich' } })
    const tasteBalanced = await p.tasteProfile.findFirst({ where: { name: 'Balanced' } })

    const user = await p.user.findFirst()
    if (!user) { process.exit(1) }

    const recipe = JSON.stringify([
        { bottleId: bourbon.id, name: 'Bourbon', amount: 1.5 },
        { bottleId: lemon.id, name: 'Lemon Juice', amount: 0.75 },
        { bottleId: grenadine.id, name: 'Grenadine', amount: 0.5 },
    ])

    const cocktail = await p.cocktail.create({
        data: {
            name: 'Millionaire',
            description: 'A pre-Prohibition cocktail that truly tastes like luxury. It is a complex blend of spice, anise, and tart fruit.',
            history: 'Variations exist from the early 1900s, with this whiskey-based version being a standout classic.',
            instruction: 'Add bourbon, lemon juice, grenadine, and 1-2 dashes of absinthe into a shaker with 0.5 parts egg white.\nDry-shake (without ice) thoroughly to create a rich foam.\nAdd ice and shake again until chilled.\nFine-strain into a chilled coupe glass.\nGarnish with a lemon twist.\nServe immediately.',
            pictureUrl: '/images/cocktails/Millionaire.webp',
            volume: 3.5,
            recipe: recipe,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: techniqueShake.id }, { id: techniqueDryShake.id }] },
            tastes: { connect: [{ id: tasteRich.id }, { id: tasteBalanced.id }] },
            automationLevel: 2
        }
    })

    console.log(`✅ Created ${cocktail.name}`)
    await p.$disconnect()
}

main().catch(console.error)
