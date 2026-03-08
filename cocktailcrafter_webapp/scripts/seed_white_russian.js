const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    console.log('🚀 Starting White Russian seed script...')

    // --- 1. Check if exists ---
    const existing = await p.cocktail.findFirst({ where: { name: 'White Russian' } })
    if (existing) {
        console.log('⚠️  Der Cocktail "White Russian" existiert bereits. Script wird abgebrochen.')
        await p.$disconnect()
        return
    }

    // --- 2. Lookup existing Dependencies ---
    const vodka = await p.bottle.findFirst({ where: { name: 'Vodka' } })
    const kahlua = await p.bottle.findFirst({ where: { name: 'Kahlua' } })

    const glass = await p.glassType.findFirst({ where: { name: 'Rocks Glass / Old Fashioned' } })
    const ice = await p.iceType.findFirst({ where: { name: 'Standard Cube' } })
    const technique = await p.shakeTechnique.findFirst({ where: { name: 'Built / Built over Ice' } })

    const tasteCreamy = await p.tasteProfile.upsert({ where: { name: 'Creamy' }, update: {}, create: { name: 'Creamy' } })
    const tasteSweet = await p.tasteProfile.upsert({ where: { name: 'Sweet' }, update: {}, create: { name: 'Sweet' } })
    const tasteSmooth = await p.tasteProfile.upsert({ where: { name: 'Softly sweet' }, update: {}, create: { name: 'Softly sweet' } })

    // Validate Essentials
    const missing = []
    if (!vodka) missing.push('Bottle: Vodka')
    if (!kahlua) missing.push('Bottle: Kahlua')
    if (!glass) missing.push('Glass: Rocks Glass / Old Fashioned')
    if (!ice) missing.push('Ice: Standard Cube')
    if (!technique) missing.push('Technique: Built / Built over Ice')

    if (missing.length > 0) {
        console.error('❌ Missing catalog entries:', missing)
        process.exit(1)
    }

    const user = await p.user.findFirst()
    if (!user) {
        console.error('❌ No user found in database.')
        process.exit(1)
    }

    // --- 3. Build recipe JSON (Cream in description/instruction only) ---
    const recipeJson = JSON.stringify([
        { bottleId: vodka.id, name: 'Vodka', amount: 2 },
        { bottleId: kahlua.id, name: 'Kahlua', amount: 1 },
    ])

    // --- 4. Create Cocktail ---
    const whiteRussian = await p.cocktail.create({
        data: {
            name: 'White Russian',
            description: 'A creamy coffee cocktail with smooth sweetness. Perfect as a dessert drink.',
            history: 'Popularized in the 1990s after appearing in The Big Lebowski.',
            instruction: 'Fill glass with ice.\nAdd vodka and Kahlua.\nTop with 1 part fresh cream.\nStir gently.\nServe immediately.',
            pictureUrl: '/images/cocktails/White Russian.webp',
            volume: 4.0, // vodka(2) + kahlua(1) + cream(1)
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            tastes: {
                connect: [
                    { id: tasteCreamy.id },
                    { id: tasteSweet.id },
                    { id: tasteSmooth.id }
                ]
            },
        }
    })

    console.log(`✅ White Russian created! ID: ${whiteRussian.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
