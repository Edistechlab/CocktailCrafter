import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
    req: Request,
    { params }: { params: Promise<{ parentId: string }> }
) {
    try {
        const { parentId } = await params

        let bottles = await (prisma.bottle as any).findMany({
            where: {
                parentId: parentId
            },
            orderBy: {
                name: 'asc'
            }
        })

        // If no children found, return the bottle itself (it's a specific brand)
        if (bottles.length === 0) {
            const self = await (prisma.bottle as any).findUnique({
                where: { id: parentId }
            })
            if (self) bottles = [self]
        }

        return NextResponse.json(bottles)
    } catch (error: any) {
        console.error("Failed to fetch bottles by parent:", error)
        return new Response("Internal Server Error", { status: 500 })
    }
}
