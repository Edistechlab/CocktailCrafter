import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
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

        const updatedBottle = await prisma.bottle.update({
            where: { id },
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

        return NextResponse.json(updatedBottle)
    } catch (error: any) {
        console.error("Failed to update bottle:", error)
        if (error.code === 'P2002') {
            return new Response("Bottle with this name already exists", { status: 400 })
        }
        return new Response(error.message, { status: 500 })
    }
}
