import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { calculateCocktailMetrics } from "@/lib/cocktailCalculations"

/**
 * GET /api/cocktails — Public endpoint for fetching all cocktails.
 * Used by the mobile app to sync data from the server.
 */
export async function GET() {
    try {
        const cocktails = await prisma.cocktail.findMany({
            include: {
                glasses: { select: { id: true, name: true } },
                garnishes: { select: { id: true, name: true, description: true } },
                tastes: { select: { id: true, name: true } },
                techniques: { select: { id: true, name: true, dilution: true } },
                ices: { select: { id: true, name: true } },
                ratings: { select: { value: true } },
                sets: { select: { id: true, name: true } },
            },
            orderBy: { name: 'asc' },
        })

        const allBottles = await prisma.bottle.findMany()
        const bottleMap = new Map()
        allBottles.forEach(b => bottleMap.set(b.name, b))

        const result = cocktails.map(c => {
            const ratings = c.ratings || []
            const ratingAvg = ratings.length > 0
                ? ratings.reduce((sum: number, r: { value: number }) => sum + r.value, 0) / ratings.length
                : 0

            let parsedRecipe = []
            try {
                parsedRecipe = JSON.parse(c.recipe || '[]')
            } catch (e) { }

            const calcIngredients = parsedRecipe.map((ing: any) => {
                const b = bottleMap.get(ing.name)
                return {
                    amount: ing.amount,
                    alcoholContent: b?.alcoholContent || 0,
                    sugarContent: b?.sugarContent || 0,
                    acidity: b?.acidity || 0,
                    name: ing.name
                }
            })

            const dilution = c.techniques?.[0]?.dilution || 0

            const metrics = calculateCocktailMetrics(calcIngredients, { dilution })

            return {
                id: c.id,
                name: c.name,
                description: c.description,
                pictureUrl: c.pictureUrl,
                automationLevel: c.automationLevel,
                recipeJson: c.recipe || '[]',
                instructions: c.instruction,
                history: c.history,
                volume: c.volume,
                votingScore: c.votingScore,
                ratingAvg: Math.round(ratingAvg * 10) / 10,
                ratingCount: ratings.length,
                glass: c.glasses?.[0]?.name || null,
                ice: c.ices?.[0]?.name || null,
                garnishes: c.garnishes?.map((g: any) => ({ name: g.name, description: g.description || '' })) || [],
                tastes: c.tastes?.map((t: { name: string }) => t.name) || [],
                technique: c.techniques?.[0]?.name || null,
                sets: c.sets?.map((s: { id: string; name: string }) => ({ id: s.id, name: s.name })) || [],
                abv: metrics.abv,
                balance: metrics.balance,
            }
        })

        // Build non-alcoholic mapping from Bottle table
        const bottlesWithNA = await prisma.bottle.findMany({
            where: { nonAlcoholicId: { not: null } },
            select: { name: true, nonAlcoholic: { select: { name: true } } }
        })
        const naMapping: Record<string, string> = {}
        bottlesWithNA.forEach(b => {
            if (b.nonAlcoholic?.name) {
                naMapping[b.name] = b.nonAlcoholic.name
            }
        })

        // Build alternative mapping from Bottle table
        const bottlesWithAlt = await prisma.bottle.findMany({
            where: { alternativeId: { not: null } },
            select: { name: true, alternative: { select: { name: true } } }
        })
        const altMapping: Record<string, string> = {}
        bottlesWithAlt.forEach(b => {
            if (b.alternative?.name) {
                altMapping[b.name] = b.alternative.name
            }
        })

        return NextResponse.json({ recipes: result, naMapping, altMapping })
    } catch (error: any) {
        console.error("Failed to fetch cocktails:", error)
        return new NextResponse(error.message, { status: 500 })
    }
}


export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return new Response("Unauthorized", { status: 401 })
        }

        const data = await req.json()
        const { name, description, history, instruction, pictureUrl, volume, glassIds, techniqueIds, iceIds, tasteIds, garnishIds, recipe, automationLevel } = data

        if (!name) {
            return new Response("Cocktail name is required", { status: 400 })
        }

        const cocktail = await prisma.cocktail.create({
            data: {
                name,
                description,
                history,
                instruction,
                pictureUrl,
                volume: Number(volume),
                automationLevel: Number(automationLevel || 0),
                recipe: recipe ? JSON.stringify(recipe) : undefined,
                glasses: glassIds && glassIds.length > 0 ? {
                    connect: glassIds.map((id: string) => ({ id }))
                } : undefined,
                techniques: techniqueIds && techniqueIds.length > 0 ? {
                    connect: techniqueIds.map((id: string) => ({ id }))
                } : undefined,
                ices: iceIds && iceIds.length > 0 ? {
                    connect: iceIds.map((id: string) => ({ id }))
                } : undefined,
                garnishes: garnishIds && garnishIds.length > 0 ? {
                    connect: garnishIds.map((id: string) => ({ id }))
                } : undefined,
                tastes: tasteIds && tasteIds.length > 0 ? {
                    connect: tasteIds.map((id: string) => ({ id }))
                } : undefined,
                user: { connect: { id: session.user.id } }
            }
        })

        return Response.json(cocktail)
    } catch (error: any) {
        console.error("Cocktail creation failed:", error)
        return new Response(error.message, { status: 500 })
    }
}
