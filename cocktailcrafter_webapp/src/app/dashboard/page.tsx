import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { UserGrowthChart } from "@/components/UserGrowthChart"
import { CocktailChart } from "@/components/CocktailChart"


export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    // Fetch all counts concurrently for performance
    const [
        cocktailCount,
        setCount,
        userCount,
        bottleCount,
        glassCount,
        iceCount,
        techniqueCount,
        garnishCount,
        tasteCount,
        users,
        cocktails
    ] = await Promise.all([
        prisma.cocktail.count(),
        prisma.cocktailSet.count(),
        prisma.user.count(),
        prisma.bottle.count(),
        prisma.glassType.count(),
        prisma.iceType.count(),
        prisma.shakeTechnique.count(),
        prisma.garnish.count(),
        prisma.tasteProfile.count(),
        prisma.user.findMany({ select: { createdAt: true } }),
        prisma.cocktail.findMany({ select: { createdAt: true } })
    ])

    // Calculate last 12 months data for user growth and cocktail counts
    const now = new Date()
    const userGrowthData = []
    const cocktailStatsData = []

    for (let i = 11; i >= 0; i--) {
        const targetMonth = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthIndex = targetMonth.getMonth()
        const year = targetMonth.getFullYear()

        const usersInMonth = users.filter((usr: any) => {
            const created = new Date(usr.createdAt)
            return created.getMonth() === monthIndex && created.getFullYear() === year
        }).length

        const cocktailsInMonth = cocktails.filter((ckt: any) => {
            const created = new Date(ckt.createdAt)
            return created.getMonth() === monthIndex && created.getFullYear() === year
        }).length

        const monthName = targetMonth.toLocaleString('en-US', { month: 'short' })
        const label = `${monthName} ${year.toString().slice(-2)}`

        userGrowthData.push({ name: label, users: usersInMonth })
        cocktailStatsData.push({ name: label, count: cocktailsInMonth })
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <header className="mb-10">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back, {session?.user?.name}</h1>
                <p className="text-[#888c94]">Here is a complete overview of your CocktailCrafter database today.</p>
            </header>

            <div className="space-y-8">
                {/* Primary Stats */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 text-white">Core Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link href="/dashboard/cocktails" className="block group">
                            <div className="bg-gradient-to-br from-[#1a1b21] to-[#121316] rounded-2xl p-6 border border-white/5 shadow-xl transition-all group-hover:border-[#00d2ff]/30 group-hover:shadow-[0_0_20px_rgba(0,210,255,0.1)]">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-[#888c94] font-medium uppercase tracking-wider text-xs">Total Cocktails</h3>
                                    <i className="ph-fill ph-martini text-[#00d2ff] text-xl"></i>
                                </div>
                                <p className="text-4xl font-bold text-white group-hover:text-[#00d2ff] transition-colors">{cocktailCount}</p>
                            </div>
                        </Link>

                        <Link href="/dashboard/sets" className="block group">
                            <div className="bg-gradient-to-br from-[#1a1b21] to-[#121316] rounded-2xl p-6 border border-white/5 shadow-xl transition-all group-hover:border-[#00d2ff]/30 group-hover:shadow-[0_0_20px_rgba(0,210,255,0.1)]">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-[#888c94] font-medium uppercase tracking-wider text-xs">Cocktail Sets</h3>
                                    <i className="ph-fill ph-book-open text-[#00d2ff] text-xl"></i>
                                </div>
                                <p className="text-4xl font-bold text-white group-hover:text-[#00d2ff] transition-colors">{setCount}</p>
                            </div>
                        </Link>

                        <Link href="/dashboard/users" className="block group">
                            <div className="bg-gradient-to-br from-[#1a1b21] to-[#121316] rounded-2xl p-6 border border-white/5 shadow-xl transition-all group-hover:border-[#00d2ff]/30 group-hover:shadow-[0_0_20px_rgba(0,210,255,0.1)]">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-[#888c94] font-medium uppercase tracking-wider text-xs">Registered Users</h3>
                                    <i className="ph-fill ph-users text-[#00d2ff] text-xl"></i>
                                </div>
                                <p className="text-4xl font-bold text-white group-hover:text-[#00d2ff] transition-colors">{userCount}</p>
                            </div>
                        </Link>
                    </div>
                </section>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* User Growth Chart */}
                    <section className="bg-gradient-to-br from-[#1a1b21] to-[#121316] rounded-2xl p-6 border border-white/5 shadow-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <i className="ph-fill ph-trend-up text-[#00d2ff] text-xl"></i>
                            <h2 className="text-lg font-bold text-white">Audience Growth</h2>
                        </div>
                        <p className="text-xs text-[#888c94] mb-4">New users over the last 12 months</p>
                        <UserGrowthChart data={userGrowthData} />
                    </section>

                    {/* Cocktails Chart */}
                    <section className="bg-gradient-to-br from-[#1a1b21] to-[#121316] rounded-2xl p-6 border border-white/5 shadow-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <i className="ph-fill ph-flask text-[#00d2ff] text-xl"></i>
                            <h2 className="text-lg font-bold text-white">Cocktail Inventory</h2>
                        </div>
                        <p className="text-xs text-[#888c94] mb-4">New cocktails added to the database</p>
                        <CocktailChart data={cocktailStatsData} />
                    </section>
                </div>

                {/* Catalog Stats */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-white">Catalogs Data</h2>
                        <Link href="/dashboard/catalogs" className="text-sm text-[#00d2ff] hover:opacity-80 transition-opacity">
                            View All Catalogs &rarr;
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <Link href="/dashboard/catalogs" className="block group">
                            <div className="bg-[#1a1b21] rounded-xl p-4 border border-white/5 transition-all group-hover:bg-[#1f2128]">
                                <div className="flex items-center gap-2 mb-2">
                                    <i className="ph-fill ph-drop text-[#00d2ff]"></i>
                                    <h4 className="text-xs font-semibold text-[#888c94] uppercase">Bottles</h4>
                                </div>
                                <p className="text-2xl font-bold text-white">{bottleCount}</p>
                            </div>
                        </Link>

                        <Link href="/dashboard/catalogs" className="block group">
                            <div className="bg-[#1a1b21] rounded-xl p-4 border border-white/5 transition-all group-hover:bg-[#1f2128]">
                                <div className="flex items-center gap-2 mb-2">
                                    <i className="ph-fill ph-brandy text-[#00d2ff]"></i>
                                    <h4 className="text-xs font-semibold text-[#888c94] uppercase">Glasses</h4>
                                </div>
                                <p className="text-2xl font-bold text-white">{glassCount}</p>
                            </div>
                        </Link>

                        <Link href="/dashboard/catalogs" className="block group">
                            <div className="bg-[#1a1b21] rounded-xl p-4 border border-white/5 transition-all group-hover:bg-[#1f2128]">
                                <div className="flex items-center gap-2 mb-2">
                                    <i className="ph-fill ph-snowflake text-[#00d2ff]"></i>
                                    <h4 className="text-xs font-semibold text-[#888c94] uppercase">Ice</h4>
                                </div>
                                <p className="text-2xl font-bold text-white">{iceCount}</p>
                            </div>
                        </Link>

                        <Link href="/dashboard/catalogs" className="block group">
                            <div className="bg-[#1a1b21] rounded-xl p-4 border border-white/5 transition-all group-hover:bg-[#1f2128]">
                                <div className="flex items-center gap-2 mb-2">
                                    <i className="ph-fill ph-waves text-[#00d2ff]"></i>
                                    <h4 className="text-xs font-semibold text-[#888c94] uppercase">Techniques</h4>
                                </div>
                                <p className="text-2xl font-bold text-white">{techniqueCount}</p>
                            </div>
                        </Link>

                        <div className="bg-[#1a1b21] rounded-xl p-4 border border-white/5 opacity-80">
                            <div className="flex items-center gap-2 mb-2">
                                <i className="ph-fill ph-leaf text-white/50"></i>
                                <h4 className="text-xs font-semibold text-[#888c94] uppercase">Garnishes</h4>
                            </div>
                            <p className="text-2xl font-bold text-white">{garnishCount}</p>
                        </div>

                        <div className="bg-[#1a1b21] rounded-xl p-4 border border-white/5 opacity-80">
                            <div className="flex items-center gap-2 mb-2">
                                <i className="ph-fill ph-drop text-white/50"></i>
                                <h4 className="text-xs font-semibold text-[#888c94] uppercase">Tastes</h4>
                            </div>
                            <p className="text-2xl font-bold text-white">{tasteCount}</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
