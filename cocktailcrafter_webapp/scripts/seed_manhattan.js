const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    // --- Lookup IDs ---
    const rye = await p.bottle.findFirst({ where: { name: 'Rye Whiskey' } })
    const sweetVerm = await p.bottle.findFirst({ where: { name: 'Sweet Vermouth' } })
    const bitters = await p.bottle.findFirst({ where: { name: 'Angostura Bitters' } })

    const glass = await p.glassType.findFirst({ where: { name: 'Coupe Glass / Coupette' } })
    const ice = await p.iceType.findFirst({ where: { name: 'No Ice (straight up/neat)' } })
    const technique = await p.shakeTechnique.findFirst({ where: { name: 'Standard Stir' } })
    const garnish = await p.garnish.findFirst({ where: { name: 'Cocktail Cherries' } })

    const tasteBoozy = await p.tasteProfile.findFirst({ where: { name: 'Boozy' } })
    const tasteRich = await p.tasteProfile.findFirst({ where: { name: 'Rich' } })
    const tasteBalanced = await p.tasteProfile.findFirst({ where: { name: 'Balanced' } })

    // Validate
    const missing = []
    if (!rye) missing.push('Bottle: Rye Whiskey')
    if (!sweetVerm) missing.push('Bottle: Sweet Vermouth')
    if (!bitters) missing.push('Bottle: Angostura Bitters')
    if (!glass) missing.push('Glass: Coupe Glass / Coupette')
    if (!ice) missing.push('Ice: No Ice (straight up/neat)')
    if (!technique) missing.push('Technique: Standard Stir')
    if (!garnish) missing.push('Garnish: Cocktail Cherries')
    if (!tasteBoozy) missing.push('Taste: Boozy')
    if (!tasteRich) missing.push('Taste: Rich')
    if (!tasteBalanced) missing.push('Taste: Balanced')

    if (missing.length > 0) {
        console.error('❌ Missing catalog entries:', missing)
        process.exit(1)
    }

    const user = await p.user.findFirst()
    if (!user) { process.exit(1) }

    // Check if exists
    const existing = await p.cocktail.findFirst({ where: { name: 'Manhattan' } })
    if (existing) {
        console.log('⚠️  Manhattan already exists, skipping.')
        await p.$disconnect()
        return
    }

    // Build recipe JSON
    const recipeJson = JSON.stringify([
        { bottleId: rye.id, name: 'Rye Whiskey', amount: 2 },
        { bottleId: sweetVerm.id, name: 'Sweet Vermouth', amount: 1 },
        { bottleId: bitters.id, name: 'Angostura Bitters', amount: 2 }, // 2 dashes
    ])

    // --- Create Manhattan ---
    const manhattan = await p.cocktail.create({
        data: {
            name: 'Manhattan',
            description: 'A sophisticated whiskey cocktail combining richness, spice, and sweetness.',
            history: 'Believed to have been created in New York in the late 1800s at the Manhattan Club.',
            instruction: 'Stir all ingredients with ice until well chilled.\nStrain into a chilled coupe glass.\nGarnish with a cherry.\nServe immediately.\nEnjoy slowly.',
            pictureUrl: '/images/cocktails/Manhattan.webp',
            volume: 3,
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            garnishes: { connect: [{ id: garnish.id }] },
            tastes: { connect: [{ id: tasteBoozy.id }, { id: tasteRich.id }, { id: tasteBalanced.id }] },
        }
    })

    console.log(`✅ Manhattan created! ID: ${manhattan.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
