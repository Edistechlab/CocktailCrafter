import { prisma } from "@/lib/prisma"
import { GlassIcon } from "@/components/GlassIcon"

export const dynamic = 'force-dynamic'

export const metadata = {
    title: "Glassware | CocktailCrafter",
    description: "Discover our professional glassware collection – the perfect stage for every craft cocktail.",
}

export default async function GlasswarePage() {
    const glasses = await prisma.glassType.findMany({
        orderBy: { name: 'asc' }
    })

    return (
        <div className="relative pb-32">
            {/* Page Header */}
            <div className="pt-32 pb-16 px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/20 text-[#00d2ff] text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                        <i className="ph-fill ph-brandy"></i>
                        The Vessel Gallery
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 leading-none">
                        Essential <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5]">Glassware.</span>
                    </h1>
                    <p className="text-[#888c94] max-w-2xl mx-auto text-sm md:text-base font-medium leading-relaxed">
                        Every masterpiece needs the right frame. Explore our curated selection of professional
                        glassware, each designed to enhance the aroma, temperature, and visual allure of your cocktail.
                    </p>
                </div>

                {/* Glow behind header */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#00d2ff]/5 blur-[120px] rounded-full -z-10"></div>
            </div>

            {/* Grid Container */}
            <div className="px-6 md:px-12 max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {glasses.map((glass) => (
                    <div
                        key={glass.id}
                        className="group/card flex flex-col bg-[#0b0c10]/40 border border-white/5 rounded-[40px] overflow-hidden backdrop-blur-xl transition-all duration-500 hover:bg-[#0b0c10]/60 hover:border-white/10 hover:translate-y-[-4px] shadow-2xl"
                    >
                        {/* Top: 1:1 Image */}
                        <div className="relative aspect-square w-full overflow-hidden border-b border-white/5">
                            {glass.pictureUrl ? (
                                <img
                                    src={glass.pictureUrl}
                                    alt={glass.name}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-white/5">
                                    <GlassIcon type={glass.name} className="w-20 h-20 text-white/10" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10]/80 via-transparent to-transparent opacity-60"></div>

                            {/* Simple Label Overlay */}
                            <div className="absolute bottom-6 left-8">
                                <div className="text-[10px] font-black uppercase text-[#00d2ff] tracking-[0.3em] mb-1 opacity-60">Vessel Type</div>
                                <div className="text-white text-2xl font-black italic tracking-tighter">{glass.name.split(' / ')[0]}</div>
                            </div>
                        </div>

                        {/* Bottom: Info Tile */}
                        <div className="p-8 space-y-6 flex-1 flex flex-col">
                            <div className="space-y-3 relative">
                                <div className="flex items-center justify-between">
                                    <div className="w-10 h-10 bg-[#00d2ff]/10 rounded-xl flex items-center justify-center border border-[#00d2ff]/20">
                                        <GlassIcon type={glass.name} className="w-6 h-6 text-[#00d2ff]" />
                                    </div>
                                    <div className="text-[10px] font-black uppercase text-[#888c94] tracking-widest">{glass.volume}ml</div>
                                </div>
                                <h2 className="text-xl font-black text-white italic tracking-tight">{glass.name}</h2>
                                <p className="text-[#888c94] text-sm leading-relaxed font-medium line-clamp-3">
                                    {glass.description || "Essential professional glassware for the modern signature cocktail service."}
                                </p>
                            </div>

                            {glass.instructions && (
                                <div className="mt-auto pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-2 text-[9px] font-black uppercase text-[#00d2ff] tracking-widest mb-2">
                                        <i className="ph-fill ph-info text-sm"></i>
                                        Care Note
                                    </div>
                                    <p className="text-white/40 text-[11px] leading-relaxed italic line-clamp-2">
                                        "{glass.instructions}"
                                    </p>
                                </div>
                            )}

                            {glass.affiliateLink && (
                                <a
                                    href={glass.affiliateLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-[#ffb84d]/10 hover:border-[#ffb84d]/40 text-[#888c94] hover:text-[#ffb84d] hover:shadow-[0_0_15px_rgba(255,184,77,0.15)] font-bold text-[10px] uppercase tracking-widest transition-all"
                                >
                                    <i className="ph-bold ph-shopping-bag text-sm"></i>
                                    View on Amazon
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Disclaimer */}
            <div className="mt-20 text-center text-[#888c94] text-[11px] max-w-3xl mx-auto px-6 font-medium leading-relaxed">
                * Please note: The links provided above are affiliate links. If you choose to purchase through these links,
                we may earn a small commission at no extra cost to you. This helps support CocktailCrafter and allows us to keep
                improving the platform. Thank you!
            </div>

            {/* Global Background Glows */}
            <div className="fixed top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#00d2ff]/5 blur-[120px] rounded-full pointer-events-none -z-0"></div>
            <div className="fixed bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#3a7bd5]/3 blur-[120px] rounded-full pointer-events-none -z-0"></div>
        </div>
    )
}
