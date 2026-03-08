"use client"

import { useState, useMemo } from "react"
import CocktailCardClient from "./CocktailCardClient"

export default function CocktailListClient({ cocktails, currentUserId, isSuperAdmin }: {
    cocktails: any[]
    currentUserId: string | null
    isSuperAdmin: boolean
}) {
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
    const [showOnlyCocktailCrafter, setShowOnlyCocktailCrafter] = useState(false)

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

    // Get unique starting letters from currently filtered cocktails (respects CocktailCrafter toggle)
    const availableLetters = useMemo(() => {
        const source = showOnlyCocktailCrafter
            ? cocktails.filter(c => c.user?.role === "SUPER_ADMIN")
            : cocktails
        const letters = new Set(source.map(c => c.name.charAt(0).toUpperCase()))
        return Array.from(letters)
    }, [cocktails, showOnlyCocktailCrafter])

    const filteredCocktails = useMemo(() => {
        let filtered = cocktails.filter(cocktail => {
            const matchesLetter = !selectedLetter || cocktail.name.toUpperCase().startsWith(selectedLetter)
            let matchesSearch = cocktail.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cocktail.description?.toLowerCase().includes(searchQuery.toLowerCase())

            if (!matchesSearch && cocktail.recipe) {
                matchesSearch = cocktail.recipe.toLowerCase().includes(searchQuery.toLowerCase())
            }

            const matchesCreator =
                !showOnlyCocktailCrafter || cocktail.user?.role === "SUPER_ADMIN"

            return matchesLetter && matchesSearch && matchesCreator
        })

        // Always sort alphabetically by default or when requested
        return [...filtered].sort((a, b) => {
            const nameA = a.name.toLowerCase()
            const nameB = b.name.toLowerCase()
            if (nameA < nameB) return sortOrder === "asc" ? -1 : 1
            if (nameA > nameB) return sortOrder === "asc" ? 1 : -1
            return 0
        })
    }, [cocktails, selectedLetter, searchQuery, sortOrder, showOnlyCocktailCrafter])

    return (
        <div className="relative flex flex-col lg:flex-row gap-8">
            {/* Main Content Area */}
            <div className="flex-1">
                {/* Search Header */}
                <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="flex w-full gap-2 flex-wrap">
                        <div className="relative flex-1 min-w-[200px]">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <i className="ph-bold ph-magnifying-glass text-[#00d2ff] opacity-60"></i>
                            </div>
                            <input
                                type="text"
                                placeholder="Search cocktails..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#1a1b21]/40 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-[#888c94] focus:outline-none focus:border-[#00d2ff]/40 focus:bg-[#1a1b21]/60 transition-all backdrop-blur-md"
                            />
                        </div>

                        {/* Creator filter toggle — only shown to SUPER_ADMIN */}
                        {isSuperAdmin && (
                            <button
                                onClick={() => setShowOnlyCocktailCrafter(!showOnlyCocktailCrafter)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                                    showOnlyCocktailCrafter
                                        ? "bg-[#00d2ff]/20 text-[#00d2ff] border-[#00d2ff]/30"
                                        : "bg-[#1a1b21]/40 text-[#888c94] border-white/5 hover:text-white"
                                }`}
                            >
                                CocktailCrafter
                            </button>
                        )}

                        <button
                            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                            className="bg-[#1a1b21]/40 border border-white/5 rounded-xl px-4 text-[#00d2ff] hover:bg-[#00d2ff]/10 transition-all flex items-center gap-2 font-bold text-xs"
                            title={sortOrder === "asc" ? "Sort Z-A" : "Sort A-Z"}
                        >
                            <i className={`ph-bold ph-sort-${sortOrder === "asc" ? "ascending" : "descending"} text-lg`}></i>
                            {sortOrder === "asc" ? "A-Z" : "Z-A"}
                        </button>
                    </div>
                </div>

                {filteredCocktails.length === 0 ? (
                    <div className="bg-[#1a1b21]/50 border border-white/5 rounded-3xl p-16 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 rounded-full mb-6">
                            <i className="ph-fill ph-martini text-4xl text-[#888c94]"></i>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No cocktails found</h3>
                        <p className="text-[#888c94] max-w-md mx-auto mb-8">
                            We couldn't find any cocktails matching your current search or filter.
                        </p>
                        <button
                            onClick={() => { setSelectedLetter(null); setSearchQuery(""); setShowOnlyCocktailCrafter(false); }}
                            className="text-[#00d2ff] font-bold hover:underline"
                        >
                            Reset all filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                        {filteredCocktails.map(cocktail => (
                            <CocktailCardClient
                                key={cocktail.id}
                                cocktail={cocktail}
                                canEdit={isSuperAdmin || cocktail.userId === currentUserId}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Alphabet Sidebar (Desktop) */}
            <aside className="hidden lg:block w-12 sticky top-32 h-fit">
                <div className="flex flex-col items-center py-4 bg-white/5 backdrop-blur-xl border border-white/5 rounded-2xl">
                    <button
                        onClick={() => setSelectedLetter(null)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all mb-2 text-xs font-black uppercase tracking-widest ${!selectedLetter ? 'bg-[#00d2ff] text-[#0b0c10]' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                        title="All"
                    >
                        ALL
                    </button>

                    <div className="w-px h-4 bg-white/10 mb-2"></div>

                    <div className="flex flex-col gap-0.5">
                        {alphabet.map(letter => {
                            const isAvailable = availableLetters.includes(letter)
                            const isSelected = selectedLetter === letter

                            return (
                                <button
                                    key={letter}
                                    onClick={() => setSelectedLetter(isSelected ? null : letter)}
                                    disabled={!isAvailable}
                                    className={`
                                        w-7 h-7 flex items-center justify-center rounded-md text-sm font-black transition-all
                                        ${isSelected ? 'bg-[#00d2ff]/20 text-[#00d2ff] shadow-[0_0_10px_rgba(0,210,255,0.2)]' : ''}
                                        ${!isSelected && isAvailable ? 'text-gray-300 hover:text-white hover:bg-white/5' : ''}
                                        ${!isAvailable ? 'text-white/20 cursor-not-allowed' : ''}
                                    `}
                                >
                                    {letter}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </aside>

            {/* Mobile Alphabet Scroller */}
            <div className="lg:hidden flex overflow-x-auto gap-2 pb-4 no-scrollbar -mx-2 px-2">
                <button
                    onClick={() => setSelectedLetter(null)}
                    className={`shrink-0 px-3 py-2 rounded-lg text-xs font-black transition-all ${!selectedLetter ? 'bg-[#00d2ff] text-black' : 'bg-white/5 text-gray-300'}`}
                >
                    ALL
                </button>
                {alphabet.map(letter => {
                    const isAvailable = availableLetters.includes(letter)
                    const isSelected = selectedLetter === letter
                    if (!isAvailable) return null

                    return (
                        <button
                            key={letter}
                            onClick={() => setSelectedLetter(isSelected ? null : letter)}
                            className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-sm font-black transition-all
                                ${isSelected ? 'bg-[#00d2ff]/20 text-[#00d2ff] border border-[#00d2ff]/40' : 'bg-white/5 text-gray-300'}
                            `}
                        >
                            {letter}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
