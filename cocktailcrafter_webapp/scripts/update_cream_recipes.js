const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    console.log('🚀 Updating Ramos Gin Fizz and Piña Colada with Cream/Coconut Cream...')

    // 1. Ensure Bottles exist
    const cream = await p.bottle.upsert({
        where: { name: 'Cream' },
        update: {},
        create: { name: 'Cream', description: 'Fresh dairy cream used for cocktails.' }
    })

    const coconutCream = await p.bottle.upsert({
        where: { name: 'Coconut Cream' },
        update: {},
        create: { name: 'Coconut Cream', description: 'Sweet, thick cream made from coconut milk.' }
    })

    // 2. Update Ramos Gin Fizz
    const ramos = await p.cocktail.findFirst({ where: { name: 'Ramos Gin Fizz' } })
    if (ramos) {
        // Parse current recipe to get existing bottle IDs
        const currentRecipe = JSON.parse(ramos.recipe || '[]')
        // Check if cream is already there (unlikely, but safe)
        if (!currentRecipe.find(r => r.name === 'Cream')) {
            currentRecipe.push({ bottleId: cream.id, name: 'Cream', amount: 1 })
        }

        await p.cocktail.update({
            where: { id: ramos.id },
            data: {
                recipe: JSON.stringify(currentRecipe),
                instruction: 'Dry shake all ingredients except soda (including 0.5 part egg white).\nAdd ice and shake again until very cold.\nStrain into glass without ice.\nTop with soda water.\nServe immediately.'
            }
        })
        console.log('✅ Ramos Gin Fizz updated with 1 part Cream and 0.5 part egg white instruction.')
    }

    // 3. Update Piña Colada
    const pina = await p.cocktail.findFirst({ where: { name: 'Piña Colada' } })
    if (pina) {
        const currentRecipe = JSON.parse(pina.recipe || '[]')
        if (!currentRecipe.find(r => r.name === 'Coconut Cream')) {
            currentRecipe.push({ bottleId: coconutCream.id, name: 'Coconut Cream', amount: 1 })
        }

        await p.cocktail.update({
            where: { id: pina.id },
            data: {
                recipe: JSON.stringify(currentRecipe),
                instruction: 'Shake or blend all ingredients with ice.\nPour into a chilled hurricane glass.\nGarnish with pineapple and cherry.\nServe immediately.\nEnjoy cold and creamy.'
            }
        })
        console.log('✅ Piña Colada updated with 1 part Coconut Cream as a bottle.')
    }

    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
