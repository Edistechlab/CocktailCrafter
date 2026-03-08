const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    console.log('🔧 Starting Cocktail Relation Fix...')

    const fixes = [
        {
            name: 'Naked and Famous',
            garnishes: ['Citrus Twists / Peels'],
            tastes: ['Balanced', 'Citrus-forward', 'Smoky']
        },
        {
            name: 'Penicillin',
            garnishes: ['Fresh Fruits / Berries'], // For candied ginger
            tastes: ['Smoky', 'Spicy']
        },
        {
            name: 'Bramble',
            garnishes: ['Lemon Peel', 'Fresh Fruits / Berries'],
            tastes: ['Fruity', 'Balanced']
        },
        {
            name: 'Last Word',
            garnishes: ['Cocktail Cherries'],
            tastes: ['Herbaceous', 'Strong']
        },
        {
            name: 'Tequila Sunrise',
            garnishes: ['Citrus Wheels / Slices', 'Cocktail Cherries'],
            tastes: ['Fruity', 'Sweet']
        },
        {
            name: 'Amaretto Sour',
            garnishes: ['Citrus Twists / Peels', 'Cocktail Cherries'],
            tastes: ['Sour', 'Sweet', 'Nutty']
        },
        {
            name: 'Millionaire',
            garnishes: ['Citrus Twists / Peels'],
            tastes: ['Rich', 'Balanced']
        }
    ]

    for (const fix of fixes) {
        const cocktail = await p.cocktail.findFirst({ where: { name: fix.name } })
        if (!cocktail) {
            console.log(`⚠️  Could not find cocktail: ${fix.name}`)
            continue
        }

        // Connect Garnishes
        const garnishIds = []
        for (const gName of fix.garnishes) {
            const g = await p.garnish.findFirst({ where: { name: gName } })
            if (g) garnishIds.push({ id: g.id })
            else console.log(`  ❌ Garnish not found: ${gName}`)
        }

        // Connect Tastes
        const tasteIds = []
        for (const tName of fix.tastes) {
            const t = await p.tasteProfile.findFirst({ where: { name: tName } })
            if (t) tasteIds.push({ id: t.id })
            else console.log(`  ❌ Taste not found: ${tName}`)
        }

        await p.cocktail.update({
            where: { id: cocktail.id },
            data: {
                garnishes: { connect: garnishIds },
                tastes: { connect: tasteIds }
            }
        })
        console.log(`✅ Fixed relations for ${fix.name}`)
    }

    console.log('\n✨ All cocktail relations fixed!')
    await p.$disconnect()
}

main().catch(console.error)
