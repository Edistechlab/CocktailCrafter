const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    console.log('🚀 Starting Kir Royale seed script...')

    // --- 1. Check if exists ---
    const existing = await p.cocktail.findFirst({ where: { name: 'Kir Royale' } })
    if (existing) {
        console.log('⚠️  Der Cocktail "Kir Royale" existiert bereits. Script wird abgebrochen.')
        await p.$disconnect()
        return
    }

    // --- 2. Lookup or Create Dependencies ---

    // Bottles
    const champagne = await p.bottle.upsert({
        where: { name: 'Champagne' },
        update: {},
        create: { name: 'Champagne', description: 'A sparkling wine produced from grapes grown in the Champagne region of France.' }
    })
    const cassis = await p.bottle.upsert({
        where: { name: 'Crème de Cassis' },
        update: {},
        create: { name: 'Crème de Cassis', description: 'A sweet, dark red liqueur made from blackcurrants.' }
    })

    // Catalog items
    const glass = await p.glassType.findFirst({ where: { name: 'Flute / Champagne Flute' } })
    const ice = await p.iceType.findFirst({ where: { name: 'No Ice (straight up/neat)' } })
    const technique = await p.shakeTechnique.findFirst({ where: { name: 'Built / Built over Ice' } })

    const tasteRefreshing = await p.tasteProfile.findFirst({ where: { name: 'Refreshing' } })
    const tasteLight = await p.tasteProfile.upsert({ where: { name: 'Light' }, update: {}, create: { name: 'Light', description: 'Light and easy-drinking flavor profiles.' } })
    const tasteFruity = await p.tasteProfile.findFirst({ where: { name: 'Fruity' } })

    // Validate Essentials
    const missing = []
    if (!glass) missing.push('Glass: Flute / Champagne Flute')
    if (!ice) missing.push('Ice: No Ice (straight up/neat)')
    if (!technique) missing.push('Technique: Built / Built over Ice')
    if (!tasteRefreshing) missing.push('Taste: Refreshing')
    if (!tasteFruity) missing.push('Taste: Fruity')

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
        { bottleId: champagne.id, name: 'Champagne', amount: 4 },
        { bottleId: cassis.id, name: 'Crème de Cassis', amount: 1 },
    ])

    // --- 4. Create Cocktail ---
    const kirRoyale = await p.cocktail.create({
        data: {
            name: 'Kir Royale',
            description: 'A sparkling and elegant cocktail with subtle berry sweetness.',
            history: 'A variation of the French Kir, upgraded with Champagne.',
            instruction: 'Pour Crème de Cassis into chilled flute.\nTop with chilled Champagne.\nStir gently.\nServe immediately.',
            pictureUrl: '/images/cocktails/Kir Royale.webp',
            volume: 5.0,
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            tastes: {
                connect: [
                    { id: tasteRefreshing.id },
                    { id: tasteLight.id },
                    { id: tasteFruity.id }
                ]
            },
        }
    })

    console.log(`✅ Kir Royale created! ID: ${kirRoyale.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
