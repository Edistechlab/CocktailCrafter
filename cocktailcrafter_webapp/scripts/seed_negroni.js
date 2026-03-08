const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    // --- Lookup IDs ---
    const gin = await p.bottle.findFirst({ where: { name: 'Gin' } })
    const campari = await p.bottle.findFirst({ where: { name: 'Campari' } })
    const sweetVerm = await p.bottle.findFirst({ where: { name: 'Sweet Vermouth' } })

    const rocksGlass = await p.glassType.findFirst({ where: { name: 'Rocks Glass / Old Fashioned' } })
    const largeIce = await p.iceType.findFirst({ where: { name: 'Large Cube / King Cube' } })
    const stir = await p.shakeTechnique.findFirst({ where: { name: 'Standard Stir' } })
    const citrusTwist = await p.garnish.findFirst({ where: { name: 'Citrus Twists / Peels' } })

    const tasteBitter = await p.tasteProfile.findFirst({ where: { name: 'Bitter' } })
    const tasteBalanced = await p.tasteProfile.findFirst({ where: { name: 'Balanced' } })
    const tasteBoozy = await p.tasteProfile.findFirst({ where: { name: 'Boozy' } })

    // Validate
    const missing = []
    if (!gin) missing.push('Bottle: Gin')
    if (!campari) missing.push('Bottle: Campari')
    if (!sweetVerm) missing.push('Bottle: Sweet Vermouth')
    if (!rocksGlass) missing.push('Glass: Rocks Glass / Old Fashioned')
    if (!largeIce) missing.push('Ice: Large Cube / King Cube')
    if (!stir) missing.push('Technique: Standard Stir')
    if (!citrusTwist) missing.push('Garnish: Citrus Twists / Peels')
    if (!tasteBitter) missing.push('Taste: Bitter')
    if (!tasteBalanced) missing.push('Taste: Balanced')
    if (!tasteBoozy) missing.push('Taste: Boozy')

    if (missing.length > 0) {
        console.error('❌ Missing catalog entries:', missing)
        process.exit(1)
    }

    // --- Find user ---
    const user = await p.user.findFirst()
    if (!user) {
        console.error('❌ No user found in database.')
        process.exit(1)
    }
    console.log(`✅ Using user: ${user.email || user.firstName}`)

    // --- Check if already exists ---
    const existing = await p.cocktail.findFirst({ where: { name: 'Negroni' } })
    if (existing) {
        console.log('⚠️  Negroni already exists, skipping.')
        await p.$disconnect()
        return
    }

    // Build recipe JSON (same format as CocktailForm sends)
    const recipeJson = JSON.stringify([
        { bottleId: gin.id, name: 'Gin', amount: 1 },
        { bottleId: campari.id, name: 'Campari', amount: 1 },
        { bottleId: sweetVerm.id, name: 'Sweet Vermouth', amount: 1 },
    ])

    // --- Create Negroni ---
    const negroni = await p.cocktail.create({
        data: {
            name: 'Negroni',
            description: 'A classic Italian aperitif cocktail known for its perfect balance of bitter, sweet, and herbal notes.',
            history: 'Created in Florence around 1919 when Count Camillo Negroni requested a stronger Americano with gin instead of soda.',
            instruction: '1. Add all ingredients into a mixing glass with ice.\n2. Stir gently for 25–30 seconds.\n3. Strain over a large cube in a rocks glass.\n4. Express orange peel oils over the drink.\n5. Drop peel into the glass and serve.',
            pictureUrl: '/images/cocktails/Negroni.webp',
            volume: 3,
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: rocksGlass.id }] },
            ices: { connect: [{ id: largeIce.id }] },
            techniques: { connect: [{ id: stir.id }] },
            garnishes: { connect: [{ id: citrusTwist.id }] },
            tastes: { connect: [{ id: tasteBitter.id }, { id: tasteBalanced.id }, { id: tasteBoozy.id }] },
        }
    })

    console.log(`✅ Negroni created! ID: ${negroni.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
