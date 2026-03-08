import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) return new Response("Unauthorized", { status: 401 })

        const { id } = await params

        // Check if already is favorite
        const existing = await prisma.favorite.findUnique({
            where: {
                userId_cocktailId: {
                    userId: session.user.id,
                    cocktailId: id
                }
            }
        })

        if (existing) {
            // Remove from favorites
            await prisma.favorite.delete({
                where: { id: existing.id }
            })
            return NextResponse.json({ isFavorite: false })
        } else {
            // Add to favorites
            await prisma.favorite.create({
                data: {
                    userId: session.user.id,
                    cocktailId: id
                }
            })
            return NextResponse.json({ isFavorite: true })
        }
    } catch (e: any) {
        console.error("Favorite toggle failed:", e)
        return new Response(e.message, { status: 500 })
    }
}
