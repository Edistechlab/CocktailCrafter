import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { CocktailLibraryClient } from "./CocktailLibraryClient"

export const dynamic = 'force-dynamic'

export const metadata = {
    title: "Collection | CocktailCrafter",
    description: "Explore our artisan cocktail menu – meticulously craft signatures drinks with modern precision.",
}

export default async function CocktailsPage() {
    const session = await getServerSession(authOptions)
    const [cocktails, bottles] = await Promise.all([
        prisma.cocktail.findMany({
            include: {
                glasses: true,
                ices: true,
                tastes: true,
                techniques: true,
                ratings: true,
                favorites: {
                    where: { userId: session?.user?.id || 'none' }
                }
            },
            orderBy: { name: 'asc' }
        }),
        prisma.bottle.findMany({
            select: { id: true, name: true, alcoholContent: true, nonAlcoholicId: true }
        })
    ])

    // Build lookup: bottleId/name → has NA alternative
    const bottleById = new Map(bottles.map(b => [b.id, b]))
    const bottleByName = new Map(bottles.map(b => [b.name, b]))

    const cocktailsWithNaFlag = cocktails.map(cocktail => {
        let isFullyAlcoholFree = false
        if (cocktail.recipe) {
            try {
                const ingredients: any[] = JSON.parse(cocktail.recipe as string)
                const alcoholicIngredients = ingredients.filter(ing => {
                    const bottle = (ing.bottleId ? bottleById.get(ing.bottleId) : null)
                        ?? (ing.name ? bottleByName.get(ing.name) : null)
                    return bottle && (bottle.alcoholContent ?? 0) > 0
                })
                isFullyAlcoholFree = alcoholicIngredients.length > 0 &&
                    alcoholicIngredients.every(ing => {
                        const bottle = (ing.bottleId ? bottleById.get(ing.bottleId) : null)
                            ?? (ing.name ? bottleByName.get(ing.name) : null)
                        return bottle?.nonAlcoholicId != null
                    })
            } catch {
                isFullyAlcoholFree = false
            }
        }
        return { ...cocktail, isFullyAlcoholFree }
    })

    return (
        <div className="relative pb-32">
            {/* Page Header */}
            <div className="pt-24 pb-8 px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/20 text-[#00d2ff] text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                        <i className="ph-fill ph-circles-three-plus"></i>
                        The Artisan Library
                    </div>
                    <h1 className="text-7xl md:text-9xl font-black tracking-tight mb-4 leading-none">
                        Our Cocktail <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5]">Collection.</span>
                    </h1>
                </div>

                {/* Glow behind header */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#00d2ff]/5 blur-[120px] rounded-full -z-10"></div>
            </div>

            {/* Grid Container */}
            <div className="px-6 md:px-12 max-w-7xl mx-auto relative z-10">
                <CocktailLibraryClient cocktails={cocktailsWithNaFlag} />
            </div>

            {/* Background Glows */}
            <div className="fixed top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#00d2ff]/5 blur-[120px] rounded-full pointer-events-none -z-0"></div>
            <div className="fixed bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#3a7bd5]/3 blur-[120px] rounded-full pointer-events-none -z-0"></div>
        </div>
    )
}
