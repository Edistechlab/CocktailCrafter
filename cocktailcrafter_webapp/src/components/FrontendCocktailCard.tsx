"use client"

import Link from "next/link"
import { GlassIcon } from "@/components/GlassIcon"
import { IceIcon } from "@/components/IceIcon"
import { useSession } from "next-auth/react"
import { useState } from "react"

import { TechniqueIcon } from "@/components/TechniqueIcon"

export function FrontendCocktailCard({ cocktail, alcoholFreeContext = false }: { cocktail: any, alcoholFreeContext?: boolean }) {
    const { data: session } = useSession()
    const [isFavorite, setIsFavorite] = useState(cocktail.favorites?.length > 0)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!session) {
            alert("Please sign in to save favorites.")
            return
        }

        const oldFavorite = isFavorite
        setIsFavorite(!isFavorite)
        setIsSubmitting(true)

        try {
            const res = await fetch(`/api/cocktails/${cocktail.id}/favorite`, {
                method: "POST"
            })
            if (!res.ok) throw new Error("Failed to toggle favorite")
            const data = await res.json()
            setIsFavorite(data.isFavorite)
        } catch (err) {
            console.error(err)
            setIsFavorite(oldFavorite)
            alert("Could not update favorites. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const ratings = cocktail.ratings || []
    const avgRating = ratings.length > 0
        ? ratings.reduce((acc: number, curr: any) => acc + curr.value, 0) / ratings.length
        : 0

    return (
        <Link href={`/cocktails/${cocktail.id}${alcoholFreeContext ? '?alcoholFree=1' : ''}`} className="block group">
            <div className={`bg-[#1a1b21]/40 backdrop-blur-md border border-white/5 rounded-[32px] overflow-hidden hover:border-[#00d2ff]/30 transition-all duration-500 flex flex-col h-full group-hover:-translate-y-2 shadow-2xl relative isolate ${isSubmitting ? 'opacity-70' : ''}`}>
                {/* Top Shine */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                <div className="h-[280px] shrink-0 bg-[#0b0c10] relative flex items-center justify-center border-b border-white/5 group/image overflow-hidden">
                    {cocktail.pictureUrl ? (
                        <img
                            src={cocktail.pictureUrl}
                            alt={cocktail.name}
                            className="w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700 ease-out"
                        />
                    ) : (
                        <div className="w-full h-full bg-[#1a1b21] flex items-center justify-center">
                            <i className="ph-fill ph-martini text-5xl text-white/5 group-hover:scale-110 group-hover:text-[#00d2ff]/20 transition-all duration-700"></i>
                        </div>
                    )}

                    {/* Rating Badge */}
                    {avgRating > 0 && (
                        <div className="absolute top-6 left-6 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl flex items-center gap-2 z-10">
                            <i className="ph-fill ph-star text-amber-500 text-sm"></i>
                            <span className="text-white font-black text-xs">{avgRating.toFixed(1)}</span>
                        </div>
                    )}

                    {/* Favorite Toggle Button */}
                    <button
                        className={`absolute top-6 right-6 w-10 h-10 backdrop-blur-md border rounded-full flex items-center justify-center transition-all duration-300 z-10 ${isFavorite
                            ? "bg-rose-500/20 border-rose-500/50 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                            : "bg-[#0b0c10]/60 border-white/10 text-white/40 hover:text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/30"
                            }`}
                        onClick={toggleFavorite}
                        disabled={isSubmitting}
                    >
                        <i className={`${isFavorite ? 'ph-fill' : 'ph-bold'} ph-heart text-lg`}></i>
                    </button>

                    {/* Bottom Gradient Overlay for Text */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/40 to-transparent"></div>

                    {/* Compact Name on Image */}
                    <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="text-2xl font-black text-white group-hover:text-[#00d2ff] transition-colors tracking-tight leading-tight uppercase italic drop-shadow-lg">
                            {cocktail.name}
                        </h3>
                    </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                    <p className="text-[#888c94] text-[13px] line-clamp-2 mb-6 leading-relaxed font-medium">
                        {cocktail.description || "A masterfully standardizied recipe from our library."}
                    </p>

                    <div className="mt-auto space-y-4">
                        <div className="flex flex-wrap gap-2">
                            {cocktail.tastes && cocktail.tastes.length > 0 && cocktail.tastes.slice(0, 3).map((t: any) => (
                                <span key={t.id} className="bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/10 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
                                    {t.name}
                                </span>
                            ))}
                        </div>

                        <div className="flex gap-4 pt-4 border-t border-white/5">
                            {cocktail.glasses?.[0] && (
                                <div className="flex items-center gap-2 text-[#888c94] text-[10px] font-black uppercase tracking-widest">
                                    <GlassIcon type={cocktail.glasses[0].name} className="w-4 h-4 text-[#00d2ff]/50" />
                                    <span>{cocktail.glasses[0].name.split('/')[0].trim()}</span>
                                </div>
                            )}
                            {cocktail.ices?.[0] && (
                                <div className="flex items-center gap-2 text-[#888c94] text-[10px] font-black uppercase tracking-widest">
                                    <IceIcon type={cocktail.ices[0].name} className="w-4 h-4 text-[#00d2ff]/50" />
                                    <span>{cocktail.ices[0].name.split('/')[0].trim()}</span>
                                </div>
                            )}
                            {cocktail.techniques?.[0] && (
                                <div className="flex items-center gap-2 text-[#888c94] text-[10px] font-black uppercase tracking-widest">
                                    <TechniqueIcon type={cocktail.techniques[0].name} className="w-4 h-4 text-[#00d2ff]/50" />
                                    <span>{cocktail.techniques[0].name.split('/')[0].trim()}</span>
                                </div>
                            )}
                        </div>

                        {/* Automation Level Gauge */}
                        <div className="pt-4 flex items-center justify-between border-t border-white/5">
                            <span className="text-[9px] font-black uppercase tracking-widest text-[#888c94]">Automation-Level</span>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((level) => {
                                    const isActive = ((cocktail as any).automationLevel || 0) >= level;
                                    return (
                                        <div
                                            key={level}
                                            className={`w-4 h-1 rounded-full transition-all duration-500 ${isActive ? 'bg-[#888c94] shadow-[0_0_8px_rgba(136,140,148,0.2)]' : 'bg-white/5'
                                                }`}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
