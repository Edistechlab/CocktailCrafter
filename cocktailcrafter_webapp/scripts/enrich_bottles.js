const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
    console.log('🧪 Starting Bottle Metadata Enrichment...')

    const updates = [
        {
            name: 'Green Chartreuse',
            data: {
                aroma: 'Powerful, herbaceous, peppery (mint, anise, pine, sage)',
                tasteProfile: 'Intense herbal, bittersweet, minty roots, medicinal',
                texture: 'Rich, viscous, full-bodied',
                sugarContent: 25,
                acidity: 0.5,
                country: 'France'
            }
        },
        {
            name: 'Yellow Chartreuse',
            data: {
                aroma: 'Fresh, spicy, honeyed (saffron, turmeric, anise, mocha)',
                tasteProfile: 'Sweet honeyed saffron, floral, milder herbs',
                texture: 'Soft, mellow, velvety',
                sugarContent: 31,
                acidity: 1,
                country: 'France'
            }
        },
        {
            name: 'Crème de Mûre',
            data: {
                aroma: 'Intense blackberry purée, jammy, subtle vanilla',
                tasteProfile: 'Deep sweet-tart blackberry, rich berry essence',
                texture: 'Syrupy, rich, velvety',
                sugarContent: 45,
                acidity: 3,
                country: 'France'
            }
        },
        {
            name: 'Honey-Ginger Syrup',
            data: {
                aroma: 'Spicy ginger, floral honey, sharp and warm',
                tasteProfile: 'Sweet honey base with strong spicy ginger heat',
                texture: 'Viscous, syrupy',
                sugarContent: 50,
                acidity: 1,
                country: 'Various/Homemade'
            }
        },
        {
            name: 'Absinthe',
            data: {
                aroma: 'Anise, fennel, wormwood, herbaceous',
                tasteProfile: 'Bittersweet, licorice-like, herbal complexity',
                texture: 'Lightly viscous',
                sugarContent: 0,
                acidity: 0.2,
                country: 'Switzerland/France'
            }
        },
        {
            name: 'Bourbon',
            data: {
                aroma: 'Vanilla, caramel, oak, spice',
                tasteProfile: 'Sweet corn, vanilla, toasted oak, rye spice',
                texture: 'Medium-bodied, warm',
                sugarContent: 0,
                acidity: 0,
                country: 'USA'
            }
        },
        {
            name: 'Maraschino Liqueur',
            data: {
                aroma: 'Cherry pit, almond-like, subtle floral, earthy',
                tasteProfile: 'Bittersweet cherry pit, nutty, floral, subtle funk',
                texture: 'Syrupy, clear',
                sugarContent: 34,
                acidity: 0.5,
                country: 'Italy'
            }
        },
        {
            name: 'Mezcal',
            data: {
                aroma: 'Smoky, earthy agave, herbal, vegetal',
                tasteProfile: 'Intense smoke, roasted agave, mineral, herbal',
                texture: 'Light to medium',
                sugarContent: 0,
                acidity: 0.1,
                country: 'Mexico'
            }
        },
        {
            name: 'Aperol',
            data: {
                country: 'Italy',
                sugarContent: 24 // Corrected from research
            }
        },
        { name: 'Gin', data: { country: 'United Kingdom' } },
        { name: 'Vodka', data: { country: 'Various' } },
        { name: 'Orange Juice', data: { country: 'Various' } },
        { name: 'Lemon Juice', data: { country: 'Various' } },
        { name: 'Lime Juice', data: { country: 'Various' } },
        { name: 'Simple Syrup', data: { country: 'Various/Homemade' } },
        { name: 'Honey Syrup', data: { country: 'Various/Homemade' } },
        { name: 'Grenadine', data: { country: 'Various' } },
        { name: 'Amaretto', data: { country: 'Italy' } }
    ]

    for (const update of updates) {
        const result = await p.bottle.updateMany({
            where: { name: update.name },
            data: update.data
        })
        console.log(`✅ Updated ${update.name}: ${result.count} record(s)`)
    }

    console.log('\n✨ All bottle metadata enriched!')
    await p.$disconnect()
}

main().catch(console.error)
