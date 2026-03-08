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
        const { name, description, instructions } = data

        if (!name) {
            return new Response("Name is required", { status: 400 })
        }

        const updatedTechnique = await prisma.shakeTechnique.update({
            where: { id },
            data: {
                name,
                description: description || null,
                instructions: instructions || null
            }
        })

        return NextResponse.json(updatedTechnique)
    } catch (error: any) {
        console.error("Failed to update technique:", error)
        if (error.code === 'P2002') {
            return new Response("Technique with this name already exists", { status: 400 })
        }
        return new Response(error.message, { status: 500 })
    }
}
