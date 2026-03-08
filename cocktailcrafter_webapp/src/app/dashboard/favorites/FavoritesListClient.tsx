"use client"

import { useState, useMemo } from "react"
import FavoriteCardClient from "./FavoriteCardClient"

export default function FavoritesListClient({ cocktails: initialCocktails }: { cocktails: any[] }) {
    const [cocktails, setCocktails] = useState(initialCocktails)
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

    const availableLetters = useMemo(() => {
        const letters = new Set(cocktails.map(c => c.name.charAt(0).toUpperCase()))
        return Array.from(letters)
    }, [cocktails])

    const filteredCocktails = useMemo(() => {
        let filtered = cocktails.filter(cocktail => {
            const matchesLetter = !selectedLetter || cocktail.name.toUpperCase().startsWith(selectedLetter)
            const matchesSearch = cocktail.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cocktail.description?.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesLetter && matchesSearch
        })

        if (selectedLetter) {
            filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))
        }

        return filtered
    }, [cocktails, selectedLetter, searchQuery])

    const handleRemoveFavorite = (id: string) => {
        setCocktails(prev => prev.filter(c => c.id !== id))
    }

    return (
        <div className="relative flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
                <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full max-w-md">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <i className="ph-bold ph-magnifying-glass text-[#00d2ff] opacity-60"></i>
                        </div>
                        <input
                            type="text"
                            placeholder="Search favorites..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#1a1b21]/40 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-[#888c94] focus:outline-none focus:border-[#00d2ff]/40 focus:bg-[#1a1b21]/60 transition-all backdrop-blur-md"
                        />
                    </div>
                </div>

                {filteredCocktails.length === 0 ? (
                    <div className="bg-[#1a1b21]/50 border border-white/5 rounded-3xl p-16 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 rounded-full mb-6">
                            <i className="ph-fill ph-heart text-4xl text-[#888c94]"></i>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No matches found</h3>
                        <p className="text-[#888c94] max-w-md mx-auto mb-8">
                            Try adjusting your search or filters.
                        </p>
                        <button
                            onClick={() => { setSelectedLetter(null); setSearchQuery(""); }}
                            className="text-[#00d2ff] font-bold hover:underline"
                        >
                            Reset filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                        {filteredCocktails.map(cocktail => (
                            <FavoriteCardClient
                                key={cocktail.id}
                                cocktail={cocktail}
                                onRemove={() => handleRemoveFavorite(cocktail.id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Alphabet Sidebar */}
            <aside className="hidden lg:block w-12 sticky top-32 h-fit">
                <div className="flex flex-col items-center py-4 bg-white/5 backdrop-blur-xl border border-white/5 rounded-2xl">
                    <button
                        onClick={() => setSelectedLetter(null)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all mb-2 text-[9px] font-black uppercase tracking-widest ${!selectedLetter ? 'bg-[#00d2ff] text-[#0b0c10]' : 'text-[#888c94] hover:text-white hover:bg-white/5'}`}
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
                                    className={`w-7 h-7 flex items-center justify-center rounded-md text-[10px] font-black transition-all
                                        ${isSelected ? 'bg-[#00d2ff]/20 text-[#00d2ff]' : ''}
                                        ${!isSelected && isAvailable ? 'text-[#888c94] hover:text-white' : ''}
                                        ${!isAvailable ? 'text-white/5' : ''}
                                    `}
                                >
                                    {letter}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </aside>
        </div>
    )
}
