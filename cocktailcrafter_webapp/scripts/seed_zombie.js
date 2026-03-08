const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    console.log('🚀 Starting Zombie seed script...')

    // --- 1. Check if exists ---
    const existing = await p.cocktail.findFirst({ where: { name: 'Zombie' } })
    if (existing) {
        console.log('⚠️  Der Cocktail "Zombie" existiert bereits. Script wird abgebrochen.')
        await p.$disconnect()
        return
    }

    // --- 2. Lookup or Create Dependencies ---

    // Bottles
    const whiteRum = await p.bottle.upsert({ where: { name: 'White Rum' }, update: {}, create: { name: 'White Rum' } })
    const darkRum = await p.bottle.upsert({ where: { name: 'Dark Rum' }, update: {}, create: { name: 'Dark Rum' } })
    const overproofRum = await p.bottle.upsert({ where: { name: 'Overproof Rum' }, update: {}, create: { name: 'Overproof Rum', description: 'Rum with a high alcohol content, often 75% ABV (150 proof) or higher.' } })
    const lime = await p.bottle.upsert({ where: { name: 'Lime Juice' }, update: {}, create: { name: 'Lime Juice' } })
    const pineapple = await p.bottle.upsert({ where: { name: 'Pineapple Juice' }, update: {}, create: { name: 'Pineapple Juice' } })
    const grapefruit = await p.bottle.upsert({ where: { name: 'Grapefruit Juice' }, update: {}, create: { name: 'Grapefruit Juice', description: 'Freshly squeezed grapefruit juice.' } })
    const apricotLiqueur = await p.bottle.upsert({ where: { name: 'Apricot Liqueur' }, update: {}, create: { name: 'Apricot Liqueur', description: 'A sweet, fruit-based liqueur made from apricots.' } })
    const grenadine = await p.bottle.upsert({ where: { name: 'Grenadine' }, update: {}, create: { name: 'Grenadine', description: 'A non-alcoholic bar syrup, characterized by a flavor that is both tart and sweet, and by a deep red color.' } })

    // Catalog items
    const tikiMug = await p.glassType.upsert({ where: { name: 'Tiki Mug' }, update: {}, create: { name: 'Tiki Mug', description: 'A ceramic mug often used for tropical drinks.' } })
    const highball = await p.glassType.findFirst({ where: { name: 'Highball Glass' } })
    const ice = await p.iceType.upsert({ where: { name: 'Crushed Ice' }, update: {}, create: { name: 'Crushed Ice' } })
    const technique = await p.shakeTechnique.upsert({ where: { name: 'Standard Shake' }, update: {}, create: { name: 'Standard Shake' } })

    const tasteFruity = await p.tasteProfile.upsert({ where: { name: 'Fruity' }, update: {}, create: { name: 'Fruity' } })
    const tasteStrong = await p.tasteProfile.upsert({ where: { name: 'Strong' }, update: {}, create: { name: 'Strong' } })
    const tasteExotic = await p.tasteProfile.upsert({ where: { name: 'Exotic' }, update: {}, create: { name: 'Exotic', description: 'Unusual and tropical flavor profiles.' } })

    const user = await p.user.findFirst()
    if (!user) {
        console.error('❌ No user found in database.')
        process.exit(1)
    }

    // --- 3. Build recipe JSON ---
    const recipeJson = JSON.stringify([
        { bottleId: whiteRum.id, name: 'White Rum', amount: 1 },
        { bottleId: darkRum.id, name: 'Dark Rum', amount: 1 },
        { bottleId: overproofRum.id, name: 'Overproof Rum', amount: 1 },
        { bottleId: lime.id, name: 'Lime Juice', amount: 0.75 },
        { bottleId: pineapple.id, name: 'Pineapple Juice', amount: 0.5 },
        { bottleId: grapefruit.id, name: 'Grapefruit Juice', amount: 0.5 },
        { bottleId: apricotLiqueur.id, name: 'Apricot Liqueur', amount: 0.5 },
        { bottleId: grenadine.id, name: 'Grenadine', amount: 0.25 },
    ])

    // --- 4. Create Cocktail ---
    const zombie = await p.cocktail.create({
        data: {
            name: 'Zombie',
            description: 'A powerful tropical rum cocktail with layered fruit and spice notes.',
            history: 'Created in the 1930s by Donn Beach in Hollywood during the tiki craze.',
            instruction: 'Shake ingredients with ice.\nStrain over crushed ice.\nGarnish generously with mint and tropical fruits.\nServe immediately.\nEnjoy responsibly.',
            pictureUrl: '/images/cocktails/Zombie.webp',
            volume: 5.5,
            recipe: recipeJson,
            userId: user.id,
            glasses: {
                connect: [
                    { id: tikiMug.id },
                    ...(highball ? [{ id: highball.id }] : [])
                ]
            },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: technique.id }] },
            tastes: {
                connect: [
                    { id: tasteFruity.id },
                    { id: tasteStrong.id },
                    { id: tasteExotic.id }
                ]
            },
        }
    })

    console.log(`✅ Zombie created! ID: ${zombie.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
