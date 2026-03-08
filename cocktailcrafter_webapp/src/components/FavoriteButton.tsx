"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface FavoriteButtonProps {
    cocktailId: string
    initialIsFavorite: boolean
}

export function FavoriteButton({ cocktailId, initialIsFavorite }: FavoriteButtonProps) {
    const { data: session } = useSession()
    const router = useRouter()
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
    const [isLoading, setIsLoading] = useState(false)

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!session) {
            alert("Please sign in to save favorites.")
            return
        }

        const oldFavorite = isFavorite
        setIsFavorite(!oldFavorite)
        setIsLoading(true)

        try {
            const res = await fetch(`/api/cocktails/${cocktailId}/favorite`, {
                method: "POST"
            })
            if (!res.ok) throw new Error("Failed to toggle favorite")
            const data = await res.json()
            setIsFavorite(data.isFavorite)
            router.refresh()
        } catch (err) {
            console.error(err)
            setIsFavorite(oldFavorite)
            alert("Could not update favorites. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={toggleFavorite}
            disabled={isLoading}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 backdrop-blur-md border border-white/10 group ${isFavorite
                    ? "bg-rose-500 text-white border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.4)]"
                    : "bg-black/20 text-white/40 hover:text-white hover:bg-black/40 hover:border-white/20"
                }`}
        >
            <i className={`ph-fill ph-heart text-2xl transition-transform group-hover:scale-110 ${isFavorite ? "text-white" : "text-white/40 group-hover:text-white"}`}></i>
        </button>
    )
}
