const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    console.log('🚀 Starting Pisco Sour seed script...')

    // --- 1. Check if exists ---
    const existing = await p.cocktail.findFirst({ where: { name: 'Pisco Sour' } })
    if (existing) {
        console.log('⚠️  Der Cocktail "Pisco Sour" existiert bereits. Script wird abgebrochen.')
        await p.$disconnect()
        return
    }

    // --- 2. Lookup or Create Dependencies ---

    // Bottles
    const pisco = await p.bottle.upsert({ where: { name: 'Pisco' }, update: {}, create: { name: 'Pisco', description: 'A colorless or yellowish-to-amber colored brandy from Peru and Chile.' } })
    const lime = await p.bottle.upsert({ where: { name: 'Lime Juice' }, update: {}, create: { name: 'Lime Juice', description: 'Freshly squeezed lime juice.' } })
    const syrup = await p.bottle.upsert({ where: { name: 'Simple Syrup' }, update: {}, create: { name: 'Simple Syrup', description: 'A basic sweetener made from sugar and water.' } })
    const bitters = await p.bottle.upsert({ where: { name: 'Angostura Bitters' }, update: {}, create: { name: 'Angostura Bitters', description: 'Concentrated bitters often used to flavor cocktails.' } })

    // Catalog items
    const glass = await p.glassType.upsert({ where: { name: 'Coupe Glass / Coupette' }, update: {}, create: { name: 'Coupe Glass / Coupette' } })
    const ice = await p.iceType.upsert({ where: { name: 'No Ice (straight up/neat)' }, update: {}, create: { name: 'No Ice (straight up/neat)' } })
    const technique = await p.shakeTechnique.upsert({ where: { name: 'Dry Shake' }, update: {}, create: { name: 'Dry Shake' } })
    const garnish = await p.garnish.upsert({ where: { name: 'Grated Spices' }, update: {}, create: { name: 'Grated Spices' } })

    const tasteBalanced = await p.tasteProfile.upsert({ where: { name: 'Balanced' }, update: {}, create: { name: 'Balanced' } })
    const tasteSour = await p.tasteProfile.upsert({ where: { name: 'Sour' }, update: {}, create: { name: 'Sour' } })
    const tasteFragrant = await p.tasteProfile.upsert({ where: { name: 'Fragrant / Aromatic' }, update: {}, create: { name: 'Fragrant / Aromatic' } })

    const user = await p.user.findFirst()
    if (!user) {
        console.error('❌ No user found in database.')
        process.exit(1)
    }

    // --- 3. Build recipe JSON (Egg white in description/instruction) ---
    const recipeJson = JSON.stringify([
        { bottleId: pisco.id, name: 'Pisco', amount: 2 },
        { bottleId: lime.id, name: 'Lime Juice', amount: 1 },
        { bottleId: syrup.id, name: 'Simple Syrup', amount: 0.75 },
        { bottleId: bitters.id, name: 'Bitters', amount: 0.1 }, // Representing dashes
    ])

    // --- 4. Create Cocktail ---
    const piscoSour = await p.cocktail.create({
        data: {
            name: 'Pisco Sour',
            description: 'A smooth and citrus-forward sour with silky foam and aromatic bitters (contains egg white).',
            history: 'Created in the early 20th century in Peru and became the national cocktail.',
            instruction: 'Dry shake all ingredients (including 0.5 part egg white) without ice.\nAdd ice and shake again until cold.\nStrain into a chilled coupe.\nAdd bitters on foam.\nServe immediately.',
            pictureUrl: '/images/cocktails/Pisco Sour.webp',
            volume: 4.35,
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            garnishes: { connect: [{ id: garnish.id }] },
            tastes: { connect: [{ id: tasteBalanced.id }, { id: tasteSour.id }, { id: tasteFragrant.id }] },
        }
    })

    console.log(`✅ Pisco Sour created! ID: ${piscoSour.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
