import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const cocktails = await prisma.cocktail.findMany()
    const bottles = await prisma.bottle.findMany()
    const bottlesMap = new Map(bottles.map(b => [b.id, b]))

    const usedBottleIds = new Set<string>()
    cocktails.forEach(c => {
        try {
            const recipe = JSON.parse(c.recipe as string)
            recipe.forEach((ing: any) => {
                if (ing.bottleId) usedBottleIds.add(ing.bottleId)
            })
        } catch (e) { }
    })

    console.log('--- ANALYSIS OF USED BOTTLES ---')
    usedBottleIds.forEach(id => {
        const b = bottlesMap.get(id)
        if (!b) return
        const missing = []
        if (b.alcoholContent === null) missing.push('alcoholContent')
        if (b.sugarContent === null || b.sugarContent === 0 && !['Vodka', 'Gin', 'Rum', 'Tequila', 'Whiskey'].some(kw => b.name.includes(kw))) {
            // Some spirits have 0 sugar, but juices and syrups shouldn't
        }
        if (b.acidity === null) missing.push('acidity')
        if (!b.texture) missing.push('texture')
        if (!b.nonAlcoholicId && b.alcoholContent! > 0) missing.push('nonAlcoholicId')

        if (missing.length > 0) {
            console.log(`Bottle: ${b.name} (${b.id}) - Missing: ${missing.join(', ')}`)
        }
    })
}

main().finally(() => prisma.$disconnect())
