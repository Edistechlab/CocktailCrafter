import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { GlassIcon } from "@/components/GlassIcon"
import { IceIcon } from "@/components/IceIcon"
import { CocktailInteraction } from "@/components/CocktailInteraction"
import { TechniqueIcon } from "@/components/TechniqueIcon"
import { CocktailRecipe } from "@/components/CocktailRecipe"
import { FavoriteButton } from "@/components/FavoriteButton"

export default async function CocktailDetailPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ alcoholFree?: string }> }) {
    const { id } = await params
    const { alcoholFree } = await searchParams
    const session = await getServerSession(authOptions)
    const cocktail = await prisma.cocktail.findUnique({
        where: { id },
        include: {
            glasses: true,
            ices: true,
            tastes: true,
            techniques: true,
            garnishes: true,
            ratings: true, // Fetch all ratings to calculate average
            favorites: {
                where: { userId: session?.user?.id || 'none' }
            }
        }
    })

    if (!cocktail) notFound()

    // Calculate average rating
    const totalRatings = cocktail.ratings.length
    const averageRating = totalRatings > 0
        ? cocktail.ratings.reduce((acc, curr) => acc + curr.value, 0) / totalRatings
        : 0

    // Find current user's personal rating
    const userRating = session?.user?.id
        ? cocktail.ratings.find(r => r.userId === session.user.id)?.value || 0
        : 0

    const ingredients = cocktail.recipe ? JSON.parse(cocktail.recipe as string) : []
    const bottleIds = ingredients.map((ing: any) => ing.bottleId).filter(Boolean)
    const bottleNames = ingredients.map((ing: any) => ing.name).filter(Boolean)
    const alternativeNames = ingredients.map((ing: any) => ing.alternative).filter(Boolean)

    const allNames = Array.from(new Set([...bottleNames, ...alternativeNames]))

    // Fetch bottle data for ingredients to support NA/Alternative switching
    const bottles = await prisma.bottle.findMany({
        where: {
            OR: [
                { id: { in: bottleIds } },
                { name: { in: allNames } }
            ]
        },
        include: {
            nonAlcoholic: true,
            alternative: true,
            parent: true
        }
    })

    const bottlesMap = bottles.reduce((acc: any, bottle: any) => {
        acc[bottle.id] = bottle
        acc[bottle.name] = bottle // Allow looking up by name
        return acc
    }, {})

    const isFavorite = cocktail.favorites.length > 0

    return (
        <div className="relative min-h-screen pb-24">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[#0b0c10]">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#00d2ff]/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#3a7bd5]/3 blur-[100px] rounded-full"></div>
            </div>

            {/* Top Navigation Bar */}
            <div className="pt-24 pb-8 px-6">
                <div className="max-w-7xl mx-auto">
                    <Link
                        href="/cocktails"
                        className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 text-[#888c94] hover:text-white border border-white/10 rounded-2xl transition-all font-black uppercase tracking-widest text-[10px] group"
                    >
                        <i className="ph-bold ph-arrow-left transition-transform group-hover:-translate-x-1 text-sm"></i>
                        Back to Library
                    </Link>
                </div>
            </div>

            {/* Main Content Grid */}
            <main className="max-w-7xl mx-auto px-6 space-y-20">

                {/* Top Section: Header & Visual */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                    <div className="lg:col-span-7 space-y-16">
                        {/* Header Section */}
                        <div className="space-y-6">
                            <div className="flex flex-wrap gap-2">
                                {cocktail.tastes.map(t => (
                                    <span key={t.id} className="px-5 py-2 bg-[#00d2ff]/20 border border-[#00d2ff]/40 text-[#00d2ff] text-[13px] font-black uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(0,210,255,0.1)]">
                                        {t.name}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none text-white uppercase italic">
                                {cocktail.name}<span className="text-[#00d2ff]">.</span>
                            </h1>
                            <p className="text-xl text-[#888c94] font-bold leading-relaxed max-w-2xl">
                                {cocktail.description}
                            </p>
                        </div>

                        {/* History Section */}
                        {cocktail.history && (
                            <section className="space-y-6 bg-white/5 p-8 rounded-[40px] border border-white/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <i className="ph-fill ph-book-open text-8xl"></i>
                                </div>
                                <h3 className="text-[13px] font-black uppercase tracking-[0.3em] text-[#aeb2ba] mb-3">Backstory & Character</h3>
                                <p className="text-[#888c94] leading-relaxed relative z-10 font-medium whitespace-pre-wrap italic">
                                    "{cocktail.history}"
                                </p>
                            </section>
                        )}

                        {/* Preparation/Method Section */}
                        <section className="space-y-10">
                            <h3 className="text-2xl font-black flex items-center gap-4 text-white">
                                <span className="w-10 h-1px bg-[#00d2ff]"></span>
                                The Method
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4 p-6 bg-[#0b0c10]/40 border border-white/5 rounded-3xl">
                                    <div className="text-[13px] font-black uppercase tracking-widest text-[#aeb2ba] mb-2">Technique</div>
                                    <div className="text-white font-bold text-lg flex items-center gap-3">
                                        <TechniqueIcon type={cocktail.techniques?.[0]?.name || ""} className="w-6 h-6 text-[#00d2ff]" />
                                        {cocktail.techniques?.[0]?.name || "Standard Build"}
                                    </div>
                                </div>
                                <div className="space-y-4 p-6 bg-[#0b0c10]/40 border border-white/5 rounded-[32px]">
                                    <div className="text-[13px] font-black uppercase tracking-widest text-[#aeb2ba] mb-2">Served In</div>
                                    <div className="text-white font-bold text-lg flex items-center gap-3">
                                        <GlassIcon type={cocktail.glasses?.[0]?.name || ""} className="w-6 h-6 text-[#00d2ff]" />
                                        {cocktail.glasses?.[0]?.name || "Any Glass"}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="lg:col-span-5">
                        {/* Visual Preview */}
                        <div className="aspect-[4/5] rounded-[48px] overflow-hidden border border-white/10 relative shadow-2xl">
                            {cocktail.pictureUrl ? (
                                <img src={cocktail.pictureUrl} alt={cocktail.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-[#1a1b21] flex items-center justify-center">
                                    <i className="ph-fill ph-martini text-8xl text-white/5"></i>
                                </div>
                            )}
                            <div className="absolute top-8 right-8 z-20">
                                <FavoriteButton cocktailId={cocktail.id} initialIsFavorite={isFavorite} />
                            </div>
                            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0b0c10] to-transparent"></div>
                        </div>

                        <div className="mt-8 space-y-4 p-6 bg-[#0b0c10]/40 border border-white/5 rounded-3xl">
                            <div className="flex items-center justify-between px-2">
                                <div className="text-[13px] font-black uppercase tracking-[0.2em] text-[#aeb2ba]">Automation-Level</div>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((level) => {
                                        const isActive = ((cocktail as any).automationLevel || 0) >= level;
                                        return (
                                            <div
                                                key={level}
                                                className={`w-10 h-2 rounded-full transition-all duration-700 ${isActive ? 'bg-[#00d2ff] shadow-[0_0_12px_rgba(0,210,255,0.4)]' : 'bg-white/5'}`}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Instructions & Recipe: Split Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
                    {/* Instructions */}
                    <div className="lg:col-span-6 h-full order-2 lg:order-1">
                        <div className="p-8 md:p-12 bg-white/5 border border-white/5 rounded-[48px] h-full space-y-8">
                            <h4 className="text-xl font-black text-white flex items-center gap-3">
                                <i className="ph-fill ph-list-numbers text-[#00d2ff]"></i>
                                Step by Step
                            </h4>
                            <p className="text-[#888c94] font-bold text-lg leading-loose whitespace-pre-wrap">
                                {cocktail.instruction || "Pour all ingredients into a chilled glass and serve."}
                            </p>
                        </div>
                    </div>

                    {/* Recipe */}
                    <div className="lg:col-span-6 order-1 lg:order-2">
                        <CocktailRecipe
                            initialIngredients={ingredients}
                            bottlesMap={bottlesMap}
                            iceName={cocktail.ices?.[0]?.name}
                            garnishName={cocktail.garnishes.map(g => g.name)}
                            dilution={cocktail.techniques?.[0]?.dilution || 0}
                            initialAlcoholFree={alcoholFree === "1"}
                        />
                    </div>
                </div>

                {/* Bottom Section: Interaction & Community */}
                <div className="pt-12 border-t border-white/5">
                    <div className="max-w-5xl mx-auto">
                        <CocktailInteraction
                            cocktailId={cocktail.id}
                            initialAverageRating={averageRating}
                            initialRatingsCount={totalRatings}
                            initialUserRating={userRating}
                            initialIsFavorite={isFavorite}
                        />
                    </div>
                </div>

            </main>
        </div>
    )
}
