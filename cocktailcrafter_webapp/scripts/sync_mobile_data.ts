import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

// Copy of calculation logic from src/lib/cocktailCalculations.ts
export function calculateCocktailMetrics(ingredients: any[], options: { dilution?: number | null } = {}) {
    let totalVolume = 0
    let totalAlcoholVolume = 0
    let totalSugar = 0
    let totalAcid = 0

    ingredients.forEach(ing => {
        const amount = typeof ing.amount === 'string' ? parseFloat(ing.amount) : ing.amount
        if (isNaN(amount)) return

        totalVolume += amount

        if (ing.alcoholContent) {
            totalAlcoholVolume += (amount * ing.alcoholContent) / 100
        }

        if (ing.sugarContent) {
            totalSugar += (amount * ing.sugarContent) / 100
        }

        if (ing.acidity) {
            totalAcid += (amount * ing.acidity) / 100
        }
    })

    if (totalVolume === 0) return { abv: 0, balance: 5 }

    const dilutionFactor = 1 + (options.dilution || 0)
    const finalVolume = totalVolume * dilutionFactor

    const abv = (totalAlcoholVolume / finalVolume) * 100

    let balance = 5
    if (totalAcid > 0) {
        const ratio = totalSugar / totalAcid
        balance = Math.min(10, Math.max(0, 5 + (Math.log2(ratio) * 2)))
    } else if (totalSugar > 0) {
        balance = 8
    }

    return {
        abv: parseFloat(abv.toFixed(1)),
        balance: parseFloat(balance.toFixed(1))
    }
}

async function main() {
    console.log('🔄 Syncing mobile data with database...')

    // 1. Get all bottles for lookup
    const allBottles = await prisma.bottle.findMany({
        include: { nonAlcoholic: true }
    })

    const bottleMap: Record<string, any> = {}
    const naMapping: Record<string, string> = {}

    allBottles.forEach(b => {
        bottleMap[b.id] = b
        if (b.nonAlcoholic) {
            naMapping[b.name] = b.nonAlcoholic.name
        }
    })

    // 2. Get all cocktails
    const cocktails = await prisma.cocktail.findMany({
        include: {
            glasses: true,
            ices: true,
            techniques: true,
            garnishes: true,
            tastes: true,
            ratings: true
        }
    })

    const recipes = cocktails.map(c => {
        const ingredients = JSON.parse(c.recipe || '[]')
        const tech = c.techniques[0]

        // Enrich ingredients with metrics from database
        const enrichedIngredients = ingredients.map((ing: any) => {
            const bottle = bottleMap[ing.bottleId]
            return {
                ...ing,
                alcoholContent: bottle?.alcoholContent || 0,
                sugarContent: bottle?.sugarContent || 0,
                acidity: bottle?.acidity || 0
            }
        })

        const metrics = calculateCocktailMetrics(enrichedIngredients, { dilution: tech?.dilution })

        return {
            id: c.id,
            name: c.name,
            description: c.description,
            pictureUrl: c.pictureUrl,
            automationLevel: c.automationLevel || 3,
            recipeJson: c.recipe,
            instructions: c.instruction || '',
            history: c.history || '',
            abv: metrics.abv,
            balance: metrics.balance,
            votingScore: c.votingScore || 0,
            ratingAvg: c.ratings.length > 0 ? (c.ratings.reduce((acc: number, r: any) => acc + r.value, 0) / c.ratings.length) : 0,
            ratingCount: c.ratings.length,
            glass: c.glasses[0]?.name || 'Standard Glass',
            ice: c.ices[0]?.name || 'Standard Ice',
            garnishes: c.garnishes.map(g => ({ name: g.name, description: g.description })),
            tastes: c.tastes.map(t => t.name),
            technique: c.techniques[0]?.name || 'Standard Method'
        }
    })

    const output = {
        recipes,
        naMapping
    }

    const targetPath = path.join(process.cwd(), 'cocktailcrafter-mobile/constants/CocktailData.json')
    if (!fs.existsSync(path.dirname(targetPath))) {
        fs.mkdirSync(path.dirname(targetPath), { recursive: true })
    }
    fs.writeFileSync(targetPath, JSON.stringify(output, null, 2))

    console.log(`✅ Success! Exported ${recipes.length} cocktails with calculated live metrics.`)
}

main().finally(() => prisma.$disconnect())
