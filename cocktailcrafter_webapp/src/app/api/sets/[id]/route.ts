import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function getSetAndCheckOwner(id: string, userId: string, isSuperAdmin: boolean) {
    const set = await prisma.cocktailSet.findUnique({ where: { id } })
    if (!set) return { set: null, allowed: false }
    const allowed = isSuperAdmin || set.userId === userId
    return { set, allowed }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

        const { set, allowed } = await getSetAndCheckOwner(id, session.user.id, session.user.role === "SUPER_ADMIN")
        if (!set) return new NextResponse("Not found", { status: 404 })
        if (!allowed) return new NextResponse("Forbidden", { status: 403 })

        const { name, description, isPublic } = await req.json()

        const updated = await prisma.cocktailSet.update({
            where: { id },
            data: {
                name: name?.trim() || set.name,
                description: description?.trim() ?? set.description,
                isPublic: isPublic ?? set.isPublic,
            }
        })

        return NextResponse.json(updated)
    } catch (error: any) {
        return new NextResponse(error.message, { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

        const { set, allowed } = await getSetAndCheckOwner(id, session.user.id, session.user.role === "SUPER_ADMIN")
        if (!set) return new NextResponse("Not found", { status: 404 })
        if (!allowed) return new NextResponse("Forbidden", { status: 403 })

        await prisma.cocktailSet.delete({ where: { id } })
        return new NextResponse(null, { status: 204 })
    } catch (error: any) {
        return new NextResponse(error.message, { status: 500 })
    }
}
