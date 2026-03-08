const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    console.log('🚀 Starting Aviation seed script...')

    // --- 1. Check if exists ---
    const existing = await p.cocktail.findFirst({ where: { name: 'Aviation' } })
    if (existing) {
        console.log('⚠️  Der Cocktail "Aviation" existiert bereits. Script wird abgebrochen.')
        await p.$disconnect()
        return
    }

    // --- 2. Lookup or Create Dependencies ---

    // Bottles
    const gin = await p.bottle.upsert({ where: { name: 'Gin' }, update: {}, create: { name: 'Gin', description: 'A distilled alcoholic drink that derives its predominant flavour from juniper berries.' } })
    const maraschino = await p.bottle.upsert({ where: { name: 'Maraschino Liqueur' }, update: {}, create: { name: 'Maraschino Liqueur', description: 'A liqueur made from Marasca cherries.' } })
    const lemon = await p.bottle.upsert({ where: { name: 'Lemon Juice' }, update: {}, create: { name: 'Lemon Juice', description: 'Freshly squeezed lemon juice.' } })
    const violette = await p.bottle.upsert({ where: { name: 'Crème de Violette' }, update: {}, create: { name: 'Crème de Violette', description: 'A floral liqueur flavored with violets.' } })

    // Catalog items
    const glass = await p.glassType.upsert({ where: { name: 'Coupe Glass / Coupette' }, update: {}, create: { name: 'Coupe Glass / Coupette' } })
    const ice = await p.iceType.upsert({ where: { name: 'No Ice (straight up/neat)' }, update: {}, create: { name: 'No Ice (straight up/neat)' } })
    const technique = await p.shakeTechnique.upsert({ where: { name: 'Standard Shake' }, update: {}, create: { name: 'Standard Shake' } })
    const garnish = await p.garnish.upsert({ where: { name: 'Cocktail Cherries' }, update: {}, create: { name: 'Cocktail Cherries' } })

    const tasteFloral = await p.tasteProfile.upsert({ where: { name: 'Floral / Aromatic' }, update: {}, create: { name: 'Floral / Aromatic' } })
    const tasteTart = await p.tasteProfile.upsert({ where: { name: 'Tart' }, update: {}, create: { name: 'Tart' } })
    const tasteBalanced = await p.tasteProfile.upsert({ where: { name: 'Balanced' }, update: {}, create: { name: 'Balanced' } })

    const user = await p.user.findFirst()
    if (!user) {
        console.error('❌ No user found in database.')
        process.exit(1)
    }

    // --- 3. Build recipe JSON ---
    const recipeJson = JSON.stringify([
        { bottleId: gin.id, name: 'Gin', amount: 2 },
        { bottleId: maraschino.id, name: 'Maraschino Liqueur', amount: 0.5 },
        { bottleId: lemon.id, name: 'Lemon Juice', amount: 0.5 },
        { bottleId: violette.id, name: 'Crème de Violette', amount: 0.25 },
    ])

    // --- 4. Create Cocktail ---
    const aviation = await p.cocktail.create({
        data: {
            name: 'Aviation',
            description: 'A floral and slightly tart gin cocktail with a subtle violet hue.',
            history: 'Created in the early 1900s in New York and revived during the craft cocktail movement.',
            instruction: 'Shake all ingredients with ice.\nStrain into a chilled coupe.\nGarnish with cherry.\nServe immediately.\nEnjoy chilled.',
            pictureUrl: '/images/cocktails/Aviation.webp',
            volume: 3.25,
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            garnishes: { connect: [{ id: garnish.id }] },
            tastes: { connect: [{ id: tasteFloral.id }, { id: tasteTart.id }, { id: tasteBalanced.id }] },
        }
    })

    console.log(`✅ Aviation created! ID: ${aviation.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
