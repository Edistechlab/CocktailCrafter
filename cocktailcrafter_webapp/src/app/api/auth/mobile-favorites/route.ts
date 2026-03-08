import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * Mobile Favorites API.
 * Uses userId in request body (since NextAuth cookies don't work in React Native).
 * 
 * GET /api/auth/mobile-favorites?userId=xxx — Fetch all favorites for a user
 * POST /api/auth/mobile-favorites — Toggle a favorite
 */

export async function GET(request: NextRequest) {
    try {
        const userId = request.nextUrl.searchParams.get('userId')
        if (!userId) {
            return NextResponse.json({ message: "userId is required" }, { status: 400 })
        }

        const favorites = await prisma.favorite.findMany({
            where: { userId },
            select: { cocktailId: true },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json({
            favorites: favorites.map(f => f.cocktailId)
        })
    } catch (error) {
        console.error("[mobile-favorites] GET error:", error)
        return NextResponse.json({ message: "Server error" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userId, cocktailId } = await request.json()

        if (!userId || !cocktailId) {
            return NextResponse.json({ message: "userId and cocktailId are required" }, { status: 400 })
        }

        // Verify user exists
        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }

        // Check if already favorite
        const existing = await prisma.favorite.findUnique({
            where: {
                userId_cocktailId: { userId, cocktailId }
            }
        })

        if (existing) {
            // Remove
            await prisma.favorite.delete({ where: { id: existing.id } })
            return NextResponse.json({ isFavorite: false, cocktailId })
        } else {
            // Add
            await prisma.favorite.create({
                data: { userId, cocktailId }
            })
            return NextResponse.json({ isFavorite: true, cocktailId })
        }
    } catch (error) {
        console.error("[mobile-favorites] POST error:", error)
        return NextResponse.json({ message: "Server error" }, { status: 500 })
    }
}
