const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    console.log('🚀 Starting Rusty Nail seed script...')

    // --- 1. Check if exists ---
    const existing = await p.cocktail.findFirst({ where: { name: 'Rusty Nail' } })
    if (existing) {
        console.log('⚠️  Der Cocktail "Rusty Nail" existiert bereits. Script wird abgebrochen.')
        await p.$disconnect()
        return
    }

    // --- 2. Lookup or Create Dependencies ---

    // Bottles
    const whisky = await p.bottle.upsert({ where: { name: 'Scotch Whisky' }, update: {}, create: { name: 'Scotch Whisky' } })
    const drambuie = await p.bottle.upsert({
        where: { name: 'Drambuie' },
        update: {},
        create: { name: 'Drambuie', description: 'A brand of Scotch whisky liqueur flavored with honey, herbs, and spices.' }
    })

    // Catalog items
    const glass = await p.glassType.findFirst({ where: { name: 'Rocks Glass / Old Fashioned' } })
    const ice = await p.iceType.findFirst({ where: { name: 'Standard Cube' } })
    const technique = await p.shakeTechnique.findFirst({ where: { name: 'Built / Built over Ice' } })
    const garnish = await p.garnish.upsert({ where: { name: 'Lemon Peel' }, update: {}, create: { name: 'Lemon Peel' } })

    const tasteStrong = await p.tasteProfile.findFirst({ where: { name: 'Strong' } })
    const tasteHerbal = await p.tasteProfile.findFirst({ where: { name: 'Herbaceous' } })
    const tasteSmooth = await p.tasteProfile.findFirst({ where: { name: 'Softly sweet' } })

    // Validate Essentials
    const missing = []
    if (!whisky) missing.push('Bottle: Scotch Whisky')
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
        { bottleId: drambuie.id, name: 'Drambuie', amount: 1 },
    ])

    // --- 4. Create Cocktail ---
    const rustyNail = await p.cocktail.create({
        data: {
            name: 'Rusty Nail',
            description: 'A warming Scotch cocktail with herbal honey sweetness.',
            history: 'Gained popularity in the 1950s and 60s among the Rat Pack era crowd.',
            instruction: 'Fill glass with ice.\nAdd Scotch and Drambuie.\nStir gently.\nExpress lemon peel if desired.\nServe immediately.',
            pictureUrl: '/images/cocktails/Rusty Nail.webp',
            volume: 3.0,
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            garnishes: { connect: [{ id: garnish.id }] },
            tastes: {
                connect: [
                    ...(tasteStrong ? [{ id: tasteStrong.id }] : []),
                    ...(tasteHerbal ? [{ id: tasteHerbal.id }] : []),
                    ...(tasteSmooth ? [{ id: tasteSmooth.id }] : [])
                ]
            },
        }
    })

    console.log(`✅ Rusty Nail created! ID: ${rustyNail.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
