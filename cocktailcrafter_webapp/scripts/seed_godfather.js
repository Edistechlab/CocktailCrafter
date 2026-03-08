const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    console.log('🚀 Starting Godfather seed script...')

    // --- 1. Check if exists ---
    const existing = await p.cocktail.findFirst({ where: { name: 'Godfather' } })
    if (existing) {
        console.log('⚠️  Der Cocktail "Godfather" existiert bereits. Script wird abgebrochen.')
        await p.$disconnect()
        return
    }

    // --- 2. Lookup existing Dependencies ---
    const whisky = await p.bottle.findFirst({ where: { name: 'Scotch Whisky' } })
    const amaretto = await p.bottle.findFirst({ where: { name: 'Amaretto' } })

    const glass = await p.glassType.findFirst({ where: { name: 'Rocks Glass / Old Fashioned' } })
    const ice = await p.iceType.findFirst({ where: { name: 'Standard Cube' } })
    const technique = await p.shakeTechnique.findFirst({ where: { name: 'Built / Built over Ice' } })

    const tasteNutty = await p.tasteProfile.upsert({ where: { name: 'Nutty' }, update: {}, create: { name: 'Nutty' } })
    const tasteSmooth = await p.tasteProfile.findFirst({ where: { name: 'Softly sweet' } })
    const tasteSweet = await p.tasteProfile.findFirst({ where: { name: 'Subtly sweet' } })

    // Validate Essentials
    const missing = []
    if (!whisky) missing.push('Bottle: Scotch Whisky')
    if (!amaretto) missing.push('Bottle: Amaretto')
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
        { bottleId: whisky.id, name: 'Scotch Whisky', amount: 2 },
        { bottleId: amaretto.id, name: 'Amaretto', amount: 1 },
    ])

    // --- 4. Create Cocktail ---
    const godfather = await p.cocktail.create({
        data: {
            name: 'Godfather',
            description: 'A smooth and simple blend of whiskey and almond liqueur.',
            history: 'Became popular in the 1970s and is associated with classic cinema culture.',
            instruction: 'Fill glass with ice.\nAdd whisky and amaretto.\nStir briefly.\nServe immediately.\nEnjoy neat character.',
            pictureUrl: '/images/cocktails/Godfather.webp',
            volume: 3.0,
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            tastes: {
                connect: [
                    { id: tasteNutty.id },
                    ...(tasteSmooth ? [{ id: tasteSmooth.id }] : []),
                    ...(tasteSweet ? [{ id: tasteSweet.id }] : [])
                ]
            },
        }
    })

    console.log(`✅ Godfather created! ID: ${godfather.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
