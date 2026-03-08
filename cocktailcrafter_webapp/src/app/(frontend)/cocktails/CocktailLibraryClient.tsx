"use client"

import { useState, useMemo } from "react"
import { FrontendCocktailCard } from "@/components/FrontendCocktailCard"

export function CocktailLibraryClient({ cocktails }: { cocktails: any[] }) {
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [strengthFilter, setStrengthFilter] = useState<"all" | "soft" | "boozy">("all")

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

    const availableLetters = useMemo(() => {
        const letters = new Set(cocktails.map(c => c.name.charAt(0).toUpperCase()))
        return Array.from(letters)
    }, [cocktails])

    const filteredCocktails = useMemo(() => {
        return cocktails.filter(cocktail => {
            const matchesLetter = !selectedLetter || cocktail.name.toUpperCase().startsWith(selectedLetter)
            
            let matchesSearch = cocktail.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cocktail.description?.toLowerCase().includes(searchQuery.toLowerCase())
            
            if (!matchesSearch && cocktail.recipe) {
                matchesSearch = cocktail.recipe.toLowerCase().includes(searchQuery.toLowerCase())
            }

            let matchesStrength = true
            if (strengthFilter === "soft") {
                matchesStrength = cocktail.isFullyAlcoholFree === true
            } else if (strengthFilter === "boozy") {
                matchesStrength = cocktail.isFullyAlcoholFree !== true
            }

            return matchesLetter && matchesSearch && matchesStrength
        })
    }, [cocktails, selectedLetter, searchQuery, strengthFilter])

    return (
        <div className="relative flex flex-col lg:flex-row gap-12">
            <div className="flex-1">
                <div className="mb-12 space-y-6">
                    <div className="relative max-w-2xl">
                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                            <i className="ph-bold ph-magnifying-glass text-[#00d2ff] opacity-60"></i>
                        </div>
                        <input
                            type="text"
                            placeholder="Search for formulas, ingredients or names..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#1a1b21]/40 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-[#888c94] focus:outline-none focus:border-[#00d2ff]/40 focus:bg-[#1a1b21]/60 transition-all backdrop-blur-md"
                        />
                    </div>

                    <div className="flex gap-3 flex-wrap">
                        <button
                            onClick={() => setStrengthFilter("all")}
                            className={`px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${
                                strengthFilter === "all"
                                    ? "bg-[#00d2ff] text-black shadow-[0_0_15px_rgba(0,210,255,0.3)]"
                                    : "bg-white/5 text-[#888c94] border border-white/10 hover:border-[#00d2ff]/40 hover:text-[#00d2ff]"
                            }`}
                        >
                            All Cocktails
                        </button>
                        <button
                            onClick={() => setStrengthFilter("soft")}
                            className={`px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                                strengthFilter === "soft"
                                    ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                                    : "bg-white/5 text-[#888c94] border border-white/10 hover:border-emerald-500/40 hover:text-emerald-500"
                            }`}
                        >
                            <i className="ph-fill ph-leaf"></i>
                            Soft (Alcohol-Free)
                        </button>
                        <button
                            onClick={() => setStrengthFilter("boozy")}
                            className={`px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                                strengthFilter === "boozy"
                                    ? "bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                                    : "bg-white/5 text-[#888c94] border border-white/10 hover:border-rose-500/40 hover:text-rose-500"
                            }`}
                        >
                            <i className="ph-fill ph-fire"></i>
                            Boozy (With Alcohol)
                        </button>
                    </div>
                </div>

                {filteredCocktails.length === 0 ? (
                    <div className="text-center py-40 bg-[#1a1b21]/20 border border-white/5 rounded-[40px] backdrop-blur-sm">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 text-[#888c94]">
                            <i className="ph-thin ph-flask-slash text-4xl"></i>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">No Formulas Found</h3>
                        <p className="text-[#888c94] max-w-xs mx-auto">Adjust your filters or try a different search term.</p>
                        <button
                            onClick={() => { setSelectedLetter(null); setSearchQuery(""); setStrengthFilter("all"); }}
                            className="mt-8 text-[#00d2ff] font-black uppercase tracking-widest text-xs hover:underline"
                        >
                            Reset all filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 animate-fade-in">
                        {filteredCocktails.map(cocktail => (
                            <FrontendCocktailCard key={cocktail.id} cocktail={cocktail} alcoholFreeContext={strengthFilter === "soft"} />
                        ))}
                    </div>
                )}
            </div>

            <aside className="hidden lg:block w-16 sticky top-32 h-fit">
                <div className="flex flex-col items-center py-8 bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl">
                    <button
                        onClick={() => setSelectedLetter(null)}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all mb-4 text-[10px] font-black uppercase tracking-widest ${!selectedLetter ? 'bg-[#00d2ff] text-black' : 'text-[#888c94] hover:text-white hover:bg-white/5'}`}
                    >
                        ALL
                    </button>

                    <div className="w-px h-8 bg-white/10 mb-4"></div>

                    <div className="flex flex-col gap-1">
                        {alphabet.map(letter => {
                            const isAvailable = availableLetters.includes(letter)
                            const isSelected = selectedLetter === letter

                            return (
                                <button
                                    key={letter}
                                    onClick={() => setSelectedLetter(isSelected ? null : letter)}
                                    disabled={!isAvailable}
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-[11px] font-black transition-all ${
                                        isSelected ? 'bg-[#00d2ff]/20 text-[#00d2ff] shadow-[0_0_15px_rgba(0,210,255,0.2)] scale-110' : ''
                                    } ${!isSelected && isAvailable ? 'text-[#888c94] hover:text-white hover:bg-white/5' : ''} ${
                                        !isAvailable ? 'text-white/5 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {letter}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </aside>

            <div className="lg:hidden flex overflow-x-auto gap-2 pb-6 no-scrollbar -mx-6 px-6">
                <button
                    onClick={() => setSelectedLetter(null)}
                    className={`shrink-0 px-4 py-2 rounded-xl text-[10px] font-black transition-all ${!selectedLetter ? 'bg-[#00d2ff] text-black' : 'bg-white/5 text-[#888c94]'}`}
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
                            className={`shrink-0 w-10 h-10 flex items-center justify-center rounded-xl text-[11px] font-black transition-all ${
                                isSelected ? 'bg-[#00d2ff]/20 text-[#00d2ff] border border-[#00d2ff]/40' : 'bg-white/5 text-[#888c94]'
                            }`}
                        >
                            {letter}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
