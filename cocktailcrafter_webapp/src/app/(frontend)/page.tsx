import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import { FrontendCocktailCard } from "@/components/FrontendCocktailCard"

export const dynamic = 'force-dynamic'

export const metadata = {
    title: "CocktailCrafter | Professional Mixology Tools",
    description: "Standardize your cocktails with absolute precision. High-end mixology database and automated dispensing patterns.",
}

export default async function IndexPage() {
    const session = await getServerSession(authOptions)

    // Fetch 3 random featured cocktails
    const allCocktailIds = await prisma.cocktail.findMany({
        select: { id: true }
    })

    const randomIds = allCocktailIds
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(c => c.id)

    const featuredCocktails = await prisma.cocktail.findMany({
        where: {
            id: { in: randomIds }
        },
        include: {
            tastes: true,
            ratings: true,
            glasses: true,
            ices: true,
            techniques: true,
            favorites: {
                where: { userId: session?.user?.id || 'none' }
            }
        }
    })

    return (
        <div className="relative isolate pt-12">
            {/* Main Brand Hero */}
            <section className="pt-24 pb-32 md:pt-48 md:pb-52 px-6 overflow-hidden">
                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/20 text-[#00d2ff] text-[10px] font-black uppercase tracking-[0.2em] mb-10 animate-fade-in">
                        Professional Mixology
                    </div>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-[600px] -z-10 pointer-events-none overflow-hidden select-none">
                        {/* Gradient Fade Overlays */}
                        <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#0b0c10] via-[#0b0c10]/40 to-transparent z-10"></div>
                        <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#0b0c10] via-[#0b0c10]/40 to-transparent z-10"></div>

                        <div className="absolute inset-0 flex items-center justify-center opacity-60">
                            {/* Layer 1: Main Cyan Wave */}
                            <svg className="absolute w-[200%] h-full transform-gpu animate-wave-flow opacity-60" viewBox="0 0 2000 400" preserveAspectRatio="none">
                                <path d="M0,200 C200,100 300,300 500,200 C700,100 800,300 1000,200 C1200,100 1300,300 1500,200 C1700,100 1800,300 2000,200" fill="none" stroke="url(#grad1)" strokeWidth="2.5" />
                                <defs>
                                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#00d2ff" stopOpacity="0" />
                                        <stop offset="25%" stopColor="#00d2ff" stopOpacity="0.4" />
                                        <stop offset="50%" stopColor="#00d2ff" stopOpacity="0.7" />
                                        <stop offset="75%" stopColor="#00d2ff" stopOpacity="0.4" />
                                        <stop offset="100%" stopColor="#00d2ff" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <svg className="absolute w-[200%] h-full transform-gpu animate-wave-flow opacity-30 [animation-delay:-5s] [animation-duration:22s]" viewBox="0 0 2000 400" preserveAspectRatio="none">
                                <path d="M0,210 C200,110 300,310 500,210 C700,110 800,310 1000,210 C1200,110 1300,310 1500,210 C1700,110 1800,310 2000,210" fill="none" stroke="url(#grad1)" strokeWidth="1.5" />
                            </svg>

                            {/* Layer 2: Deep Blue Waves */}
                            <svg className="absolute w-[200%] h-full transform-gpu animate-wave-flow-slow opacity-40" viewBox="0 0 2000 400" preserveAspectRatio="none">
                                <path d="M0,215 C200,115 300,315 500,215 C700,115 800,315 1000,215 C1200,115 1300,315 1500,215 C1700,115 1800,315 2000,215" fill="none" stroke="url(#grad2)" strokeWidth="1.5" />
                                <defs>
                                    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#3a7bd5" stopOpacity="0" />
                                        <stop offset="25%" stopColor="#3a7bd5" stopOpacity="0.3" />
                                        <stop offset="50%" stopColor="#3a7bd5" stopOpacity="0.6" />
                                        <stop offset="75%" stopColor="#3a7bd5" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#3a7bd5" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <svg className="absolute w-[200%] h-full transform-gpu animate-wave-flow-slow opacity-20 [animation-delay:-8s]" viewBox="0 0 2000 400" preserveAspectRatio="none">
                                <path d="M0,225 C200,125 300,325 500,225 C700,125 800,325 1000,225 C1200,125 1300,325 1500,225 C1700,125 1800,325 2000,225" fill="none" stroke="url(#grad2)" strokeWidth="1.0" />
                            </svg>

                            {/* Layer 3: Thin Accent Highlights */}
                            <svg className="absolute w-[200%] h-full transform-gpu animate-wave-flow opacity-20 [animation-duration:50s]" viewBox="0 0 2000 400" preserveAspectRatio="none">
                                <path d="M0,190 C200,90 300,290 500,190 C700,90 800,290 1000,190 C1200,90 1300,290 1500,190 C1700,90 1800,290 2000,190" fill="none" stroke="white" strokeWidth="0.5" />
                            </svg>
                            <svg className="absolute w-[200%] h-full transform-gpu animate-wave-flow opacity-15 [animation-duration:35s] [animation-delay:-12s]" viewBox="0 0 2000 400" preserveAspectRatio="none">
                                <path d="M0,180 C200,80 300,280 500,180 C700,80 800,280 1000,180 C1200,80 1300,280 1500,180 C1700,80 1800,280 2000,180" fill="none" stroke="white" strokeWidth="0.3" />
                            </svg>

                            {/* Layer 4: Deep Pulse Waves */}
                            <svg className="absolute w-[200%] h-full transform-gpu animate-wave-flow-slow opacity-10 [animation-duration:80s]" viewBox="0 0 2000 400" preserveAspectRatio="none">
                                <path d="M0,230 C200,130 300,330 500,230 C700,130 800,330 1000,230 C1200,130 1300,330 1500,230 C1700,130 1800,330 2000,230" fill="none" stroke="#3a7bd5" strokeWidth="3" />
                            </svg>
                            <svg className="absolute w-[200%] h-full transform-gpu animate-wave-flow opacity-5 [animation-duration:60s] [animation-delay:-20s]" viewBox="0 0 2000 400" preserveAspectRatio="none">
                                <path d="M0,245 C200,145 300,345 500,245 C700,145 800,345 1000,245 C1200,145 1300,345 1500,245 C1700,145 1800,345 2000,245" fill="none" stroke="#00d2ff" strokeWidth="2" />
                            </svg>
                        </div>
                    </div>

                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-10 leading-none">
                        Refining <br />
                        <span className="text-white">Cocktail <span className="text-[#00d2ff]/80">Precision.</span></span>
                    </h1>

                    <p className="text-[#888c94] text-lg md:text-xl max-w-2xl mx-auto mb-16 leading-relaxed font-bold uppercase tracking-widest">
                        Standardized Recipes. Automated Dispensing. <br className="hidden md:block" /> Absolute Perfection.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            href="/cocktails"
                            className="w-full sm:w-auto px-12 py-5 bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 text-[#00d2ff] border border-[#00d2ff]/40 font-black rounded-2xl transition-all shadow-[0_0_20px_rgba(0,210,255,0.15)] hover:scale-[1.03] active:scale-[0.98] text-lg uppercase tracking-wider"
                        >
                            View Cocktails
                        </Link>
                        <Link
                            href="/campaign"
                            className="w-full sm:w-auto px-12 py-5 bg-white/5 hover:bg-[#00d2ff]/10 text-white hover:text-[#00d2ff] border border-white/10 hover:border-[#00d2ff]/40 font-black rounded-2xl transition-all backdrop-blur-md text-lg uppercase tracking-wider group"
                        >
                            VIP Pre-Order <i className="ph-bold ph-arrow-right ml-2 transition-transform group-hover:translate-x-1"></i>
                        </Link>
                    </div>
                </div>

                {/* Dramatic Background elements */}
                <div className="absolute top-[10%] right-[-15%] w-[800px] h-[800px] bg-[#00d2ff]/5 blur-[150px] rounded-full -z-10 animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] left-[-15%] w-[600px] h-[600px] bg-[#3a7bd5]/5 blur-[120px] rounded-full -z-10"></div>
            </section>

            {/* Featured Section */}
            <section className="py-32 px-6 bg-[#1a1b21]/20 relative isolate">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                        <div>
                            <div className="text-[11px] font-black uppercase tracking-[0.3em] text-[#00d2ff] mb-4">Curated Collection</div>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-6">Artisan <span className="text-white/40">Recipes.</span></h2>
                            <p className="text-[#888c94] text-lg max-w-xl font-bold">Standardized database for perfect flavor profiles.</p>
                        </div>
                        <Link href="/cocktails" className="text-white font-black uppercase tracking-widest text-sm hover:text-[#00d2ff] flex items-center gap-3 transition-colors group">
                            Explore full menu <i className="ph-bold ph-arrow-right transition-transform group-hover:translate-x-1"></i>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {featuredCocktails.map((cocktail) => (
                            <FrontendCocktailCard key={cocktail.id} cocktail={cocktail} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Brand Vision */}
            <section className="py-40 px-6 text-center">
                <div className="max-w-5xl mx-auto space-y-12">
                    <div className="w-20 h-20 bg-[#00d2ff]/10 rounded-[32px] border border-[#00d2ff]/20 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(0,210,255,0.1)]">
                        <i className="ph-fill ph-circles-three-plus text-[#00d2ff] text-4xl"></i>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight uppercase">
                        Mastering the drink <br className="hidden md:block" />
                        <span className="text-[#888c94]">One drop at a time.</span>
                    </h2>
                    <p className="text-[#888c94] text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                        Crafting cocktails is an art. We provide the precision engineering to make that art permanent. Join us as we redefine the home bar experience.
                    </p>
                    <div className="pt-8">
                        <Link href="/campaign" className="text-[#00d2ff] font-black uppercase tracking-[0.2em] text-sm hover:underline">
                            Learn about our Campaign &rarr;
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
