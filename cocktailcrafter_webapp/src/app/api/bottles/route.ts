import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

/**
 * GET /api/bottles — Public endpoint for fetching all bottles.
 * Used by the mobile app to sync bottle data.
 */
export async function GET() {
    try {
        const bottles = await prisma.bottle.findMany({
            include: {
                parent: { select: { id: true, name: true } },
                alternative: { select: { id: true, name: true } },
                nonAlcoholic: { select: { id: true, name: true } },
            },
            orderBy: { name: 'asc' },
        })

        const result = bottles.map(b => ({
            id: b.id,
            name: b.name,
            category: b.category,
            type: b.type,
            productName: b.productName,
            description: b.description,
            aroma: b.aroma,
            tasteProfile: b.tasteProfile,
            texture: b.texture,
            alcoholContent: b.alcoholContent,
            sugarContent: b.sugarContent,
            acidity: b.acidity,
            parentId: b.parentId,
            parentName: b.parent?.name || null,
            alternativeId: b.alternativeId,
            alternativeName: b.alternative?.name || null,
            nonAlcoholicId: b.nonAlcoholicId,
            nonAlcoholicName: b.nonAlcoholic?.name || null,
            country: b.country,
            affiliateLink: b.affiliateLink,
        }))

        return NextResponse.json({ bottles: result })
    } catch (error: any) {
        console.error("Failed to fetch bottles:", error)
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
        const {
            name,
            category,
            type,
            productName,
            description,
            aroma,
            tasteProfile,
            texture,
            alcoholContent,
            sugarContent,
            acidity,
            parentId,
            alternativeId,
            nonAlcoholicId,
            country,
            affiliateLink,
        } = data

        if (!name) {
            return new Response("Name is required", { status: 400 })
        }

        const newBottle = await prisma.bottle.create({
            data: {
                name,
                category: category || null,
                type: type || null,
                productName: productName || null,
                description: description || null,
                aroma: aroma || null,
                tasteProfile: tasteProfile || null,
                texture: texture || null,
                alcoholContent: alcoholContent ? parseFloat(alcoholContent) : null,
                sugarContent: sugarContent ? parseFloat(sugarContent) : 0,
                acidity: acidity ? parseFloat(acidity) : 0,
                parentId: parentId || null,
                alternativeId: alternativeId || null,
                nonAlcoholicId: nonAlcoholicId || null,
                country: country || null,
                affiliateLink: affiliateLink || null,
            }
        })

        return NextResponse.json(newBottle)
    } catch (error: any) {
        console.error("Failed to create bottle:", error)
        if (error.code === 'P2002') {
            return new Response("Bottle with this name already exists", { status: 400 })
        }
        return new Response(error.message, { status: 500 })
    }
}
