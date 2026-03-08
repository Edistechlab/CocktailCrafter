import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return new Response("Unauthorized", { status: 401 })
        }

        const data = await req.json()
        const { name, description, instructions, volume, pictureUrl, affiliateLink } = data

        if (!name) {
            return new Response("Name is required", { status: 400 })
        }

        const updatedGlass = await prisma.glassType.update({
            where: { id },
            data: {
                name,
                description: description || null,
                instructions: instructions || null,
                volume: volume ? parseInt(volume) : null,
                pictureUrl: pictureUrl || null,
                affiliateLink: affiliateLink || null
            }
        })

        return NextResponse.json(updatedGlass)
    } catch (error: any) {
        if (error.code === 'P2002') {
            return new Response("Glass with this name already exists", { status: 400 })
        }
        return new Response(error.message, { status: 500 })
    }
}
