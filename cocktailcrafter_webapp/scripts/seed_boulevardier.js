const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    // --- Lookup IDs ---
    const bourbon = await p.bottle.findFirst({ where: { name: 'Bourbon Whiskey' } })
    const campari = await p.bottle.findFirst({ where: { name: 'Campari' } })
    const sweetVerm = await p.bottle.findFirst({ where: { name: 'Sweet Vermouth' } })

    const glass = await p.glassType.findFirst({ where: { name: 'Rocks Glass / Old Fashioned' } })
    const ice = await p.iceType.findFirst({ where: { name: 'Large Cube / King Cube' } })
    const technique = await p.shakeTechnique.findFirst({ where: { name: 'Standard Stir' } })
    const garnish = await p.garnish.findFirst({ where: { name: 'Citrus Twists / Peels' } })

    const tasteBitter = await p.tasteProfile.findFirst({ where: { name: 'Bitter' } })
    const tasteRich = await p.tasteProfile.findFirst({ where: { name: 'Rich' } })
    const tasteBoozy = await p.tasteProfile.findFirst({ where: { name: 'Boozy' } })

    // Validate Essentials
    const missing = []
    if (!bourbon) missing.push('Bottle: Bourbon Whiskey')
    if (!campari) missing.push('Bottle: Campari')
    if (!sweetVerm) missing.push('Bottle: Sweet Vermouth')
    if (!glass) missing.push('Glass: Rocks Glass / Old Fashioned')
    if (!ice) missing.push('Ice: Large Cube / King Cube')
    if (!technique) missing.push('Technique: Standard Stir')
    if (!tasteBitter) missing.push('Taste: Bitter')
    if (!tasteRich) missing.push('Taste: Rich')
    if (!tasteBoozy) missing.push('Taste: Boozy')

    if (missing.length > 0) {
        console.error('❌ Missing catalog entries:', missing)
        process.exit(1)
    }

    const user = await p.user.findFirst()
    if (!user) { process.exit(1) }

    // Check if exists
    const existing = await p.cocktail.findFirst({ where: { name: 'Boulevardier' } })
    if (existing) {
        console.log('⚠️  Boulevardier already exists, skipping.')
        await p.$disconnect()
        return
    }

    // Build recipe JSON
    const recipeJson = JSON.stringify([
        { bottleId: bourbon.id, name: 'Bourbon Whiskey', amount: 1 },
        { bottleId: campari.id, name: 'Campari', amount: 1 },
        { bottleId: sweetVerm.id, name: 'Sweet Vermouth', amount: 1 },
    ])

    // --- Create Boulevardier ---
    const boulevardier = await p.cocktail.create({
        data: {
            name: 'Boulevardier',
            description: 'A whiskey-based twist on the Negroni with deeper, richer flavors.',
            history: 'Created in the 1920s by American writer Erskine Gwynne in Paris.',
            instruction: 'Stir all ingredients (Bourbon, Campari, Sweet Vermouth) with ice until chilled.\nStrain over a large cube.\nExpress orange peel oils.\nGarnish and serve.\nEnjoy slowly.',
            pictureUrl: '/images/cocktails/Boulevardier.webp',
            volume: 3,
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            garnishes: { connect: garnish ? [{ id: garnish.id }] : [] },
            tastes: { connect: [{ id: tasteBitter.id }, { id: tasteRich.id }, { id: tasteBoozy.id }] },
        }
    })

    console.log(`✅ Boulevardier created! ID: ${boulevardier.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
