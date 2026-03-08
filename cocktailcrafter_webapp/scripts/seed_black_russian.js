const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    console.log('🚀 Starting Black Russian seed script...')

    // --- 1. Check if exists ---
    const existing = await p.cocktail.findFirst({ where: { name: 'Black Russian' } })
    if (existing) {
        console.log('⚠️  Der Cocktail "Black Russian" existiert bereits. Script wird abgebrochen.')
        await p.$disconnect()
        return
    }

    // --- 2. Lookup existing Dependencies ---
    const vodka = await p.bottle.findFirst({ where: { name: 'Vodka' } })
    const kahlua = await p.bottle.findFirst({ where: { name: 'Kahlua' } })

    const glass = await p.glassType.findFirst({ where: { name: 'Rocks Glass / Old Fashioned' } })
    const ice = await p.iceType.findFirst({ where: { name: 'Standard Cube' } })
    const technique = await p.shakeTechnique.findFirst({ where: { name: 'Built / Built over Ice' } })

    const tasteStrong = await p.tasteProfile.findFirst({ where: { name: 'Strong' } })
    const tasteSweet = await p.tasteProfile.findFirst({ where: { name: 'Subtly sweet' } })
    const tasteSmooth = await p.tasteProfile.findFirst({ where: { name: 'Softly sweet' } })

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

    // --- 3. Build recipe JSON ---
    const recipeJson = JSON.stringify([
        { bottleId: vodka.id, name: 'Vodka', amount: 2 },
        { bottleId: kahlua.id, name: 'Kahlua', amount: 1 },
    ])

    // --- 4. Create Cocktail ---
    const blackRussian = await p.cocktail.create({
        data: {
            name: 'Black Russian',
            description: 'A simple yet bold vodka and coffee liqueur cocktail.',
            history: 'Created in 1949 in Brussels for the U.S. ambassador.',
            instruction: 'Fill glass with ice.\nAdd vodka and Kahlua.\nStir briefly.\nServe immediately.\nEnjoy chilled.',
            pictureUrl: '/images/cocktails/Black Russian.webp',
            volume: 3.0,
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            tastes: {
                connect: [
                    { id: tasteStrong.id },
                    { id: tasteSweet.id },
                    { id: tasteSmooth.id }
                ]
            },
        }
    })

    console.log(`✅ Black Russian created! ID: ${blackRussian.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
