const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    // --- Lookup IDs ---
    const aperol = await p.bottle.findFirst({ where: { name: 'Aperol' } })
    const prosecco = await p.bottle.findFirst({ where: { name: 'Prosecco' } })
    const soda = await p.bottle.findFirst({ where: { name: 'Soda Water' } })

    const glass = await p.glassType.findFirst({ where: { name: 'Highball Glass' } })
    const ice = await p.iceType.findFirst({ where: { name: 'Standard Cube' } })
    const technique = await p.shakeTechnique.findFirst({ where: { name: 'Built / Built over Ice' } })
    const garnish = await p.garnish.findFirst({ where: { name: 'Citrus Wheels / Slices' } })

    const tasteRefresh = await p.tasteProfile.findFirst({ where: { name: 'Refreshing' } })
    const tasteBitter = await p.tasteProfile.findFirst({ where: { name: 'Bitter' } })
    const tasteSweet = await p.tasteProfile.findFirst({ where: { name: 'Subtly sweet' } })

    // Validate Essentials
    const missing = []
    if (!aperol) missing.push('Bottle: Aperol')
    if (!prosecco) missing.push('Bottle: Prosecco')
    if (!soda) missing.push('Bottle: Soda Water')
    if (!glass) missing.push('Glass: Highball Glass')
    if (!ice) missing.push('Ice: Standard Cube')
    if (!technique) missing.push('Technique: Built / Built over Ice')
    if (!tasteRefresh) missing.push('Taste: Refreshing')
    if (!tasteBitter) missing.push('Taste: Bitter')
    if (!tasteSweet) missing.push('Taste: Subtly sweet')

    if (missing.length > 0) {
        console.error('❌ Missing catalog entries:', missing)
        process.exit(1)
    }

    const user = await p.user.findFirst()
    if (!user) { process.exit(1) }

    // Check if exists
    const existing = await p.cocktail.findFirst({ where: { name: 'Aperol Spritz' } })
    if (existing) {
        console.log('⚠️  Aperol Spritz already exists, skipping.')
        await p.$disconnect()
        return
    }

    // Build recipe JSON
    const recipeJson = JSON.stringify([
        { bottleId: aperol.id, name: 'Aperol', amount: 2 },
        { bottleId: prosecco.id, name: 'Prosecco', amount: 3 },
        { bottleId: soda.id, name: 'Soda Water', amount: 1 },
    ])

    // --- Create Aperol Spritz ---
    const aperolSpritz = await p.cocktail.create({
        data: {
            name: 'Aperol Spritz',
            description: 'A light and refreshing Italian aperitif with gentle bitterness and citrus notes.',
            history: 'Originated in Northern Italy and became globally popular as a pre-dinner drink.',
            instruction: 'Fill glass with ice.\nAdd Aperol and prosecco.\nTop with soda water.\nStir gently.\nGarnish with an orange wheel and serve.',
            pictureUrl: '/images/cocktails/Aperol Spritz.webp',
            volume: 6,
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            garnishes: { connect: garnish ? [{ id: garnish.id }] : [] },
            tastes: { connect: [{ id: tasteRefresh.id }, { id: tasteBitter.id }, { id: tasteSweet.id }] },
        }
    })

    console.log(`✅ Aperol Spritz created! ID: ${aperolSpritz.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
