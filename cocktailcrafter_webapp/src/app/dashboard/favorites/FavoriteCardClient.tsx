"use client"

import { GlassIcon } from "@/components/GlassIcon"
import { IceIcon } from "@/components/IceIcon"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { TechniqueIcon } from "@/components/TechniqueIcon"

interface FavoriteCardClientProps {
    cocktail: any
    onRemove: () => void
}

export default function FavoriteCardClient({ cocktail, onRemove }: FavoriteCardClientProps) {
    const router = useRouter()
    const [isRemoving, setIsRemoving] = useState(false)

    const handleView = () => {
        router.push(`/cocktails/${cocktail.id}`)
    }

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsRemoving(true)

        try {
            const res = await fetch(`/api/cocktails/${cocktail.id}/favorite`, {
                method: "POST"
            })
            if (res.ok) {
                onRemove()
            } else {
                alert("Failed to remove from favorites.")
                setIsRemoving(false)
            }
        } catch (err) {
            console.error(err)
            setIsRemoving(false)
        }
    }

    const ratings = cocktail.ratings || []
    const avgRating = ratings.length > 0
        ? ratings.reduce((acc: number, curr: any) => acc + curr.value, 0) / ratings.length
        : 0

    return (
        <div
            onClick={handleView}
            className={`bg-[#1a1b21]/80 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all group cursor-pointer relative flex flex-col h-full ${isRemoving ? 'opacity-50 scale-95' : ''}`}
        >
            {/* Rating Badge */}
            {avgRating > 0 && (
                <div className="absolute top-4 left-4 z-10 px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg flex items-center gap-1.5">
                    <i className="ph-fill ph-star text-amber-500 text-xs"></i>
                    <span className="text-white font-black text-[10px]">{avgRating.toFixed(1)}</span>
                </div>
            )}

            {/* Favorite Indicator */}
            <button
                onClick={toggleFavorite}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-rose-500 hover:scale-110 transition-all"
            >
                <i className="ph-fill ph-heart text-xl"></i>
            </button>

            <div className="h-[200px] shrink-0 bg-[#0b0c10] relative flex items-center justify-center border-b border-white/5">
                {cocktail.pictureUrl ? (
                    <img src={cocktail.pictureUrl} alt={cocktail.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                    <i className="ph-thin ph-image text-5xl text-white/10"></i>
                )}
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-bold mb-1 group-hover:text-[#00d2ff] transition-colors">{cocktail.name}</h3>

                <p className="text-[#888c94] text-xs line-clamp-2 mb-4 italic">
                    {cocktail.description || "No description provided."}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                    {cocktail.tastes?.slice(0, 2).map((t: any) => (
                        <span key={t.id} className="text-[10px] font-black uppercase tracking-widest text-[#00d2ff] bg-[#00d2ff]/5 px-2 py-0.5 rounded-md border border-[#00d2ff]/10">
                            {t.name}
                        </span>
                    ))}
                    <div className="ml-auto flex items-center gap-3">
                        {cocktail.techniques?.[0] && (
                            <div className="flex items-center gap-1.5">
                                <TechniqueIcon type={cocktail.techniques[0].name} className="w-3.5 h-3.5 text-[#888c94]/50" />
                            </div>
                        )}
                        <div className="flex items-center gap-1.5">
                            <GlassIcon type={cocktail.glasses?.[0]?.name || ""} className="w-3.5 h-3.5 text-[#888c94]/50" />
                            <span className="text-[9px] text-[#888c94] font-black uppercase tracking-widest">{cocktail.glasses?.[0]?.name.split('/')[0]}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
