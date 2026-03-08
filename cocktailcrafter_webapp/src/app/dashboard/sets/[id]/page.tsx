import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import SetDetailsClient from "./SetDetailsClient"

export default async function SetPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    const set = await prisma.cocktailSet.findUnique({
        where: { id },
        include: {
            cocktails: {
                include: { glasses: true, ices: true, tastes: true },
                orderBy: { name: 'asc' }
            }
        }
    })

    if (!set) return <div>Set not found</div>

    const isSuperAdmin = session?.user?.role === "SUPER_ADMIN"
    const isOwner = isSuperAdmin || (!!userId && set.userId === userId)

    // Block access to private sets for non-owners
    if (!set.isPublic && !isOwner) return <div>Set not found</div>

    const allCocktails = isOwner
        ? await prisma.cocktail.findMany({
            select: { id: true, name: true, pictureUrl: true },
            orderBy: { name: 'asc' }
        })
        : []

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <Link href="/dashboard/sets" className="inline-flex items-center gap-2 text-[#888c94] hover:text-white transition-colors mb-6 text-sm font-semibold">
                <i className="ph-bold ph-arrow-left"></i> Back to Sets
            </Link>

            <SetDetailsClient
                setId={set.id}
                initialName={set.name}
                initialDescription={set.description ?? ""}
                initialIsPublic={set.isPublic}
                cocktails={set.cocktails.map(c => ({
                    id: c.id,
                    name: c.name,
                    description: (c as any).description ?? null,
                    pictureUrl: c.pictureUrl,
                    glasses: c.glasses,
                    ices: c.ices,
                }))}
                allCocktails={allCocktails}
                isOwner={isOwner}
            />
        </div>
    )
}
