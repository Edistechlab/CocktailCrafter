const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    console.log('🚀 Starting Hurricane seed script...')

    // --- 1. Check if exists ---
    const existing = await p.cocktail.findFirst({ where: { name: 'Hurricane' } })
    if (existing) {
        console.log('⚠️  Der Cocktail "Hurricane" existiert bereits. Script wird abgebrochen.')
        await p.$disconnect()
        return
    }

    // --- 2. Lookup or Create Dependencies ---

    // Bottles
    const whiteRum = await p.bottle.findFirst({ where: { name: 'White Rum' } })
    const darkRum = await p.bottle.findFirst({ where: { name: 'Dark Rum' } })
    const orangeJuice = await p.bottle.findFirst({ where: { name: 'Orange Juice' } })
    const lime = await p.bottle.findFirst({ where: { name: 'Lime Juice' } })
    const syrup = await p.bottle.findFirst({ where: { name: 'Simple Syrup' } })

    // New Passion Fruit Syrup
    const passionSyrup = await p.bottle.upsert({
        where: { name: 'Passion Fruit Syrup' },
        update: {},
        create: { name: 'Passion Fruit Syrup', description: 'A sweet and tropical syrup made from passion fruit.' }
    })

    // Catalog items
    const glass = await p.glassType.findFirst({ where: { name: 'Hurricane Glass' } })
    const ice = await p.iceType.findFirst({ where: { name: 'Standard Cube' } })
    const technique = await p.shakeTechnique.findFirst({ where: { name: 'Standard Shake' } })

    const tasteFruity = await p.tasteProfile.findFirst({ where: { name: 'Fruity' } })
    const tasteSweet = await p.tasteProfile.findFirst({ where: { name: 'Sweet' } })
    const tasteRefreshing = await p.tasteProfile.findFirst({ where: { name: 'Refreshing' } })

    // Validate Essentials
    const missing = []
    if (!whiteRum) missing.push('Bottle: White Rum')
    if (!darkRum) missing.push('Bottle: Dark Rum')
    if (!orangeJuice) missing.push('Bottle: Orange Juice')
    if (!lime) missing.push('Bottle: Lime Juice')
    if (!syrup) missing.push('Bottle: Simple Syrup')
    if (!glass) missing.push('Glass: Hurricane Glass')
    if (!ice) missing.push('Ice: Standard Cube')
    if (!technique) missing.push('Technique: Standard Shake')
    if (!tasteFruity) missing.push('Taste: Fruity')
    if (!tasteSweet) missing.push('Taste: Sweet')
    if (!tasteRefreshing) missing.push('Taste: Refreshing')

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
        { bottleId: whiteRum.id, name: 'White Rum', amount: 2 },
        { bottleId: darkRum.id, name: 'Dark Rum', amount: 1 },
        { bottleId: passionSyrup.id, name: 'Passion Fruit Syrup', amount: 1 },
        { bottleId: orangeJuice.id, name: 'Orange Juice', amount: 1 },
        { bottleId: lime.id, name: 'Lime Juice', amount: 0.5 },
        { bottleId: syrup.id, name: 'Simple Syrup', amount: 0.5 },
    ])

    // --- 4. Create Cocktail ---
    const hurricane = await p.cocktail.create({
        data: {
            name: 'Hurricane',
            description: 'A vibrant New Orleans rum cocktail with bold fruit flavors.',
            history: 'Created in the 1940s at Pat O\'Brien’s in New Orleans.',
            instruction: 'Shake all ingredients with ice.\nStrain into glass over fresh ice.\nGarnish with orange slice and cherry.\nServe chilled.\nEnjoy tropical style.',
            pictureUrl: '/images/cocktails/Hurricane.webp',
            volume: 6.0,
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            tastes: {
                connect: [
                    { id: tasteFruity.id },
                    { id: tasteSweet.id },
                    { id: tasteRefreshing.id }
                ]
            },
        }
    })

    console.log(`✅ Hurricane created! ID: ${hurricane.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
