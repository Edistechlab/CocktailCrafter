"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GlassIcon } from "@/components/GlassIcon"
import { IceIcon } from "@/components/IceIcon"

type Cocktail = {
    id: string
    name: string
    description: string | null
    pictureUrl: string | null
    glasses: { id: string; name: string }[]
    ices: { id: string; name: string }[]
}

export default function SetDetailsClient({
    setId,
    initialName,
    initialDescription,
    initialIsPublic,
    cocktails,
    allCocktails,
    isOwner,
}: {
    setId: string
    initialName: string
    initialDescription: string
    initialIsPublic: boolean
    cocktails: Cocktail[]
    allCocktails: { id: string; name: string; pictureUrl: string | null }[]
    isOwner: boolean
}) {
    const router = useRouter()

    // Edit state
    const [editMode, setEditMode] = useState(false)
    const [editName, setEditName] = useState(initialName)
    const [editDescription, setEditDescription] = useState(initialDescription)
    const [editIsPublic, setEditIsPublic] = useState(initialIsPublic)
    const [saving, setSaving] = useState(false)

    // Add cocktail state
    const [search, setSearch] = useState("")
    const [searchFocused, setSearchFocused] = useState(false)
    const [addingId, setAddingId] = useState("")
    const [addError, setAddError] = useState("")

    // Remove / delete state
    const [removingId, setRemovingId] = useState("")
    const [deleting, setDeleting] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)

    const existingIds = new Set(cocktails.map(c => c.id))
    const availableCocktails = allCocktails
        .filter(c => !existingIds.has(c.id))
        .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

    const saveEdit = async () => {
        if (!editName.trim()) return
        setSaving(true)
        try {
            const res = await fetch(`/api/sets/${setId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: editName, description: editDescription, isPublic: editIsPublic }),
            })
            if (!res.ok) throw new Error("Failed to save")
            setEditMode(false)
            router.refresh()
        } finally {
            setSaving(false)
        }
    }

    const deleteSet = async () => {
        setDeleting(true)
        try {
            const res = await fetch(`/api/sets/${setId}`, { method: "DELETE" })
            if (!res.ok) throw new Error("Failed to delete")
            router.push("/dashboard/sets")
        } finally {
            setDeleting(false)
        }
    }

    const addCocktail = async (cocktailId: string) => {
        setAddingId(cocktailId)
        setAddError("")
        try {
            const res = await fetch(`/api/sets/${setId}/cocktails`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cocktailId }),
            })
            if (!res.ok) {
                const msg = await res.text()
                setAddError(msg || "Failed to add cocktail")
                return
            }
            setSearch("")
            router.refresh()
        } finally {
            setAddingId("")
        }
    }

    const removeCocktail = async (cocktailId: string) => {
        setRemovingId(cocktailId)
        try {
            const res = await fetch(`/api/sets/${setId}/cocktails`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cocktailId }),
            })
            if (!res.ok) throw new Error("Failed to remove")
            router.refresh()
        } finally {
            setRemovingId("")
        }
    }

    return (
        <>
            {/* Header */}
            <header className="mb-10">
                {editMode ? (
                    <div className="space-y-4 bg-[#1a1b21] border border-white/10 rounded-2xl p-6">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-[#888c94] mb-2 block">Set Name</label>
                            <input
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                                className="w-full bg-[#0b0c10]/50 border border-white/10 rounded-xl px-4 py-3 text-white text-xl font-bold focus:ring-1 focus:ring-[#00d2ff] outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-[#888c94] mb-2 block">Description</label>
                            <textarea
                                value={editDescription}
                                onChange={e => setEditDescription(e.target.value)}
                                rows={2}
                                className="w-full bg-[#0b0c10]/50 border border-white/10 rounded-xl px-4 py-3 text-white resize-none focus:ring-1 focus:ring-[#00d2ff] outline-none"
                            />
                        </div>
                        {/* Public toggle */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-white">Public Set</p>
                                <p className="text-xs text-[#888c94]">Visible to all users and the mobile app</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEditIsPublic(v => !v)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${editIsPublic ? "bg-[#00d2ff]" : "bg-white/10"}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${editIsPublic ? "translate-x-6" : "translate-x-1"}`} />
                            </button>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={saveEdit}
                                disabled={saving}
                                className="bg-[#00d2ff] hover:bg-[#00b8d9] text-black font-bold px-6 py-2 rounded-xl transition-colors text-sm"
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>
                            <button
                                onClick={() => { setEditMode(false); setEditName(initialName); setEditDescription(initialDescription); setEditIsPublic(initialIsPublic) }}
                                className="bg-white/5 hover:bg-white/10 text-white font-bold px-6 py-2 rounded-xl transition-colors text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
                                <i className="ph-fill ph-book-open-text text-[#00d2ff]"></i>
                                {initialName}
                            </h1>
                            {initialDescription && <p className="text-[#888c94] max-w-2xl">{initialDescription}</p>}
                            <div className="mt-2">
                                <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${initialIsPublic ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-[#888c94]"}`}>
                                    <i className={`ph-fill ${initialIsPublic ? "ph-globe" : "ph-lock"}`}></i>
                                    {initialIsPublic ? "Public" : "Private"}
                                </span>
                            </div>
                        </div>
                        {isOwner && (
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={() => setEditMode(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors text-sm font-semibold"
                                >
                                    <i className="ph-bold ph-pencil"></i> Edit
                                </button>
                                {confirmDelete ? (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={deleteSet}
                                            disabled={deleting}
                                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors text-sm font-bold"
                                        >
                                            {deleting ? "Deleting..." : "Confirm Delete"}
                                        </button>
                                        <button
                                            onClick={() => setConfirmDelete(false)}
                                            className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setConfirmDelete(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors text-sm font-semibold"
                                    >
                                        <i className="ph-bold ph-trash"></i> Delete
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </header>

            {/* Cocktail Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cocktails.length === 0 ? (
                    <div className="col-span-full border border-dashed border-white/20 rounded-2xl p-12 text-center text-[#888c94]">
                        No cocktails in this set yet.
                    </div>
                ) : (
                    cocktails.map(cocktail => (
                        <div key={cocktail.id} className="bg-[#1a1b21]/80 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all group relative">
                            <div className="h-40 bg-[#0b0c10] relative flex items-center justify-center border-b border-white/5">
                                {cocktail.pictureUrl ? (
                                    <img src={cocktail.pictureUrl} alt={cocktail.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                ) : (
                                    <i className="ph-thin ph-image text-5xl text-white/10"></i>
                                )}
                                {isOwner && (
                                    <button
                                        onClick={() => removeCocktail(cocktail.id)}
                                        disabled={removingId === cocktail.id}
                                        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-black/60 hover:bg-red-500/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                        title="Remove from set"
                                    >
                                        {removingId === cocktail.id
                                            ? <i className="ph-bold ph-spinner animate-spin text-sm"></i>
                                            : <i className="ph-bold ph-x text-sm"></i>
                                        }
                                    </button>
                                )}
                            </div>
                            <div className="p-5">
                                <h3 className="text-lg font-bold mb-1 truncate">{cocktail.name}</h3>
                                <p className="text-[#888c94] text-xs line-clamp-2 h-8 mb-3">{cocktail.description}</p>
                                <div className="space-y-1">
                                    {cocktail.glasses.map(g => (
                                        <div key={g.id} className="flex items-center gap-1.5 text-xs text-white/50">
                                            <GlassIcon type={g.name} className="w-4 h-4" />
                                            {g.name}
                                        </div>
                                    ))}
                                    {cocktail.ices.map(i => (
                                        <div key={i.id} className="flex items-center gap-1.5 text-xs text-white/50">
                                            <IceIcon type={i.name} className="w-4 h-4" />
                                            {i.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Cocktail panel — owners only */}
            {isOwner && (
                <div className="bg-[#1a1b21]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 mt-8">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <i className="ph-fill ph-plus-circle text-[#00d2ff]"></i>
                        Add Cocktail to Set
                    </h3>

                    {addError && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm mb-4">{addError}</div>
                    )}

                    <div className="relative mb-6">
                        <i className="ph-bold ph-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[#888c94]"></i>
                        <input
                            type="text"
                            placeholder="Search your cocktail library..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                            className="w-full bg-[#0b0c10]/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none"
                        />
                    </div>

                    {searchFocused && availableCocktails.length > 0 && (
                        <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                            {(search ? availableCocktails : availableCocktails.slice(0, 10)).map(cocktail => (
                                <div key={cocktail.id} className="flex items-center justify-between p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-3">
                                        {cocktail.pictureUrl ? (
                                            <img src={cocktail.pictureUrl} alt={cocktail.name} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                                        ) : (
                                            <div className="w-9 h-9 bg-[#0b0c10] rounded-lg border border-white/10 flex items-center justify-center shrink-0">
                                                <i className="ph-thin ph-martini text-[#888c94]"></i>
                                            </div>
                                        )}
                                        <span className="font-medium text-sm">{cocktail.name}</span>
                                    </div>
                                    <button
                                        onClick={() => addCocktail(cocktail.id)}
                                        disabled={addingId === cocktail.id}
                                        className="text-sm bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 text-[#00d2ff] font-bold py-1.5 px-4 rounded-lg transition-colors min-w-[80px] shrink-0"
                                    >
                                        {addingId === cocktail.id ? "Adding..." : "Add"}
                                    </button>
                                </div>
                            ))}
                            {!search && availableCocktails.length > 10 && (
                                <p className="text-center text-xs text-[#888c94] pt-1">
                                    {availableCocktails.length - 10} more — type to filter
                                </p>
                            )}
                        </div>
                    )}

                    {searchFocused && search && availableCocktails.length === 0 && (
                        <div className="text-center text-[#888c94] py-4 text-sm">
                            No matching cocktails found that aren&apos;t already in this set.
                        </div>
                    )}
                </div>
            )}
        </>
    )
}
