"use client"

import { useState, useMemo, useRef, useEffect } from "react"

export type BottleOption = {
    id: string
    name: string
    category?: string | null
    type?: string | null
    alcoholContent?: number | null
}

interface Props {
    bottles: BottleOption[]
    onSelect: (bottle: BottleOption) => void
    onClose: () => void
    title?: string
}

export function BottlePickerModal({ bottles, onSelect, onClose, title = "Select Ingredient" }: Props) {
    const [search, setSearch] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [alcoholFilter, setAlcoholFilter] = useState<"all" | "soft" | "boozy">("all")
    const searchRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        searchRef.current?.focus()
        const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
        document.addEventListener("keydown", handleKey)
        return () => document.removeEventListener("keydown", handleKey)
    }, [onClose])

    const categories = useMemo(() => {
        const cats = new Set(bottles.map(b => b.category).filter(Boolean))
        return Array.from(cats).sort() as string[]
    }, [bottles])

    const filtered = useMemo(() => {
        return bottles.filter(b => {
            const matchesSearch = !search || b.name.toLowerCase().includes(search.toLowerCase())
            const matchesCategory = !selectedCategory || b.category === selectedCategory
            const matchesAlcohol = alcoholFilter === "all" ? true
                : alcoholFilter === "soft" ? (b.alcoholContent ?? 1) === 0
                : (b.alcoholContent ?? 1) > 0
            return matchesSearch && matchesCategory && matchesAlcohol
        })
    }, [bottles, search, selectedCategory, alcoholFilter])

    const showCustomOption = search.trim().length > 0 && !filtered.some(b => b.name.toLowerCase() === search.trim().toLowerCase())

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
            <div
                className="relative z-10 w-full sm:max-w-2xl bg-[#14151a] border border-white/10 rounded-t-[32px] sm:rounded-[32px] shadow-2xl flex flex-col max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/5 shrink-0">
                    <h2 className="text-[13px] font-black uppercase tracking-[0.3em] text-white flex items-center gap-3">
                        <i className="ph-fill ph-flask text-[#00d2ff]"></i>
                        {title}
                    </h2>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-[#888c94] hover:text-white transition-colors">
                        <i className="ph-bold ph-x text-sm"></i>
                    </button>
                </div>

                {/* Filters */}
                <div className="px-4 py-3 border-b border-white/5 space-y-3 shrink-0">
                    {/* Search */}
                    <div className="relative">
                        <i className="ph-bold ph-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[#00d2ff]/60 text-sm pointer-events-none"></i>
                        <input
                            ref={searchRef}
                            type="text"
                            placeholder="Search ingredients..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-[#0b0c10]/60 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm placeholder:text-[#888c94] focus:outline-none focus:border-[#00d2ff]/40"
                        />
                        {search && (
                            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888c94] hover:text-white">
                                <i className="ph-bold ph-x-circle text-sm"></i>
                            </button>
                        )}
                    </div>

                    {/* Alcohol + Category filters */}
                    <div className="flex gap-2 flex-wrap">
                        {(["all", "soft", "boozy"] as const).map(f => (
                            <button key={f} onClick={() => setAlcoholFilter(f)}
                                className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${
                                    alcoholFilter === f
                                        ? f === "soft" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                          : f === "boozy" ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                                          : "bg-[#00d2ff]/20 text-[#00d2ff] border-[#00d2ff]/30"
                                        : "bg-white/5 text-[#888c94] border-white/10 hover:text-white"
                                }`}>
                                {f === "all" ? "All" : f === "soft" ? "Soft" : "Boozy"}
                            </button>
                        ))}

                        <div className="w-px bg-white/10 mx-1"></div>

                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${
                                !selectedCategory ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : "bg-white/5 text-[#888c94] border-white/10 hover:text-white"
                            }`}
                        >All Types</button>
                        {categories.map(cat => (
                            <button key={cat} onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                                className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${
                                    selectedCategory === cat ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : "bg-white/5 text-[#888c94] border-white/10 hover:text-white hover:border-white/20"
                                }`}
                            >{cat}</button>
                        ))}
                    </div>
                </div>

                {/* Bottle list */}
                <div className="overflow-y-auto flex-1 p-3 space-y-0.5">
                    {showCustomOption && (
                        <button
                            onClick={() => { onSelect({ id: "", name: search.trim() }); onClose() }}
                            className="w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-[#00d2ff]/30 hover:bg-[#00d2ff]/5 transition-all text-left group mb-2"
                        >
                            <i className="ph-bold ph-plus-circle text-[#00d2ff] text-base shrink-0"></i>
                            <div>
                                <div className="text-[#00d2ff] font-bold text-sm">Use &ldquo;{search.trim()}&rdquo;</div>
                                <div className="text-[11px] text-[#888c94]">Custom ingredient (not in database)</div>
                            </div>
                        </button>
                    )}

                    {filtered.length === 0 && !showCustomOption ? (
                        <div className="text-center py-12 text-[#888c94] text-sm">No ingredients found</div>
                    ) : filtered.map(bottle => (
                        <button
                            key={bottle.id}
                            onClick={() => { onSelect(bottle); onClose() }}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-[#00d2ff]/8 border border-transparent hover:border-[#00d2ff]/15 transition-all text-left group"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="text-white font-semibold text-sm group-hover:text-[#00d2ff] transition-colors truncate">{bottle.name}</div>
                                {bottle.type && <div className="text-[11px] text-[#888c94] mt-0.5 truncate">{bottle.type}</div>}
                            </div>
                            <div className="flex items-center gap-3 shrink-0 ml-3">
                                {bottle.category && (
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#888c94]/60 hidden sm:block">{bottle.category}</span>
                                )}
                                <span className={`text-[11px] font-black px-2 py-0.5 rounded-md min-w-[40px] text-center ${
                                    (bottle.alcoholContent ?? 1) === 0
                                        ? "text-emerald-400 bg-emerald-500/10"
                                        : "text-[#888c94] bg-white/5"
                                }`}>
                                    {bottle.alcoholContent != null ? `${bottle.alcoholContent}%` : "—"}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="px-6 py-3 border-t border-white/5 shrink-0">
                    <p className="text-[10px] text-[#888c94] text-center">{filtered.length} ingredient{filtered.length !== 1 ? "s" : ""} found</p>
                </div>
            </div>
        </div>
    )
}
