import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/sets — Returns public sets + the current user's own sets.
 * Used by the mobile app's Smart Configuration feature.
 */
export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        const userId = session?.user?.id

        const sets = await prisma.cocktailSet.findMany({
            where: {
                OR: [
                    { isPublic: true },
                    ...(userId ? [{ userId }] : [])
                ]
            },
            include: {
                cocktails: {
                    select: { id: true, name: true, recipe: true }
                }
            },
            orderBy: { createdAt: 'desc' },
        })

        const setsWithIngredients = sets.map(set => {
            const ingredients = new Set<string>()
            set.cocktails.forEach(c => {
                try {
                    const recipe = JSON.parse(c.recipe || '[]')
                    recipe.forEach((ing: any) => { if (ing.name) ingredients.add(ing.name) })
                } catch { }
            })
            return {
                id: set.id,
                name: set.name,
                description: set.description,
                isPublic: set.isPublic,
                userId: set.userId,
                cocktailCount: set.cocktails.length,
                cocktails: set.cocktails.map(c => ({ id: c.id, name: c.name })),
                ingredients: [...ingredients],
            }
        })

        return NextResponse.json(setsWithIngredients)
    } catch (error: any) {
        return new NextResponse(error.message, { status: 500 })
    }
}

/**
 * POST /api/sets — Create a new set for the logged-in user.
 */
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { name, description, isPublic } = await req.json()

        if (!name?.trim()) {
            return new NextResponse("Name is required", { status: 400 })
        }

        const set = await prisma.cocktailSet.create({
            data: {
                name: name.trim(),
                description: description?.trim() || null,
                isPublic: isPublic ?? true,
                userId: session.user.id,
            }
        })

        return NextResponse.json(set)
    } catch (error: any) {
        return new NextResponse(error.message, { status: 500 })
    }
}
