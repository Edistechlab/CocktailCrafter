export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import SetsPageClient from "./SetsPageClient"

export default async function CocktailSetsPage() {
    try {
        const session = await getServerSession(authOptions)
        const userId = session?.user?.id

        const allSets = await prisma.cocktailSet.findMany({
            where: {
                OR: [
                    { isPublic: true },
                    ...(userId ? [{ userId }] : [])
                ]
            },
            include: {
                _count: { select: { cocktails: true } },
                user: { select: { firstName: true, lastName: true, role: true } }
            },
            orderBy: { createdAt: 'desc' }
        })

        const sets = allSets.map(s => ({
            id: s.id,
            name: s.name,
            description: s.description,
            isPublic: s.isPublic,
            isOwner: s.userId === userId,
            cocktailCount: s._count.cocktails,
            ownerName: s.user
                ? (s.user.role === 'SUPER_ADMIN' ? 'CocktailCrafter' : `${s.user.firstName || ''} ${s.user.lastName || ''}`.trim() || null)
                : null,
            userId: s.userId,
        }))

        return <SetsPageClient sets={sets} />
    } catch (error: any) {
        console.error("Sets page error:", error)
        return (
            <div className="p-8 max-w-6xl mx-auto">
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl">
                    <p className="font-bold mb-2">Error loading sets</p>
                    <p className="text-sm font-mono">{error?.message}</p>
                </div>
            </div>
        )
    }
}
