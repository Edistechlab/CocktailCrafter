export const dynamic = 'force-dynamic'

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import FavoritesListClient from "./FavoritesListClient"

export default async function FavoritesPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return <div className="p-8">Please sign in to view your favorites.</div>
    }

    const favoriteLinks = await prisma.favorite.findMany({
        where: { userId: session.user.id },
        include: {
            cocktail: {
                include: {
                    glasses: true,
                    ices: true,
                    tastes: true,
                    techniques: true,
                    ratings: true,
                    user: true,
                    favorites: {
                        where: { userId: session.user.id }
                    }
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    const cocktails = favoriteLinks.map(f => f.cocktail)

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">My Favorites</h1>
                    <p className="text-[#888c94]">Your personalized collection of curated recipes.</p>
                </div>
            </header>

            {cocktails.length === 0 ? (
                <div className="bg-[#1a1b21]/50 border border-white/5 rounded-3xl p-16 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 rounded-full mb-6">
                        <i className="ph-fill ph-heart text-4xl text-[#888c94]"></i>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No favorites yet</h3>
                    <p className="text-[#888c94] max-w-md mx-auto mb-8">
                        Explore the library and mark your favorite compositions to see them here.
                    </p>
                </div>
            ) : (
                <FavoritesListClient cocktails={cocktails} />
            )}
        </div>
    )
}
