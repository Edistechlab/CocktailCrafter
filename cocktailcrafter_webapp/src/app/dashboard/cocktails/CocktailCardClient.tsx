"use client"
import { GlassIcon } from "@/components/GlassIcon"
import { IceIcon } from "@/components/IceIcon"
import { useRouter } from "next/navigation"
import { useState } from "react"


export default function CocktailCardClient({ cocktail, canEdit }: { cocktail: any; canEdit: boolean }) {
    const router = useRouter()

    const handleEdit = () => {
        if (canEdit) router.push(`/dashboard/cocktails/${cocktail.id}/edit`)
    }

    const [showConfirm, setShowConfirm] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setShowConfirm(true)
    }

    const confirmDelete = async (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsDeleting(true)
        try {
            const res = await fetch(`/api/cocktails/${cocktail.id}`, {
                method: 'DELETE'
            })
            if (res.ok) {
                router.refresh()
            } else {
                alert("Failed to delete cocktail.")
                setIsDeleting(false)
                setShowConfirm(false)
            }
        } catch (err) {
            console.error(err)
            setIsDeleting(false)
            setShowConfirm(false)
        }
    }

    const cancelDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        setShowConfirm(false)
    }

    return (
        <div
            className={`bg-[#1a1b21]/80 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all group relative flex flex-col h-full ${canEdit ? "cursor-pointer" : ""}`}
            onClick={handleEdit}
        >
            <div className="h-[243px] shrink-0 bg-[#0b0c10] relative flex items-center justify-center border-b border-white/5">
                {cocktail.pictureUrl ? (
                    <img src={cocktail.pictureUrl} alt={cocktail.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                    <i className="ph-thin ph-image text-5xl text-white/10"></i>
                )}
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-bold mb-1">{cocktail.name}</h3>

                <div className="flex items-center justify-between mb-3 text-[11px] text-[#888c94] uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                        <span>{new Date(cocktail.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        {cocktail.user && (
                            <>
                                <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                                <span className="flex items-center gap-1">
                                    <i className="ph-fill ph-user"></i>
                                    {cocktail.user.role === "SUPER_ADMIN" ? "CocktailCrafter" : (cocktail.user.nickname || cocktail.user.firstName || "Creator")}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                <p className="text-[#888c94] text-sm line-clamp-2 mb-4">
                    {cocktail.description || "No description provided."}
                </p>

                <div className="flex items-end justify-between mt-auto gap-2">
                    <div className="flex flex-wrap gap-2 text-xs">
                        {cocktail.tastes && cocktail.tastes.length > 0 && cocktail.tastes.map((t: any) => (
                            <span key={t.id} className="bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/20 px-2.5 py-1 rounded-md">
                                {t.name}
                            </span>
                        ))}
                        {cocktail.glasses && cocktail.glasses.length > 0 && cocktail.glasses.map((g: any) => (
                            <span key={g.id} className="bg-white/5 text-white/70 border border-white/10 px-2.5 py-1 rounded-md flex items-center gap-1">
                                <GlassIcon type={g.name} className="w-4 h-4" /> {g.name}
                            </span>
                        ))}
                        {cocktail.ices && cocktail.ices.length > 0 && cocktail.ices.map((i: any) => (
                            <span key={i.id} className="bg-white/5 text-white/70 border border-white/10 px-2.5 py-1 rounded-md flex items-center gap-1">
                                <IceIcon type={i.name} className="w-4 h-4" /> {i.name}
                            </span>
                        ))}
                    </div>

                    {canEdit && (
                        <button
                            onClick={handleDeleteClick}
                            className="text-[#ff6b6b]/60 hover:text-[#ff4d4d] hover:bg-[#ff6b6b]/10 w-8 h-8 rounded flex items-center justify-center transition-colors shrink-0 mb-0.5"
                            title="Delete Cocktail"
                        >
                            <i className="ph-bold ph-trash text-lg"></i>
                        </button>
                    )}
                </div>
            </div>

            {/* Custom Confirm Dialog Overlay */}
            {showConfirm && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-center cursor-default" onClick={cancelDelete}>
                    <div className="bg-[#1a1b21] p-6 rounded-2xl border border-white/10 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        <i className="ph-fill ph-warning-circle text-4xl text-red-500 mb-4 inline-block"></i>
                        <h4 className="text-xl font-bold mb-2 text-white">Delete "{cocktail.name}"?</h4>
                        <p className="text-[#888c94] text-sm mb-6">This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={cancelDelete} disabled={isDeleting} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors disabled:opacity-50">
                                Cancel
                            </button>
                            <button onClick={confirmDelete} disabled={isDeleting} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors disabled:opacity-50">
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
