const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    // --- Lookup IDs ---
    const tequila = await p.bottle.findFirst({ where: { name: 'Tequila Blanco' } })
    const tripleSec = await p.bottle.findFirst({ where: { name: 'Triple Sec' } })
    const limeJuice = await p.bottle.findFirst({ where: { name: 'Lime Juice' } })

    const glass = await p.glassType.findFirst({ where: { name: 'Margarita Glass' } })
    const ice = await p.iceType.findFirst({ where: { name: 'No Ice (straight up/neat)' } })
    const shake = await p.shakeTechnique.findFirst({ where: { name: 'Standard Shake' } })
    const rim = await p.garnish.findFirst({ where: { name: 'Rims' } })
    const citrusWheel = await p.garnish.findFirst({ where: { name: 'Citrus Wheels / Slices' } })

    const tasteCitrus = await p.tasteProfile.findFirst({ where: { name: 'Citrus-forward' } })
    const tasteRefresh = await p.tasteProfile.findFirst({ where: { name: 'Refreshing' } })
    const tasteSour = await p.tasteProfile.findFirst({ where: { name: 'Sour' } })

    // Validate
    const missing = []
    if (!tequila) missing.push('Bottle: Tequila Blanco')
    if (!tripleSec) missing.push('Bottle: Triple Sec')
    if (!limeJuice) missing.push('Bottle: Lime Juice')
    if (!glass) missing.push('Glass: Margarita Glass')
    if (!ice) missing.push('Ice: No Ice (straight up/neat)')
    if (!shake) missing.push('Technique: Standard Shake')
    if (!rim) missing.push('Garnish: Rims')
    if (!citrusWheel) missing.push('Garnish: Citrus Wheels / Slices')
    if (!tasteCitrus) missing.push('Taste: Citrus-forward')
    if (!tasteRefresh) missing.push('Taste: Refreshing')
    if (!tasteSour) missing.push('Taste: Sour')

    if (missing.length > 0) {
        console.error('❌ Missing catalog entries:', missing)
        process.exit(1)
    }

    // --- Find user ---
    const user = await p.user.findFirst()
    if (!user) {
        console.error('❌ No user found in database.')
        process.exit(1)
    }

    // --- Check if already exists ---
    const existing = await p.cocktail.findFirst({ where: { name: 'Margarita' } })
    if (existing) {
        console.log('⚠️  Margarita already exists, skipping.')
        await p.$disconnect()
        return
    }

    // Build recipe JSON
    const recipeJson = JSON.stringify([
        { bottleId: tequila.id, name: 'Tequila Blanco', amount: 2 },
        { bottleId: tripleSec.id, name: 'Triple Sec', amount: 1 },
        { bottleId: limeJuice.id, name: 'Lime Juice', amount: 1 },
    ])

    // --- Create Margarita ---
    const margarita = await p.cocktail.create({
        data: {
            name: 'Margarita',
            description: 'A bright, citrus-forward tequila cocktail with refreshing acidity and subtle sweetness.',
            history: 'Origin likely in Mexico in the 1930s–40s; exact creator unknown but popularized worldwide as the signature tequila cocktail.',
            instruction: 'Shake all ingredients with ice for 10–15 seconds.\nStrain into a chilled salt-rimmed glass.\nGarnish with a lime wheel.\nServe immediately.\nEnjoy fresh and cold.',
            pictureUrl: '/images/cocktails/margarita.webp',
            volume: 4,
            recipe: recipeJson,
            userId: user.id,
            glasses: { connect: [{ id: glass.id }] },
            ices: { connect: [{ id: ice.id }] },
            techniques: { connect: [{ id: shake.id }] },
            garnishes: { connect: [{ id: rim.id }, { id: citrusWheel.id }] },
            tastes: { connect: [{ id: tasteCitrus.id }, { id: tasteRefresh.id }, { id: tasteSour.id }] },
        }
    })

    console.log(`✅ Margarita created! ID: ${margarita.id}`)
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
