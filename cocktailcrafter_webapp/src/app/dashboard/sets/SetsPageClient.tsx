"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type SetItem = {
    id: string
    name: string
    description: string | null
    isPublic: boolean
    isOwner: boolean
    cocktailCount: number
    ownerName: string | null
    userId: string | null
}

export default function SetsPageClient({ sets }: { sets: SetItem[] }) {
    const router = useRouter()
    const [showCreate, setShowCreate] = useState(false)
    const [newName, setNewName] = useState("")
    const [newDesc, setNewDesc] = useState("")
    const [newPublic, setNewPublic] = useState(true)
    const [creating, setCreating] = useState(false)
    const [error, setError] = useState("")

    const mySets = sets.filter(s => s.isOwner)
    const publicSets = sets.filter(s => !s.isOwner)

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        setCreating(true)
        setError("")
        try {
            const res = await fetch("/api/sets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName, description: newDesc, isPublic: newPublic })
            })
            if (!res.ok) throw new Error(await res.text())
            setShowCreate(false)
            setNewName("")
            setNewDesc("")
            setNewPublic(true)
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setCreating(false)
        }
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Cocktail Sets</h1>
                    <p className="text-[#888c94]">Curate your own cocktail collections.</p>
                </div>
                <button
                    onClick={() => setShowCreate(true)}
                    className="flex items-center gap-2 bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 text-[#00d2ff] border border-[#00d2ff]/20 font-bold px-5 py-2.5 rounded-xl transition-all text-sm"
                >
                    <i className="ph-bold ph-plus"></i> New Set
                </button>
            </header>

            {/* My Sets */}
            {mySets.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-xs font-black uppercase tracking-widest text-[#888c94] mb-4 flex items-center gap-2">
                        <i className="ph-fill ph-user text-[#00d2ff]"></i> My Sets
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mySets.map(set => <SetCard key={set.id} set={set} />)}
                    </div>
                </section>
            )}

            {/* Public Sets */}
            {publicSets.length > 0 && (
                <section>
                    <h2 className="text-xs font-black uppercase tracking-widest text-[#888c94] mb-4 flex items-center gap-2">
                        <i className="ph-fill ph-globe text-[#888c94]"></i> Public Sets
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {publicSets.map(set => <SetCard key={set.id} set={set} />)}
                    </div>
                </section>
            )}

            {sets.length === 0 && (
                <div className="border border-dashed border-white/10 rounded-2xl p-16 text-center text-[#888c94]">
                    <i className="ph-thin ph-books text-5xl mb-4 block opacity-30"></i>
                    No sets yet. Create your first one!
                </div>
            )}

            {/* Create Modal */}
            {showCreate && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-[#1a1b21] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <i className="ph-fill ph-plus-circle text-[#00d2ff]"></i> New Set
                            </h3>
                            <button onClick={() => setShowCreate(false)} className="text-[#888c94] hover:text-white transition-colors">
                                <i className="ph-bold ph-x text-xl"></i>
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="p-6 space-y-4">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm">{error}</div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-[#888c94] mb-1.5">Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                    placeholder="e.g. Summer Vibes"
                                    className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none placeholder:text-white/20"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#888c94] mb-1.5">Description (optional)</label>
                                <textarea
                                    value={newDesc}
                                    onChange={e => setNewDesc(e.target.value)}
                                    placeholder="What's this set about?"
                                    rows={3}
                                    className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none placeholder:text-white/20"
                                />
                            </div>
                            {/* Public toggle */}
                            <div
                                onClick={() => setNewPublic(!newPublic)}
                                className="flex items-center justify-between bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 cursor-pointer hover:border-white/10 transition-colors"
                            >
                                <div>
                                    <p className="text-sm font-bold text-white">{newPublic ? "Public" : "Private"}</p>
                                    <p className="text-xs text-[#888c94]">{newPublic ? "Visible to everyone" : "Only visible to you"}</p>
                                </div>
                                <div className={`w-11 h-6 rounded-full transition-colors relative ${newPublic ? "bg-[#00d2ff]" : "bg-white/10"}`}>
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${newPublic ? "left-6" : "left-1"}`}></div>
                                </div>
                            </div>
                            <div className="pt-2 flex gap-3">
                                <button type="button" onClick={() => setShowCreate(false)}
                                    className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={creating}
                                    className="flex-1 bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5] hover:opacity-90 text-black font-bold py-3 rounded-xl transition-all disabled:opacity-50">
                                    {creating ? "Creating..." : "Create Set"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

function SetCard({ set }: { set: SetItem }) {
    return (
        <Link href={`/dashboard/sets/${set.id}`}
            className="bg-[#1a1b21]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 hover:border-[#00d2ff]/40 transition-all group cursor-pointer block">
            <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#00d2ff]/10 flex items-center justify-center border border-[#00d2ff]/20 text-[#00d2ff] group-hover:bg-[#00d2ff] group-hover:text-black transition-colors">
                    <i className="ph-fill ph-book-open-text text-2xl"></i>
                </div>
                <div className="flex items-center gap-2">
                    {set.isOwner && (
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                            set.isPublic
                                ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                                : "text-[#888c94] bg-white/5 border-white/10"
                        }`}>
                            {set.isPublic ? "Public" : "Private"}
                        </span>
                    )}
                    <span className="bg-white/5 text-[#888c94] text-xs font-bold px-3 py-1 rounded-full border border-white/10">
                        {set.cocktailCount} Cocktails
                    </span>
                </div>
            </div>
            <h3 className="text-xl font-bold mb-1 text-white group-hover:text-[#00d2ff] transition-colors">{set.name}</h3>
            {set.ownerName && !set.isOwner && (
                <p className="text-[10px] font-black uppercase tracking-widest text-[#888c94]/50 mb-1">by {set.ownerName}</p>
            )}
            <p className="text-[#888c94] text-sm line-clamp-2">{set.description || "No description provided."}</p>
        </Link>
    )
}
