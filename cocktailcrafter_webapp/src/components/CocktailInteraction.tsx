"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface CocktailInteractionProps {
    cocktailId: string
    initialAverageRating?: number
    initialRatingsCount?: number
    initialUserRating?: number
    initialIsFavorite?: boolean
}

export function CocktailInteraction({
    cocktailId,
    initialAverageRating = 0,
    initialRatingsCount = 0,
    initialUserRating = 0,
    initialIsFavorite = false
}: CocktailInteractionProps) {
    const { data: session } = useSession()
    const router = useRouter()
    const [userRating, setUserRating] = useState(initialUserRating)
    const [hoverRating, setHoverRating] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleRating = async (value: number) => {
        if (!session) {
            alert("Please sign in to rate cocktails.")
            return
        }

        const oldRating = userRating
        setUserRating(value)
        setIsSubmitting(true)

        try {
            const res = await fetch(`/api/cocktails/${cocktailId}/rating`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ value })
            })
            if (!res.ok) throw new Error("Failed to save rating")
            router.refresh()
        } catch (err) {
            console.error(err)
            setUserRating(oldRating)
            alert("Could not save rating. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }


    return (
        <div className="space-y-12 max-w-2xl mx-auto">

            {/* Rating Section */}
            <div className={`bg-white/5 border border-white/5 rounded-[40px] p-8 space-y-8 relative overflow-hidden group/rating transition-opacity ${isSubmitting ? 'opacity-50' : 'opacity-100'}`}>
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00d2ff]/5 blur-3xl -z-10 group-hover/rating:bg-[#00d2ff]/10 transition-colors"></div>

                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h4 className="text-xs font-black uppercase tracking-widest text-[#00d2ff]">Community Consensus</h4>
                        <p className="text-[10px] text-[#888c94] font-bold uppercase tracking-widest">
                            {initialRatingsCount} {initialRatingsCount === 1 ? 'Review' : 'Reviews'} recorded
                        </p>
                    </div>
                    <div className="flex items-end gap-1">
                        <span className="text-3xl font-black text-white leading-none">
                            {initialAverageRating > 0 ? initialAverageRating.toFixed(1) : "0.0"}
                        </span>
                        <span className="text-xs font-bold text-[#888c94]/40 uppercase tracking-widest mb-1">/ 5.0</span>
                    </div>
                </div>

                {/* Average Stars Visualization */}
                <div className="flex gap-1.5 opacity-50">
                    {[1, 2, 3, 4, 5].map((starIdx) => (
                        <div key={starIdx} className="relative w-6 h-6 flex items-center justify-center">
                            <i className="ph-fill ph-star text-lg text-white/5 absolute"></i>
                            {initialAverageRating >= starIdx - 0.5 && (
                                <i
                                    className="ph-fill ph-star text-lg text-[#00d2ff] absolute"
                                    style={{
                                        clipPath: initialAverageRating < starIdx ? 'inset(0 50% 0 0)' : 'none'
                                    }}
                                ></i>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-4 pt-6 border-t border-white/5">
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#888c94]">Your Personal Vote</span>
                        <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map((starIdx) => {
                                const displayRating = hoverRating || userRating;
                                return (
                                    <div key={starIdx} className="relative w-8 h-8 flex items-center justify-center">
                                        <i className="ph-fill ph-star text-2xl text-white/5 absolute"></i>
                                        {displayRating >= starIdx - 0.5 && (
                                            <i
                                                className="ph-fill ph-star text-2xl text-amber-500 absolute transition-all duration-300"
                                                style={{
                                                    clipPath: displayRating < starIdx ? 'inset(0 50% 0 0)' : 'none'
                                                }}
                                            ></i>
                                        )}
                                        {!isSubmitting && (
                                            <div className="absolute inset-0 flex z-20">
                                                <button
                                                    className="w-1/2 h-full cursor-pointer"
                                                    onMouseEnter={() => setHoverRating(starIdx - 0.5)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    onClick={() => handleRating(starIdx - 0.5)}
                                                />
                                                <button
                                                    className="w-1/2 h-full cursor-pointer"
                                                    onMouseEnter={() => setHoverRating(starIdx)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    onClick={() => handleRating(starIdx)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                    <p className="text-[#888c94] text-[10px] font-black uppercase tracking-[0.2em]">
                        {!session ? "Sign in to leave your mark" : (userRating === 0 ? "Be the first to leave a mark" : "Your signature is recorded")}
                    </p>
                </div>
            </div>
        </div>
    )
}
