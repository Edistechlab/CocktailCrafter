"use client"

import { useState, useMemo } from "react"
import AddBottleClient from "../catalogs/AddBottleClient"
import EditBottleClient from "../catalogs/EditBottleClient"

interface Bottle {
    id: string
    name: string
    category: string | null
    type: string | null
    productName: string | null
    description: string | null
    aroma: string | null
    tasteProfile: string | null
    texture: string | null
    alcoholContent: number | null
    sugarContent: number | null
    acidity: number | null
    parentId: string | null
    alternativeId: string | null
    nonAlcoholicId: string | null
    country: string | null
    affiliateLink: string | null
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

export default function BottlesManager({ initialBottles }: { initialBottles: any[] }) {
    const [search, setSearch] = useState("")
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
    const [showNonAlcoholicOnly, setShowNonAlcoholicOnly] = useState(false)
    const [showAlcoholicOnly, setShowAlcoholicOnly] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [selectedType, setSelectedType] = useState<string | null>(null)

    const bottles = useMemo(() => Array.isArray(initialBottles) ? initialBottles as Bottle[] : [], [initialBottles])

    // Pre-calculate which bottles have children (= are category/type nodes, not leaf products)
    const parentIds = useMemo(() => {
        const ids = new Set<string>()
        bottles.forEach(b => { if (b.parentId) ids.add(b.parentId) })
        return ids
    }, [bottles])

    // Category filter options: unique non-null category strings, excluding "*Alternative" categories
    const categories = useMemo(() =>
        [...new Set(bottles.map(b => b.category).filter(Boolean) as string[])]
            .filter(c => !c.endsWith("Alternative"))
            .sort(),
        [bottles]
    )

    // Type filter options: unique types within the selected category
    const types = useMemo(() => {
        if (!selectedCategory) return []
        return [...new Set(
            bottles
                .filter(b => b.category === selectedCategory && b.type)
                .map(b => b.type as string)
        )].sort()
    }, [bottles, selectedCategory])

    // Leaf bottles only (no children) — these are the actual products shown in grid
    const filteredBottles = useMemo(() => {
        return bottles.filter(b => {
            // Hide nodes that have children (category/sub-type nodes)
            if (parentIds.has(b.id)) return false

            // Search filter
            if (!b.name.toLowerCase().includes(search.toLowerCase())) return false

            // Alphabet filter
            if (selectedLetter && !b.name.toUpperCase().startsWith(selectedLetter)) return false

            // Category filter
            if (selectedCategory && b.category !== selectedCategory) return false

            // Type filter
            if (selectedType && b.type !== selectedType) return false

            // Alcohol filter
            if (showNonAlcoholicOnly && b.alcoholContent !== 0) return false
            if (showAlcoholicOnly && (b.alcoholContent === null || b.alcoholContent === 0)) return false

            return true
        })
    }, [bottles, parentIds, search, selectedLetter, selectedCategory, selectedType, showNonAlcoholicOnly, showAlcoholicOnly])

    const resetFilters = () => {
        setSearch(""); setSelectedLetter(null); setSelectedCategory(null)
        setSelectedType(null); setShowAlcoholicOnly(false); setShowNonAlcoholicOnly(false)
    }

    return (
        <div className="space-y-8 pb-32">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-left">
                <div>
                    <h1 className="text-4xl font-extrabold italic text-[#00d2ff] uppercase tracking-tighter mb-1 select-none">Bottle Library</h1>
                    <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">{bottles.length} Registered / {filteredBottles.length} Shown</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group">
                        <i className="ph-bold ph-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-[#00d2ff] transition-colors"></i>
                        <input
                            className="bg-[#14151a] border border-white/5 rounded-2xl pl-12 pr-6 py-3 text-xs text-white uppercase font-bold focus:ring-1 focus:ring-[#00d2ff] outline-none transition-all placeholder:text-white/10"
                            placeholder="SEARCH BAR..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={resetFilters}
                        className="px-3 py-1.5 rounded-md text-xs font-bold uppercase border border-white/5 text-white/30 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/40 transition-all"
                    >
                        Clear All
                    </button>
                    <div className="flex bg-[#14151a] border border-white/5 rounded-lg p-0.5">
                        <button onClick={() => { setShowNonAlcoholicOnly(false); setShowAlcoholicOnly(false) }} className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${!showNonAlcoholicOnly && !showAlcoholicOnly ? "bg-[#00d2ff]/20 text-[#00d2ff]" : "text-white/30"}`}>All</button>
                        <button onClick={() => { setShowNonAlcoholicOnly(true); setShowAlcoholicOnly(false) }} className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${showNonAlcoholicOnly ? "bg-emerald-500/20 text-emerald-500" : "text-white/30"}`}>Soft</button>
                        <button onClick={() => { setShowAlcoholicOnly(true); setShowNonAlcoholicOnly(false) }} className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${showAlcoholicOnly ? "bg-orange-500/20 text-orange-500" : "text-white/30"}`}>Boozy</button>
                    </div>
                    <AddBottleClient allBottles={bottles} />
                </div>
            </header>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-1.5">
                <button
                    onClick={() => { setSelectedCategory(null); setSelectedType(null) }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${!selectedCategory ? "bg-[#00d2ff]/20 text-[#00d2ff] border-[#00d2ff]/40" : "text-white/30 border-white/5 hover:border-white/10"}`}
                >
                    ALL TYPES
                </button>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => { setSelectedCategory(cat); setSelectedType(null) }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${selectedCategory === cat ? "bg-orange-600/20 text-orange-500 border-orange-500/40" : "text-white/30 border-white/5 hover:border-white/10"}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Type Filter */}
            {selectedCategory && types.length > 0 && (
                <div className="flex flex-wrap gap-1.5 animate-in slide-in-from-top-2 duration-300 bg-white/[0.02] px-4 py-3 rounded-2xl border border-white/5">
                    <div className="w-full text-[10px] font-black text-[#00d2ff] uppercase tracking-widest mb-1.5 ml-1 opacity-80 flex items-center gap-1.5">
                        <i className="ph-bold ph-caret-right"></i>
                        <span>Refine {selectedCategory}:</span>
                    </div>
                    {types.map(t => (
                        <button
                            key={t}
                            onClick={() => setSelectedType(t === selectedType ? null : t)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${selectedType === t
                                ? "bg-[#00d2ff]/30 text-white border-[#00d2ff]"
                                : "bg-white/5 text-white/60 border-white/10 hover:border-[#00d2ff]/40 hover:text-white"
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            )}

            {/* Alphabet Scroller */}
            <div className="bg-[#14151a]/80 border border-white/5 rounded-3xl p-1.5 sticky top-4 z-40 flex items-center shadow-2xl backdrop-blur-3xl ring-1 ring-white/5">
                <button onClick={() => setSelectedLetter(null)} className={`px-6 py-2.5 rounded-2xl text-base font-black uppercase transition-all flex items-center justify-center min-w-[5rem] ${selectedLetter === null ? "bg-[#00d2ff]/20 text-[#00d2ff]" : "text-white/30 hover:bg-white/5"}`}>A-Z</button>
                <div className="flex-1 flex justify-center gap-0.5 px-4 overflow-x-auto no-scrollbar">
                    {ALPHABET.map(l => (
                        <button key={l} onClick={() => setSelectedLetter(l === selectedLetter ? null : l)} className={`w-9 h-9 flex items-center justify-center shrink-0 rounded-xl text-base font-black transition-all ${l === selectedLetter ? "bg-[#00d2ff]/20 text-[#00d2ff]" : "text-white/10 hover:text-white"}`}>{l}</button>
                    ))}
                </div>
            </div>

            {/* Bottle Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBottles.map(b => (
                    <EditBottleClient key={b.id} bottle={b} allBottles={bottles} />
                ))}
            </div>

            {filteredBottles.length === 0 && (
                <div className="py-40 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i className="ph-bold ph-flask text-2xl text-white/10"></i>
                    </div>
                    <p className="text-white/20 uppercase font-black tracking-widest text-xs">No Items found for this selection</p>
                    <button onClick={resetFilters} className="mt-8 px-6 py-2.5 rounded-xl border border-[#00d2ff]/20 text-[#00d2ff] text-[10px] font-black uppercase hover:bg-[#00d2ff]/10 transition-all">Reset All Filters</button>
                </div>
            )}
        </div>
    )
}
