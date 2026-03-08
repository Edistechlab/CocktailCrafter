import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function checkOwner(setId: string, userId: string, isSuperAdmin: boolean) {
    const set = await prisma.cocktailSet.findUnique({ where: { id: setId } })
    if (!set) return false
    return isSuperAdmin || set.userId === userId
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) return new Response("Unauthorized", { status: 401 })
        const isOwner = await checkOwner(id, session.user.id, session.user.role === "SUPER_ADMIN")
        if (!isOwner) return new Response("Forbidden", { status: 403 })
        const { cocktailId } = await req.json()
        if (!cocktailId) return new Response("Cocktail ID is required", { status: 400 })
        const updatedSet = await prisma.cocktailSet.update({
            where: { id },
            data: { cocktails: { connect: { id: cocktailId } } }
        })
        return Response.json(updatedSet)
    } catch (error: any) {
        return new Response(error.message, { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) return new Response("Unauthorized", { status: 401 })
        const isOwner = await checkOwner(id, session.user.id, session.user.role === "SUPER_ADMIN")
        if (!isOwner) return new Response("Forbidden", { status: 403 })
        const { cocktailId } = await req.json()
        if (!cocktailId) return new Response("Cocktail ID is required", { status: 400 })
        const updatedSet = await prisma.cocktailSet.update({
            where: { id },
            data: { cocktails: { disconnect: { id: cocktailId } } }
        })
        return Response.json(updatedSet)
    } catch (error: any) {
        return new Response(error.message, { status: 500 })
    }
}
