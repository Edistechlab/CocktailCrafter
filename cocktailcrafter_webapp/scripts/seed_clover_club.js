const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    // --- Lookup IDs ---
    const gin = await p.bottle.findFirst({ where: { name: 'Gin' } })
    const lemon = await p.bottle.findFirst({ where: { name: 'Lemon Juice' } })

    // Check for Raspberry Syrup (add if not exists as requested previously or in seed)
    let raspberry = await p.bottle.findFirst({ where: { name: 'Raspberry Syrup' } })
    if (!raspberry) {
        raspberry = await p.bottle.create({ data: { name: 'Raspberry Syrup', description: 'Sweet and tart syrup made from fresh raspberries.' } })
        console.log('✨ Created new bottle ingredient: Raspberry Syrup')
    }

    const glass = await p.glassType.findFirst({ where: { name: 'Coupe Glass / Coupette' } })
    const ice = await p.iceType.findFirst({ where: { name: 'No Ice (straight up/neat)' } })
    const technique = await p.shakeTechnique.findFirst({ where: { name: 'Dry Shake' } })
    const garnish = await p.garnish.findFirst({ where: { name: 'Fresh Fruits / Berries' } })

    const tasteBalanced = await p.tasteProfile.findFirst({ where: { name: 'Balanced' } })
    const tasteTart = await p.tasteProfile.findFirst({ where: { name: 'Tart' } })
    const tasteFragrant = await p.tasteProfile.findFirst({ where: { name: 'Fragrant / Aromatic' } })

    // Validate Essentials
    const missing = []
    if (!gin) missing.push('Bottle: Gin')
    if (!lemon) missing.push('Bottle: Lemon Juice')
    if (!glass) missing.push('Glass: Coupe Glass / Coupette')
    if (!ice) missing.push('Ice: No Ice (straight up/neat)')
    if (!technique) missing.push('Technique: Dry Shake')
    if (!tasteBalanced) missing.push('Taste: Balanced')
    if (!tasteTart) missing.push('Taste: Tart')
    if (!tasteFragrant) missing.push('Taste: Fragrant / Aromatic')

    if (missing.length > 0) {
        console.error('❌ Missing catalog entries:', missing)
        process.exit(1)
    }

    const user = await p.user.findFirst()
    if (!user) {
        console.error('❌ No user found in database.')
        process.exit(1)
    }

    // Check if exists
    const existing = await p.cocktail.findFirst({ where: { name: 'Clover Club' } })
    if (existing) {
        console.log('⚠️  Clover Club already exists, skipping.')
        await p.$disconnect()
        return
    }

    // Build recipe JSON (Egg white in description/instruction as requested)
    const recipeJson = JSON.stringify([
        { bottleId: gin.id, name: 'Gin', amount: 2 },
        { bottleId: lemon.id, name: 'Lemon Juice', amount: 1 },
        { bottleId: raspberry.id, name: 'Raspberry Syrup', amount: 0.75 },
    ])

    // --- Create Clover Club ---
    const cloverClub = await p.cocktail.create({
        data: {
            name: 'Clover Club',
            description: 'A silky, elegant gin sour with raspberry sweetness and a creamy foam texture (traditionally using egg white).',
            history: 'Originated in Philadelphia in the late 1800s at the Bellevue-Stratford Hotel.',
            instruction: 'Dry shake all ingredients (including 0.5 part egg white) without ice.\nAdd ice and shake again until chilled.\nStrain into a chilled coupe glass.\nGarnish with raspberry.\nServe immediately.',
            pictureUrl: '/images/cocktails/Clover Club.webp',
            volume: 4.25,
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            garnishes: { connect: garnish ? [{ id: garnish.id }] : [] },
            tastes: { connect: [{ id: tasteBalanced.id }, { id: tasteTart.id }, { id: tasteFragrant.id }] },
        }
    })

    console.log(`✅ Clover Club created! ID: ${cloverClub.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
