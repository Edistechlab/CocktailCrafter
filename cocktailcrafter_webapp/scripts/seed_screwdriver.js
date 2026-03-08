const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    console.log('🚀 Starting Screwdriver seed script...')

    // --- 1. Check if exists ---
    const existing = await p.cocktail.findFirst({ where: { name: 'Screwdriver' } })
    if (existing) {
        console.log('⚠️  Der Cocktail "Screwdriver" existiert bereits. Script wird abgebrochen.')
        await p.$disconnect()
        return
    }

    // --- 2. Lookup or Create Dependencies ---

    // Bottles
    const vodka = await p.bottle.findFirst({ where: { name: 'Vodka' } })
    const orangeJuice = await p.bottle.findFirst({ where: { name: 'Orange Juice' } })

    // Catalog items
    const highball = await p.glassType.findFirst({ where: { name: 'Highball Glass' } })
    const ice = await p.iceType.findFirst({ where: { name: 'Standard Cube' } })
    const technique = await p.shakeTechnique.findFirst({ where: { name: 'Build / Build over Ice' } })
    const garnish = await p.garnish.findFirst({ where: { name: 'Citrus Wheels / Slices' } })

    const tasteRefreshing = await p.tasteProfile.findFirst({ where: { name: 'Refreshing' } })
    const tasteCitrus = await p.tasteProfile.findFirst({ where: { name: 'Citrus-forward' } })
    const tasteLight = await p.tasteProfile.findFirst({ where: { name: 'Light' } })

    // Validate Essentials
    const missing = []
    if (!vodka) missing.push('Bottle: Vodka')
    if (!orangeJuice) missing.push('Bottle: Orange Juice')
    if (!highball) missing.push('Glass: Highball Glass')
    if (!ice) missing.push('Ice: Standard Cube')
    if (!technique) missing.push('Technique: Build / Build over Ice')
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
    // 2 parts Vodka, 4 parts Orange Juice -> 1 part = 30ml (standard) -> 60ml / 120ml
    // We'll store it as parts as per request, relative to a scale
    const recipeJson = JSON.stringify([
        { bottleId: vodka.id, name: 'Vodka', amount: 2 },
        { bottleId: orangeJuice.id, name: 'Orange Juice', amount: 4 },
    ])

    // --- 4. Create Cocktail ---
    const screwdriver = await p.cocktail.create({
        data: {
            name: 'Screwdriver',
            description: 'A simple and refreshing classic vodka cocktail with bright, natural orange flavor.',
            history: 'Reportedly originated when American oil workers in the Persian Gulf mixed vodka with orange juice and stirred it using a screwdriver.',
            instruction: 'Fill a chilled highball glass with standard ice cubes.\nAdd the vodka over the ice.\nTop with fresh orange juice.\nStir gently with a bar spoon to combine.\nGarnish with an orange slice.\nServe immediately.',
            pictureUrl: '/images/cocktails/Screwdriver.webp',
            volume: 6,
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: highball.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            garnishes: { connect: garnish ? [{ id: garnish.id }] : [] },
            tastes: {
                connect: [
                    { id: tasteRefreshing.id },
                    ...(tasteCitrus ? [{ id: tasteCitrus.id }] : []),
                    ...(tasteLight ? [{ id: tasteLight.id }] : [])
                ]
            },
            automationLevel: 5
        }
    })

    console.log(`✅ Screwdriver created! ID: ${screwdriver.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
