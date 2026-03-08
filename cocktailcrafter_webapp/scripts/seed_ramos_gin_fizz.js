const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    console.log('🚀 Starting Ramos Gin Fizz seed script...')

    // --- 1. Check if exists ---
    const existing = await p.cocktail.findFirst({ where: { name: 'Ramos Gin Fizz' } })
    if (existing) {
        console.log('⚠️  Der Cocktail "Ramos Gin Fizz" existiert bereits. Script wird abgebrochen.')
        await p.$disconnect()
        return
    }

    // --- 2. Lookup existing Dependencies ---
    const gin = await p.bottle.findFirst({ where: { name: 'Gin' } })
    const lemon = await p.bottle.findFirst({ where: { name: 'Lemon Juice' } })
    const lime = await p.bottle.findFirst({ where: { name: 'Lime Juice' } })
    const syrup = await p.bottle.findFirst({ where: { name: 'Simple Syrup' } })
    const soda = await p.bottle.findFirst({ where: { name: 'Soda Water' } })

    const glass = await p.glassType.findFirst({ where: { name: 'Collins Glass' } })
    const ice = await p.iceType.findFirst({ where: { name: 'No Ice (straight up/neat)' } })
    const technique = await p.shakeTechnique.findFirst({ where: { name: 'Dry Shake' } })

    const tasteCreamy = await p.tasteProfile.findFirst({ where: { name: 'Creamy' } })
    const tasteRefreshing = await p.tasteProfile.findFirst({ where: { name: 'Refreshing' } })
    const tasteBalanced = await p.tasteProfile.findFirst({ where: { name: 'Balanced' } })

    // Validate Essentials
    const missing = []
    if (!gin) missing.push('Bottle: Gin')
    if (!lemon) missing.push('Bottle: Lemon Juice')
    if (!lime) missing.push('Bottle: Lime Juice')
    if (!syrup) missing.push('Bottle: Simple Syrup')
    if (!soda) missing.push('Bottle: Soda Water')
    if (!glass) missing.push('Glass: Collins Glass')
    if (!ice) missing.push('Ice: No Ice (straight up/neat)')
    if (!technique) missing.push('Technique: Dry Shake')
    if (!tasteCreamy) missing.push('Taste: Creamy')
    if (!tasteRefreshing) missing.push('Taste: Refreshing')
    if (!tasteBalanced) missing.push('Taste: Balanced')

    if (missing.length > 0) {
        console.error('❌ Missing catalog entries:', missing)
        process.exit(1)
    }

    const user = await p.user.findFirst()
    if (!user) {
        console.error('❌ No user found in database.')
        process.exit(1)
    }

    // --- 3. Build recipe JSON (Cream and Egg white in description/instruction only) ---
    const recipeJson = JSON.stringify([
        { bottleId: gin.id, name: 'Gin', amount: 2 },
        { bottleId: lemon.id, name: 'Lemon Juice', amount: 1 },
        { bottleId: lime.id, name: 'Lime Juice', amount: 0.5 },
        { bottleId: syrup.id, name: 'Simple Syrup', amount: 0.5 },
        { bottleId: soda.id, name: 'Soda Water', amount: 1.0 }, // Representing the "Top with"
    ])

    // --- 4. Create Cocktail ---
    const ramos = await p.cocktail.create({
        data: {
            name: 'Ramos Gin Fizz',
            description: 'A rich and creamy gin fizz with a luxurious foam head. Prepared with fresh cream and egg white for a unique texture.',
            history: 'Created in 1888 in New Orleans by Henry C. Ramos.',
            instruction: 'Dry shake all ingredients except soda (including 1 part cream and 0.5 part egg white).\nAdd ice and shake again until very cold.\nStrain into glass without ice.\nTop with soda water.\nServe immediately.',
            pictureUrl: '/images/cocktails/Ramos Gin Fizz.webp',
            volume: 5.0, // gin(2) + lemon(1) + lime(0.5) + syrup(0.5) + soda(~1)
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            tastes: { connect: [{ id: tasteCreamy.id }, { id: tasteRefreshing.id }, { id: tasteBalanced.id }] },
        }
    })

    console.log(`✅ Ramos Gin Fizz created! ID: ${ramos.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
