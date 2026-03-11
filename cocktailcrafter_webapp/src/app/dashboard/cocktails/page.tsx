export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import CocktailListClient from "./CocktailListClient"


export default async function CocktailsPage() {
    const session = await getServerSession(authOptions)

    // Authorization filter
    const whereClause = session?.user?.role === "SUPER_ADMIN"
        ? {}
        : { userId: session?.user?.id }

    const cocktails = await prisma.cocktail.findMany({
        where: whereClause,
        include: {
            glasses: true,
            ices: true,
            tastes: true,
            user: { select: { role: true, firstName: true, nickname: true } }
        },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">My Cocktails</h1>
                    <p className="text-[#888c94]">View and manage your entire CocktailCrafter recipe library.</p>
                </div>

                <Link
                    href="/dashboard/cocktails/new"
                    className="flex items-center gap-2 bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 text-[#00d2ff] border border-[#00d2ff]/40 font-bold py-2.5 px-5 rounded-xl transition-all shadow-[0_0_15px_rgba(0,210,255,0.1)] shrink-0"
                >
                    <i className="ph-bold ph-plus text-lg"></i>
                    Add Cocktail
                </Link>
            </header>

            {cocktails.length === 0 ? (
                <div className="bg-[#1a1b21]/50 border border-white/5 rounded-3xl p-16 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 rounded-full mb-6">
                        <i className="ph-fill ph-martini text-4xl text-[#888c94]"></i>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No cocktails yet</h3>
                    <p className="text-[#888c94] max-w-md mx-auto mb-8">
                        Your database is currently empty. Start by adding your first signature drink to the CocktailCrafter.
                    </p>
                    <Link
                        href="/dashboard/cocktails/new"
                        className="inline-flex items-center gap-2 bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 text-[#00d2ff] border border-[#00d2ff]/20 font-bold py-3 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(0,210,255,0.05)]"
                    >
                        <i className="ph-bold ph-plus text-lg"></i>
                        Create First Cocktail
                    </Link>
                </div>
            ) : (
                <CocktailListClient
                    cocktails={cocktails}
                    currentUserId={session?.user?.id ?? null}
                    isSuperAdmin={session?.user?.role === "SUPER_ADMIN"}
                />
            )}
        </div>
    )
}
