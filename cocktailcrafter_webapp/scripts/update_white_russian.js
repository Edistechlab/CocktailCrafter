const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    console.log('🚀 Updating White Russian with Cream as a Bottle...')

    // 1. Initial Checks
    const vodka = await p.bottle.findFirst({ where: { name: 'Vodka' } })
    const kahlua = await p.bottle.findFirst({ where: { name: 'Kahlua' } })

    // Create/Look up Cream as a Bottle
    const cream = await p.bottle.upsert({
        where: { name: 'Cream' },
        update: {},
        create: { name: 'Cream', description: 'Fresh dairy cream used for cocktails.' }
    })

    const user = await p.user.findFirst()
    const existingCocktail = await p.cocktail.findFirst({ where: { name: 'White Russian' } })

    if (!user) {
        console.error('❌ No user found.')
        process.exit(1)
    }

    // 2. Build updated Recipe JSON
    const recipeJson = JSON.stringify([
        { bottleId: vodka.id, name: 'Vodka', amount: 2 },
        { bottleId: kahlua.id, name: 'Kahlua', amount: 1 },
        { bottleId: cream.id, name: 'Cream', amount: 1 },
    ])

    // 3. Update or Create
    if (existingCocktail) {
        await p.cocktail.update({
            where: { id: existingCocktail.id },
            data: {
                recipe: recipeJson,
                description: 'A creamy coffee cocktail with smooth sweetness. Perfect as a dessert drink.',
                instruction: 'Fill glass with ice.\nAdd vodka and Kahlua.\nTop with 1 part cream.\nStir gently.\nServe immediately.',
            }
        })
        console.log(`✅ White Russian updated! ID: ${existingCocktail.id}`)
    } else {
        const whiteRussian = await p.cocktail.create({
            data: {
                name: 'White Russian',
                description: 'A creamy coffee cocktail with smooth sweetness. Perfect as a dessert drink.',
                history: 'Popularized in the 1990s after appearing in The Big Lebowski.',
                instruction: 'Fill glass with ice.\nAdd vodka and Kahlua.\nTop with 1 part cream.\nStir gently.\nServe immediately.',
                pictureUrl: '/images/cocktails/White Russian.webp',
                volume: 4.0,
                recipe: recipeJson,
                userId: user.id
            }
        })
        console.log(`✅ White Russian created! ID: ${whiteRussian.id}`)
    }

    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
