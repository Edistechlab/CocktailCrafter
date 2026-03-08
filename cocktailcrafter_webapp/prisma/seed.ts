import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding CocktailCrafter Catalogs...')

    // Clear existing catalogs to remove any old German duplicates
    await prisma.glassType.deleteMany()
    await prisma.iceType.deleteMany()
    await prisma.garnish.deleteMany()
    await prisma.tasteProfile.deleteMany()
    await prisma.shakeTechnique.deleteMany()
    await prisma.bottle.deleteMany()
    await prisma.cocktailSet.deleteMany()

    // 1. Glass Types
    const glasses = [
        { name: 'Coupe Glass / Coupette', volume: 150, description: '120-180ml Daiquiri, Margarita, Sidecar' },
        { name: 'Highball Glass', volume: 300, description: '250-350ml Gin Tonic, Mojito, Cuba Libre' },
        { name: 'Collins Glass', volume: 350, description: '300-400ml Tom Collins, Vodka Collins' },
        { name: 'Rocks Glass / Old Fashioned', volume: 250, description: '180-300ml Old Fashioned, Negroni' },
        { name: 'Martini Glass', volume: 200, description: '150-250ml Martini, Cosmopolitan' },
        { name: 'Nick & Nora Glass', volume: 160, description: '140-180ml Martini variations, Corpse Reviver' },
        { name: 'Hurricane Glass', volume: 500, description: '400-600ml Hurricane, Piña Colada, Zombie' },
        { name: 'Margarita Glass', volume: 350, description: '300-450ml Margarita' },
        { name: 'Shot Glass', volume: 45, description: '30-60ml Shots, Boilermaker' },
        { name: 'Flute / Champagne Flute', volume: 175, description: '150-200ml French 75, Mimosa' },
        { name: 'Poco Grande / Tulip Glass', volume: 400, description: '350-500ml Piña Colada, Singapore Sling' },
        { name: 'Copper Mug', volume: 450, description: '400-500ml Moscow Mule' },
    ]

    for (const g of glasses) {
        await prisma.glassType.create({
            data: g,
        })
    }

    // 2. Ice Types
    const ices = [
        { name: 'No Ice (straight up/neat)', description: 'Served pure without ice.' },
        { name: 'Clear Ice', description: 'Large blocks, minimal dilution.' },
        { name: 'Ice Sphere', description: 'Approx. 5-6cm diameter melts extremely slowly.' },
        { name: 'Large Cube / King Cube', description: 'Approx. 5x5 cm for Rocks glasses.' },
        { name: 'Standard Cube', description: 'Approx. 3x3 cm, balanced cooling.' },
        { name: 'Small Cube', description: '1-2 cm, for fast cooling/shaking.' },
        { name: 'Cracked Ice', description: 'Between Cube and Crushed, e.g. for Swizzles.' },
        { name: 'Crushed Ice / Pebble Ice', description: 'Maximum dilution, ice-cold texture.' },
        { name: 'Collins Spear / Ice Spear', description: 'Tall, sleek block for Highball/Collins.' },
    ]

    for (const i of ices) {
        await prisma.iceType.create({
            data: i,
        })
    }

    // 3. Garnish Options
    const garnishes = [
        { name: 'Citrus Twists / Peels', description: 'Lemon, orange, lime twist. Aromatic oils.' },
        { name: 'Citrus Wheels / Slices', description: 'Thin round slices. Fresh, colorful.' },
        { name: 'Citrus Wedges', description: 'Wedges/Quarters. Squeezable juice.' },
        { name: 'Fresh Herbs', description: 'Mint leaves, basil, rosemary.' },
        { name: 'Cocktail Cherries', description: 'Maraschino/Luxardo/Brandied. Sweet contrast.' },
        { name: 'Olives', description: 'Green olives (Castelvetrano). Salty-Savory.' },
        { name: 'Pickled / Savory Garnishes', description: 'Onions, beans. Umami.' },
        { name: 'Fresh Fruits / Berries', description: 'Strawberries, blackberries, pineapple chunk. Summery.' },
        { name: 'Tropical / Exotic Fruits', description: 'Pineapple wedge, passion fruit. Tropical feeling.' },
        { name: 'Rims', description: 'Salt, sugar, Tajin on the glass rim.' },
        { name: 'Grated Spices', description: 'Nutmeg, cinnamon, chili. Warming scent.' },
        { name: 'Edible Flowers', description: 'Hibiscus, lavender, rose petals. Elegant.' },
        { name: 'Dehydrated Fruits', description: 'Dried oranges, apples. Premium look.' },
    ]

    for (const g of garnishes) {
        await prisma.garnish.create({
            data: g,
        })
    }

    // 4. Taste Profile
    const tastes = [
        { name: 'Dry', description: 'Little to no sweetness, very dry (Martini)' },
        { name: 'Clean', description: 'Clear, pure, unobtrusive' },
        { name: 'Subtly sweet', description: 'Subtly sweet, just a hint of sweetness' },
        { name: 'Citrus-forward', description: 'Strong citrus focus, fresh and sour' },
        { name: 'Rich', description: 'Full, creamy, opulent' },
        { name: 'Fruited', description: 'Fruit-forward, juicy' },
        { name: 'Softly sweet', description: 'Gently sweet, soft' },
        { name: 'Bitter', description: 'Bitter focus, complex-tart (Negroni)' },
        { name: 'Sour', description: 'Sour/fresh' },
        { name: 'Sweet', description: 'Clearly sweet, syrupy' },
        { name: 'Boozy', description: 'Strong alcoholic, warming' },
        { name: 'Herbaceous', description: 'Herbal, green (Chartreuse)' },
        { name: 'Spicy', description: 'Spicy/hot (Chili, Ginger)' },
        { name: 'Creamy', description: 'Creamy, velvety' },
        { name: 'Tart', description: 'Tart-sour, piquant' },
        { name: 'Balanced', description: 'Balanced, all elements in harmony' },
        { name: 'Refreshing', description: 'Refreshing, light' },
        { name: 'Bold', description: 'Strong, intense' },
        { name: 'Savory', description: 'Hearty, umami-like (salt, olive)' },
        { name: 'Fragrant / Aromatic', description: 'Fragrant, aromatic, floral' },
    ]

    for (const t of tastes) {
        await prisma.tasteProfile.create({
            data: t,
        })
    }

    // 5. Shake Technique
    const techniques = [
        { name: 'No Shake / Build', description: 'No shaking required. Add ingredients directly to the glass.' },
        { name: 'Standard Shake (Hard/Regular)', description: 'Horizontal strong shaking for 10-15s.' },
        { name: 'Dry Shake', description: 'Shake without ice, then with ice (Foam/Egg-White).' },
        { name: 'Reverse Dry Shake', description: 'Shake with ice, strain, shake without ice.' },
        { name: 'Whip Shake (Short Shake)', description: 'Short hard shake with little ice for 5-8s.' },
        { name: 'Double Shake', description: 'Shake two cocktails simultaneously in both hands.' },
        { name: 'Standard Stir', description: 'Mixing Glass, 20-40s gentle stirring (Spirit-forward).' },
        { name: 'Built / Built over Ice', description: 'Build directly in the glass and stir.' },
        { name: 'Layered / Float', description: 'Carefully layer without stirring.' },
    ]

    for (const t of techniques) {
        await prisma.shakeTechnique.create({
            data: t,
        })
    }

    // 6. Bottles
    const bottles = [
        "Amaretto", "Aperol", "Benedictine", "Bianco Vermouth", "Blue Curacao",
        "Bourbon Whiskey", "Brandy", "Cachaça", "Campari", "Chartreuse",
        "Cherry Juice", "Cognac", "Cointreau", "Cola", "Cranberry Juice",
        "Dark Rum", "Dry Vermouth", "Gin", "Grand Marnier",
        "Irish Whiskey", "Lemon Juice", "Lime Juice", "London Dry Gin",
        "Mezcal", "Orange Juice", "Pineapple Juice", "Rye Whiskey",
        "Scotch Whisky", "Soda Water", "Sourmix", "Sprite", "Sweet Vermouth",
        "Tequila", "Tequila Blanco", "Tequila Reposado", "Tonic Water",
        "Triple Sec", "Vermouth", "Vodka", "Whiskey", "White Rum"
    ]

    for (const b of bottles) {
        await prisma.bottle.create({
            data: { name: b, description: 'Standard Bar Ingredient' }
        })
    }

    // 7. Cocktail Sets
    const sets = [
        "Summer Set", "Mimosa Set", "Edi Set", "Martini Set", "Campari Set", "Luka Set"
    ]

    for (const s of sets) {
        await prisma.cocktailSet.create({
            data: { name: s, description: 'Hand-picked cocktail collection' }
        })
    }

    console.log('Seeding complete!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
