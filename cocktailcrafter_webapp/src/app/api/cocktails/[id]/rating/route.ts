import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) return new Response("Unauthorized", { status: 401 })

        const { id } = await params
        const { value } = await req.json() // 1-5 rating

        if (value < 0.5 || value > 5) {
            return new Response("Invalid rating value", { status: 400 })
        }

        // Upsert rating for this user and cocktail
        const rating = await prisma.rating.upsert({
            where: {
                userId_cocktailId: {
                    userId: session.user.id,
                    cocktailId: id
                }
            },
            update: { value },
            create: {
                value,
                userId: session.user.id,
                cocktailId: id
            }
        })

        return NextResponse.json(rating)
    } catch (e: any) {
        console.error("Rating failed:", e)
        return new Response(e.message, { status: 500 })
    }
}
