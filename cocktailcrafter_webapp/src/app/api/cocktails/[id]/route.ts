import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"


export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) return new Response("Unauthorized", { status: 401 })

        const { id } = await params;

        // Permission Check
        if (session.user.role !== "SUPER_ADMIN") {
            const cocktail = await prisma.cocktail.findUnique({ where: { id } })
            if (cocktail?.userId !== session.user.id) {
                return new Response("Forbidden: You can only delete your own cocktails", { status: 403 })
            }
        }

        await prisma.cocktail.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (e: any) {
        console.error("Delete failed:", e)
        return new Response(e.message, { status: 500 })
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) return new Response("Unauthorized", { status: 401 })

        const { id } = await params;

        // Permission Check
        if (session.user.role !== "SUPER_ADMIN") {
            const cocktail = await prisma.cocktail.findUnique({ where: { id } })
            if (cocktail?.userId !== session.user.id) {
                return new Response("Forbidden: You can only edit your own cocktails", { status: 403 })
            }
        }

        const data = await req.json()
        const { name, description, history, instruction, pictureUrl, volume, glassIds, techniqueIds, iceIds, tasteIds, garnishIds, recipe, automationLevel } = data

        if (!name) return new Response("Cocktail name is required", { status: 400 })

        const cocktail = await prisma.cocktail.update({
            where: { id },
            data: {
                name,
                description,
                history,
                instruction,
                pictureUrl,
                volume: Number(volume),
                automationLevel: Number(automationLevel || 0),
                recipe: recipe ? JSON.stringify(recipe) : null,
                glasses: { set: glassIds ? glassIds.map((val: string) => ({ id: val })) : [] },
                techniques: { set: techniqueIds ? techniqueIds.map((val: string) => ({ id: val })) : [] },
                ices: { set: iceIds ? iceIds.map((val: string) => ({ id: val })) : [] },
                garnishes: { set: garnishIds ? garnishIds.map((val: string) => ({ id: val })) : [] },
                tastes: { set: tasteIds ? tasteIds.map((val: string) => ({ id: val })) : [] },
            }
        })
        return NextResponse.json(cocktail)
    } catch (e: any) {
        console.error("Update failed:", e)
        return new Response(e.message, { status: 500 })
    }
}
