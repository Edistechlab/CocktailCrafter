const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    console.log('🚀 Starting Singapore Sling seed script...')

    // --- 1. Check if exists ---
    const existing = await p.cocktail.findFirst({ where: { name: 'Singapore Sling' } })
    if (existing) {
        console.log('⚠️  Der Cocktail "Singapore Sling" existiert bereits. Script wird abgebrochen.')
        await p.$disconnect()
        return
    }

    // --- 2. Lookup or Create Dependencies ---

    // Bottles
    const gin = await p.bottle.upsert({ where: { name: 'Gin' }, update: {}, create: { name: 'Gin' } })
    const cherryLiqueur = await p.bottle.upsert({ where: { name: 'Cherry Liqueur' }, update: {}, create: { name: 'Cherry Liqueur', description: 'A sweet, fruit-based liqueur made from cherries.' } })
    const cointreau = await p.bottle.upsert({ where: { name: 'Cointreau' }, update: {}, create: { name: 'Cointreau' } })
    const benedictine = await p.bottle.upsert({ where: { name: 'Benedictine' }, update: {}, create: { name: 'Benedictine' } })
    const pineapple = await p.bottle.upsert({ where: { name: 'Pineapple Juice' }, update: {}, create: { name: 'Pineapple Juice' } })
    const lime = await p.bottle.upsert({ where: { name: 'Lime Juice' }, update: {}, create: { name: 'Lime Juice' } })
    const bitters = await p.bottle.upsert({ where: { name: 'Angostura Bitters' }, update: {}, create: { name: 'Angostura Bitters' } })

    // Catalog items
    const glass = await p.glassType.upsert({ where: { name: 'Poco Grande / Tulip Glass' }, update: {}, create: { name: 'Poco Grande / Tulip Glass' } })
    const ice = await p.iceType.upsert({ where: { name: 'Standard Cube' }, update: {}, create: { name: 'Standard Cube' } })
    const technique = await p.shakeTechnique.upsert({ where: { name: 'Standard Shake' }, update: {}, create: { name: 'Standard Shake' } })
    const garnish = await p.garnish.upsert({ where: { name: 'Tropical / Exotic Fruits' }, update: {}, create: { name: 'Tropical / Exotic Fruits' } })

    const tasteRefreshing = await p.tasteProfile.upsert({ where: { name: 'Refreshing' }, update: {}, create: { name: 'Refreshing' } })
    const tasteFruity = await p.tasteProfile.upsert({ where: { name: 'Fruity' }, update: {}, create: { name: 'Fruity' } })
    const tasteBalanced = await p.tasteProfile.upsert({ where: { name: 'Balanced' }, update: {}, create: { name: 'Balanced' } })

    const user = await p.user.findFirst()
    if (!user) {
        console.error('❌ No user found in database.')
        process.exit(1)
    }

    // --- 3. Build recipe JSON ---
    const recipeJson = JSON.stringify([
        { bottleId: gin.id, name: 'Gin', amount: 1.5 },
        { bottleId: cherryLiqueur.id, name: 'Cherry Liqueur', amount: 0.5 },
        { bottleId: cointreau.id, name: 'Cointreau', amount: 0.5 },
        { bottleId: benedictine.id, name: 'Benedictine', amount: 0.5 },
        { bottleId: pineapple.id, name: 'Pineapple Juice', amount: 1.0 },
        { bottleId: lime.id, name: 'Lime Juice', amount: 0.5 },
        { bottleId: bitters.id, name: 'Bitters', amount: 0.05 }, // Representing a dash
    ])

    // --- 4. Create Cocktail ---
    const singaporeSling = await p.cocktail.create({
        data: {
            name: 'Singapore Sling',
            description: 'A complex and fruity gin-based tropical cocktail with herbal undertones.',
            history: 'Created in the early 1900s at Raffles Hotel in Singapore.',
            instruction: 'Shake all ingredients with ice.\nStrain into glass over fresh ice.\nGarnish with pineapple and cherry.\nServe immediately.\nEnjoy tropical notes.',
            pictureUrl: '/images/cocktails/Singapore Sling.webp',
            volume: 4.55,
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            garnishes: { connect: [{ id: garnish.id }] },
            tastes: { connect: [{ id: tasteRefreshing.id }, { id: tasteFruity.id }, { id: tasteBalanced.id }] },
        }
    })

    console.log(`✅ Singapore Sling created! ID: ${singaporeSling.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
