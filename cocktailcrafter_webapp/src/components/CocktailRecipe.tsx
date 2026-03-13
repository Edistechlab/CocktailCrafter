"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { IceIcon } from "./IceIcon"
import { calculateCocktailMetrics } from "@/lib/cocktailCalculations"

interface Bottle {
    id: string
    name: string
    alcoholContent?: number | null
    sugarContent?: number | null
    acidity?: number | null
    nonAlcoholicId?: string | null
    alternativeId?: string | null
    nonAlcoholic?: Bottle | null
    alternative?: Bottle | null
    parent?: Bottle | null
    tasteProfile?: string | null
}

interface Ingredient {
    bottleId?: string
    name: string
    amount: number | string
    unit?: string
    alternative?: string
}

interface CocktailRecipeProps {
    initialIngredients: Ingredient[]
    bottlesMap: Record<string, Bottle>
    iceName?: string
    garnishName?: string | string[]
    dilution?: number
    initialAlcoholFree?: boolean
}

export function CocktailRecipe({ initialIngredients, bottlesMap, iceName, garnishName, dilution = 0, initialAlcoholFree = false }: CocktailRecipeProps) {
    const [isAlcoholFree, setIsAlcoholFree] = useState(initialAlcoholFree)
    const [inspectedIngredient, setInspectedIngredient] = useState<number | null>(null)
    const [relatedBottles, setRelatedBottles] = useState<Bottle[]>([])
    const [isLoadingRelated, setIsLoadingRelated] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Current state of ingredients (which bottle is selected for each slot)
    const [currentIngredients, setCurrentIngredients] = useState(() =>
        initialIngredients.map(ing => {
            const bottle = (ing.bottleId && bottlesMap[ing.bottleId]) || bottlesMap[ing.name] || null
            if (initialAlcoholFree && bottle?.nonAlcoholic) {
                return { ...ing, currentBottle: bottle.nonAlcoholic, name: bottle.nonAlcoholic.name }
            }
            return { ...ing, currentBottle: bottle }
        })
    )

    // Calculate metrics live based on current selection
    const metrics = useMemo(() => {
        const calcIngredients = currentIngredients.map(ing => ({
            amount: ing.amount,
            alcoholContent: ing.currentBottle?.alcoholContent,
            sugarContent: ing.currentBottle?.sugarContent,
            acidity: ing.currentBottle?.acidity,
            name: ing.currentBottle?.name
        }))
        return calculateCocktailMetrics(calcIngredients, { dilution })
    }, [currentIngredients, dilution])

    const toggleGlobalNonAlcoholic = () => {
        const nextState = !isAlcoholFree
        setIsAlcoholFree(nextState)

        const newIngredients = currentIngredients.map((ing, idx) => {
            const originalIng = initialIngredients[idx]
            const originalBottle = (originalIng.bottleId && bottlesMap[originalIng.bottleId]) || bottlesMap[originalIng.name] || null

            if (nextState) {
                // Switching TO Alcohol Free
                if (originalBottle?.nonAlcoholic) {
                    return {
                        ...ing,
                        currentBottle: originalBottle.nonAlcoholic,
                        name: originalBottle.nonAlcoholic.name
                    }
                }
            } else {
                // Switching BACK to Original
                return {
                    ...ing,
                    currentBottle: originalBottle,
                    name: initialIngredients[idx].name
                }
            }
            return ing
        })
        setCurrentIngredients(newIngredients)
    }

    const inspectIngredient = async (idx: number) => {
        const ing = currentIngredients[idx]
        const bottleId = ing.currentBottle?.id || ing.bottleId
        if (!bottleId) return

        if (inspectedIngredient === idx) {
            setInspectedIngredient(null)
            return
        }

        setInspectedIngredient(idx)
        setIsLoadingRelated(true)
        try {
            const res = await fetch(`/api/bottles/by-parent/${bottleId}`)
            if (res.ok) {
                const data = await res.json()
                setRelatedBottles(data)
            }
        } catch (err) {
            console.error("Failed to load related bottles:", err)
        } finally {
            setIsLoadingRelated(false)
        }
    }

    const switchIngredient = (idx: number, target: 'original' | 'alternative') => {
        const originalIng = initialIngredients[idx]
        const originalBottle = (originalIng.bottleId && bottlesMap[originalIng.bottleId]) || bottlesMap[originalIng.name] || null

        let nextBottle: Bottle | null | undefined = null

        if (target === 'original') {
            nextBottle = originalBottle
        } else if (target === 'alternative') {
            const explicitAlternative = originalIng.alternative ? bottlesMap[originalIng.alternative] : null
            nextBottle = explicitAlternative || currentIngredients[idx].currentBottle?.alternative || originalBottle?.alternative
        }

        if (nextBottle) {
            const newIngredients = [...currentIngredients]
            newIngredients[idx] = {
                ...newIngredients[idx],
                currentBottle: nextBottle,
                name: nextBottle.name
            }
            setCurrentIngredients(newIngredients)
        }
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as HTMLElement
            // If the click is not on a trigger button and not inside an open inspector
            if (!target.closest('.ingredient-trigger') && !target.closest('.inspector-content')) {
                setInspectedIngredient(null)
            }
        }

        if (inspectedIngredient !== null) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [inspectedIngredient])

    return (
        <div className={`bg-[#1a1b21]/60 backdrop-blur-xl rounded-[48px] p-10 shadow-2xl space-y-10 transition-all duration-500 ${isAlcoholFree
            ? "border border-emerald-500/30"
            : "border border-white/10"
        }`}>
            {/* Header with Flip-Flop Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-xl font-black text-white flex items-center gap-3">
                    <i className={`ph-fill ph-flask transition-colors duration-300 ${isAlcoholFree ? "text-emerald-400" : "text-[#00d2ff]"}`}></i>
                    Recipe Profile
                    {isAlcoholFree && (
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                            Alcohol Free
                        </span>
                    )}
                </h3>

                <button
                    onClick={toggleGlobalNonAlcoholic}
                    className={`flex items-center gap-2 px-6 py-2.5 border rounded-xl transition-all text-[11px] font-black uppercase tracking-[0.2em] group shadow-[0_0_15px_rgba(0,210,255,0.05)] whitespace-nowrap ${isAlcoholFree
                        ? "bg-white/5 text-[#888c94] border-white/10 hover:border-[#00d2ff]/40 hover:text-[#00d2ff] hover:bg-[#00d2ff]/5"
                        : "bg-white/5 text-[#888c94] border-white/10 hover:border-emerald-500/40 hover:text-emerald-500 hover:bg-emerald-500/5"
                        }`}
                >
                    <i className={`ph-bold ${isAlcoholFree ? "ph-arrows-counter-clockwise" : "ph-leaf"} text-sm transition-transform group-hover:rotate-12`}></i>
                    {isAlcoholFree ? "Standard" : "Alcohol Free"}
                </button>
            </div>

            {/* Metrics Section: Strength & Taste */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-8 border-y border-white/5">
                {/* Alcohol Strength */}
                <div className="space-y-8 flex flex-col justify-between">
                    <div className="flex justify-between items-start h-12">
                        <div className="flex flex-col text-[13px] font-black uppercase tracking-[0.2em] text-[#aeb2ba] leading-tight">
                            <span>Alcohol</span>
                            <span>Strength</span>
                        </div>
                        <div className="flex flex-col items-end leading-none">
                            <span className="text-white font-black italic text-2xl">{metrics.abv}%</span>
                            <span className="text-[10px] font-bold text-[#aeb2ba] uppercase tracking-widest mt-1">ABV</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5] transition-all duration-1000"
                                style={{ width: `${Math.min(100, (metrics.abv / 40) * 100)}%` }}
                            />
                        </div>
                        <div className="flex justify-between px-1">
                            <span className="text-[9px] font-black text-[#888c94] uppercase tracking-tighter">Mild</span>
                            <span className="text-[9px] font-black text-[#888c94] uppercase tracking-tighter">Medium</span>
                            <span className="text-[9px] font-black text-[#888c94] uppercase tracking-tighter">Strong</span>
                        </div>
                    </div>
                </div>

                {/* Balance Guide */}
                <div className="space-y-8 flex flex-col justify-between">
                    <div className="flex justify-between items-start h-12">
                        <div className="flex flex-col text-[13px] font-black uppercase tracking-[0.2em] text-[#aeb2ba] leading-tight">
                            <span>Taste</span>
                            <span>Balance</span>
                        </div>
                        <div className="flex flex-col items-end leading-none">
                            <span className="text-white font-black italic text-2xl">
                                {metrics.balance < 4 ? "Sour" : metrics.balance > 6 ? "Sweet" : "Balanced"}
                            </span>
                            {(metrics.balance < 4 || metrics.balance > 6) && (
                                <span className="text-[10px] font-bold text-[#aeb2ba] uppercase tracking-widest mt-1">Focus</span>
                            )}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="relative h-1.5 bg-white/5 rounded-full flex items-center px-0.5">
                            <div
                                className="w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-700 absolute"
                                style={{ left: `calc(${metrics.balance * 10}% - 6px)` }}
                            />
                        </div>
                        <div className="flex justify-between px-1">
                            <span className="text-[9px] font-black text-[#888c94] uppercase tracking-tighter">Sour</span>
                            <span className="text-[9px] font-black text-[#888c94] uppercase tracking-tighter">Balanced</span>
                            <span className="text-[9px] font-black text-[#888c94] uppercase tracking-tighter">Sweet</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ingredients List */}
            <div className="space-y-8">
                {currentIngredients.map((ing, idx) => {
                    const originalIng = initialIngredients[idx]
                    const originalBottle = (originalIng.bottleId && bottlesMap[originalIng.bottleId]) || bottlesMap[originalIng.name] || null
                    const explicitAlternative = originalIng.alternative ? bottlesMap[originalIng.alternative] : null
                    const hasAlternative = !!(explicitAlternative || ing.currentBottle?.alternative || originalBottle?.alternative)
                    const hasNoNonAlcoholicAlt = isAlcoholFree &&
                        (originalBottle?.alcoholContent ?? 0) > 0 &&
                        !originalBottle?.nonAlcoholic
                    const currentAlcohol = ing.currentBottle?.alcoholContent ?? null
                    const filteredRelatedBottles = (inspectedIngredient === idx && currentAlcohol !== null && currentAlcohol > 0)
                        ? relatedBottles.filter(b => (b.alcoholContent ?? 0) > 0)
                        : relatedBottles

                    return (
                        <div key={idx} className={`space-y-2 rounded-2xl transition-all duration-300 ${hasNoNonAlcoholicAlt ? "bg-red-500/10 border border-red-500/30 px-4 py-3 -mx-4" : ""}`}>
                            <div className="flex justify-between items-start group">
                                <div className="flex flex-col">
                                    <button
                                        onClick={() => inspectIngredient(idx)}
                                        className="flex items-baseline gap-2 group/title text-left ingredient-trigger"
                                    >
                                        <span className={`font-black uppercase tracking-tighter text-lg leading-tight transition-colors ${hasNoNonAlcoholicAlt ? "text-red-400 group-hover/title:text-red-300" : "text-white group-hover/title:text-[#00d2ff]"}`}>
                                            {ing.currentBottle?.parent?.name || ing.name}
                                        </span>
                                        {ing.currentBottle?.parent && (
                                            <span className="text-[11px] font-bold text-[#00d2ff] opacity-60 uppercase tracking-widest">
                                                {ing.name.toLowerCase().replace(ing.currentBottle.parent.name.toLowerCase(), "").trim()}
                                            </span>
                                        )}
                                    </button>
                                    <div className="flex items-center gap-3 mt-1">
                                        {hasNoNonAlcoholicAlt && (
                                            <span className="text-[10px] font-black uppercase tracking-widest text-red-400 flex items-center gap-1 leading-none">
                                                <i className="ph-bold ph-warning text-[11px]"></i>
                                                No alternative
                                            </span>
                                        )}
                                        <span className={`text-[10px] font-bold uppercase tracking-widest leading-none transition-colors ${
                                            ing.currentBottle?.alcoholContent === 0
                                                ? "text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md"
                                                : hasNoNonAlcoholicAlt ? "text-red-400/60" : "text-[#888c94]"
                                        }`}>
                                            {ing.currentBottle?.alcoholContent !== null ? `${ing.currentBottle?.alcoholContent}% vol` : "Premium Ingredient"}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            {/* Only show Alt if we're currently on original and have an alternative */}
                                            {hasAlternative && ing.currentBottle?.id === originalBottle?.id && (
                                                <button
                                                    onClick={() => switchIngredient(idx, 'alternative')}
                                                    className="text-[10px] font-bold uppercase tracking-widest text-[#888c94]/60 hover:text-[#00d2ff] flex items-center gap-1.5 transition-colors border-l border-white/10 pl-3 leading-none"
                                                >
                                                    <i className="ph-bold ph-arrows-left-right text-[11px]"></i>
                                                    Alt
                                                </button>
                                            )}
                                            {/* Only show Orig if we're currently on an alternative/NA and it's not original */}
                                            {ing.currentBottle?.id !== originalBottle?.id && !isAlcoholFree && (
                                                <button
                                                    onClick={() => switchIngredient(idx, 'original')}
                                                    className="text-[10px] text-[#00d2ff] font-bold uppercase tracking-widest hover:opacity-80 flex items-center gap-1.5 border-l border-white/10 pl-3 leading-none"
                                                >
                                                    <i className="ph-bold ph-arrow-counter-clockwise text-[11px]"></i>
                                                    Orig
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[#00d2ff] font-black text-xl italic leading-none">{String(ing.amount).replace('.', ',')}</div>
                                    <div className="text-[10px] text-[#888c94] font-bold uppercase tracking-widest">{ing.unit || (Number(ing.amount) === 1 ? "part" : "parts")}</div>
                                </div>
                            </div>

                            {/* Related Bottles Inspector */}
                            {inspectedIngredient === idx && (
                                <div className="mt-4 p-5 bg-white/5 border border-white/10 rounded-3xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 inspector-content">
                                    <div className="flex justify-between items-center px-1">
                                        <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#00d2ff]">Recommended Selections</div>
                                        {isLoadingRelated ? (
                                            <div className="w-4 h-4 border-2 border-[#00d2ff]/20 border-t-[#00d2ff] rounded-full animate-spin"></div>
                                        ) : (
                                            <div className="text-[10px] font-bold text-[#888c94] uppercase tracking-widest">
                                                {filteredRelatedBottles.length} {filteredRelatedBottles.length === 1 ? 'Option' : 'Options'}
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-2">
                                        {filteredRelatedBottles.length > 0 ? (
                                            filteredRelatedBottles.map((bottle) => (
                                                <div key={bottle.id} className="flex flex-col p-4 bg-[#0b0c10]/40 border border-white/5 rounded-2xl hover:border-[#00d2ff]/30 transition-all hover:translate-x-1 group/bottle">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-white font-bold text-sm tracking-wide group-hover/bottle:text-[#00d2ff] transition-colors">{bottle.name}</span>
                                                        <span className="text-[10px] font-black text-[#888c94]">{bottle.alcoholContent}%</span>
                                                    </div>
                                                    {bottle.tasteProfile && (
                                                        <p className="text-[11px] text-[#888c94] mt-2 italic leading-relaxed line-clamp-1">{bottle.tasteProfile}</p>
                                                    )}
                                                </div>
                                            ))
                                        ) : !isLoadingRelated && (
                                            <div className="p-8 text-center bg-[#0b0c10]/20 rounded-2xl border border-dashed border-white/5">
                                                <p className="text-[11px] font-bold text-[#888c94] uppercase tracking-widest italic">No specific details available</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Footer Items */}
            <div className="pt-8 border-t border-white/5 space-y-6">
                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                        <IceIcon type={iceName || ""} className="w-5 h-5 text-[#00d2ff]" />
                        <span className="text-[13px] font-black uppercase tracking-widest text-[#aeb2ba]">Ice Selection</span>
                    </div>
                    <span className="text-white font-bold">{iceName || "None"}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 flex items-center justify-center">
                            <i className="ph-fill ph-orange text-[#00d2ff] text-lg"></i>
                        </div>
                        <span className="text-[13px] font-black uppercase tracking-widest text-[#aeb2ba]">Garnish</span>
                    </div>
                    <span className="text-white font-bold">{Array.isArray(garnishName) ? garnishName.join(", ") : (garnishName || "None")}</span>
                </div>
            </div>
        </div>
    )
}
