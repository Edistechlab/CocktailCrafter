const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const updates = [
        {
            name: 'Whiskey',
            data: {
                aroma: 'Honey, heather, malty grains',
                tasteProfile: 'Balanced sweetness, cereal notes, light spice, subtle peat',
                texture: 'Smooth, light to medium-bodied'
            }
        },
        {
            name: 'Tequila',
            data: {
                aroma: 'Earthy agave, citrus (lime), black pepper',
                tasteProfile: 'Sweet cooked agave, peppery spice, clean/crisp',
                texture: 'Silky, light, and sharp'
            }
        },
        {
            name: 'Vermouth',
            data: {
                aroma: 'Herbal, floral, white wine, citrus peel',
                tasteProfile: 'Tart, acidic, botanical, bone-dry finish',
                texture: 'Light and thin'
            }
        },
        {
            name: 'Cherry Juice',
            data: {
                aroma: 'Tart cherry, almond hints',
                tasteProfile: 'Sharp acidity, deep berry sweetness, slightly tannic',
                texture: 'Lightly syrupy'
            }
        },
        {
            name: 'Cola',
            data: {
                aroma: 'Cinnamon, vanilla, citrus, caramel',
                tasteProfile: 'Carbonated sweetness, spice, caffeine bitterness',
                texture: 'Effervescent and crisp'
            }
        },
        {
            name: 'Cranberry Juice',
            data: {
                aroma: 'Sharp, acidic, red berry',
                tasteProfile: 'Intense tartness, astringent, subtle sweetness',
                texture: 'Thin, mouth-drying'
            }
        },
        {
            name: 'Cream',
            data: {
                aroma: 'Fresh dairy, sweet',
                tasteProfile: 'Rich, milky, neutral sweetness',
                texture: 'Thick, coating, and luxurious'
            }
        },
        {
            name: 'Grenadine',
            data: {
                aroma: 'Pomegranate, floral (rose), sugary',
                tasteProfile: 'Intense berry sweetness, slightly tart',
                texture: 'Syrupy and thick'
            }
        },
        {
            name: 'Passion Fruit Syrup',
            data: {
                aroma: 'Tropical, pungent, floral',
                tasteProfile: 'Exotic acidity, intense tropical sweetness',
                texture: 'Viscous and syrupy'
            }
        },
        {
            name: 'Pineapple Juice',
            data: {
                aroma: 'Tropical, sweet, acidic',
                tasteProfile: 'Tangy sweetness, bright tropical fruit',
                texture: 'Slightly pulpy and frothy'
            }
        },
        {
            name: 'Raspberry Syrup',
            data: {
                aroma: 'Fresh raspberry, jammy',
                tasteProfile: 'High sweetness, tart berry finish',
                texture: 'Syrupy and dense'
            }
        },
        {
            name: 'Sourmix',
            data: {
                aroma: 'Synthetic lemon-lime, sugary',
                tasteProfile: 'High acidity, tart, chemical sweetness',
                texture: 'Lightly syrupy'
            }
        },
        {
            name: 'Sprite',
            data: {
                aroma: 'Lemon-lime, zesty',
                tasteProfile: 'Citrus sweetness, clean carbonation',
                texture: 'Bubbly and crisp'
            }
        }
    ];

    console.log(`Starting update for ${updates.length} bottles...`);

    for (const update of updates) {
        try {
            const result = await prisma.bottle.update({
                where: { name: update.name },
                data: update.data
            });
            console.log(`✅ Updated: ${update.name}`);
        } catch (error) {
            console.error(`❌ Failed to update ${update.name}: ${error.message}`);
        }
    }

    console.log('Update complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
