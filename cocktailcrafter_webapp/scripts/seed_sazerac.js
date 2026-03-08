const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    console.log('🚀 Starting Sazerac seed script...')

    // --- 1. Check if exists ---
    const existing = await p.cocktail.findFirst({ where: { name: 'Sazerac' } })
    if (existing) {
        console.log('⚠️  Der Cocktail "Sazerac" existiert bereits. Script wird abgebrochen.')
        await p.$disconnect()
        return
    }

    // --- 2. Lookup or Create Dependencies ---

    // Bottles
    const rye = await p.bottle.findFirst({ where: { name: 'Rye Whiskey' } })
    const syrup = await p.bottle.findFirst({ where: { name: 'Simple Syrup' } })
    const bitters = await p.bottle.findFirst({ where: { name: 'Angostura Bitters' } })

    // Create Absinthe as requested (but it won't be in the recipe array)
    const absinthe = await p.bottle.upsert({
        where: { name: 'Absinthe' },
        update: {},
        create: { name: 'Absinthe', description: 'A highly alcoholic anise-flavored spirit derived from botanicals.' }
    })

    // Catalog items
    const glass = await p.glassType.findFirst({ where: { name: 'Rocks Glass / Old Fashioned' } })
    const ice = await p.iceType.findFirst({ where: { name: 'No Ice (straight up/neat)' } })
    const technique = await p.shakeTechnique.findFirst({ where: { name: 'Standard Stir' } })
    const garnish = await p.garnish.upsert({ where: { name: 'Lemon Peel' }, update: {}, create: { name: 'Lemon Peel' } })

    const tasteStrong = await p.tasteProfile.upsert({ where: { name: 'Strong' }, update: {}, create: { name: 'Strong' } })
    const tasteAromatic = await p.tasteProfile.upsert({ where: { name: 'Aromatic' }, update: {}, create: { name: 'Aromatic' } })
    const tasteDry = await p.tasteProfile.upsert({ where: { name: 'Dry' }, update: {}, create: { name: 'Dry' } })

    // Validate Essentials
    const missing = []
    if (!rye) missing.push('Bottle: Rye Whiskey')
    if (!syrup) missing.push('Bottle: Simple Syrup')
    if (!bitters) missing.push('Bottle: Angostura Bitters')
    if (!glass) missing.push('Glass: Rocks Glass / Old Fashioned')
    if (!ice) missing.push('Ice: No Ice (straight up/neat)')
    if (!technique) missing.push('Technique: Standard Stir')
    if (!tasteStrong) missing.push('Taste: Strong')
    if (!tasteAromatic) missing.push('Taste: Aromatic')
    if (!tasteDry) missing.push('Taste: Dry')

    if (missing.length > 0) {
        console.error('❌ Missing catalog entries:', missing)
        process.exit(1)
    }

    const user = await p.user.findFirst()
    if (!user) {
        console.error('❌ No user found in database.')
        process.exit(1)
    }

    // --- 3. Build recipe JSON (EXCLUDING Absinthe as requested) ---
    const recipeJson = JSON.stringify([
        { bottleId: rye.id, name: 'Rye Whiskey', amount: 2 },
        { bottleId: syrup.id, name: 'Simple Syrup', amount: 0.25 },
        { bottleId: bitters.id, name: 'Angostura Bitters', amount: 0.1 }, // Representing dashes
    ])

    // --- 4. Create Cocktail ---
    const sazerac = await p.cocktail.create({
        data: {
            name: 'Sazerac',
            description: 'A bold, spirit-forward New Orleans classic with anise aroma. Rinse glass with absinthe for the authentic finish.',
            history: 'One of the oldest American cocktails, dating back to the 1800s.',
            instruction: 'Rinse a chilled glass with absinthe and discard the excess.\nStir rye whiskey, simple syrup, and bitters with ice until chilled.\nStrain into the prepared glass.\nExpress lemon peel over the drink.\nServe neat.',
            pictureUrl: '/images/cocktails/Sazerac.webp',
            volume: 2.35,
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            garnishes: { connect: [{ id: garnish.id }] },
            tastes: {
                connect: [
                    { id: tasteStrong.id },
                    { id: tasteAromatic.id },
                    { id: tasteDry.id }
                ]
            },
        }
    })

    console.log(`✅ Sazerac created! ID: ${sazerac.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
