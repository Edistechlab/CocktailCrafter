"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BottlePickerModal, type BottleOption } from "@/components/BottlePickerModal"

type CatalogItem = { id: string, name: string }
type BottleItem = BottleOption

function MultiSelectDropdown({
    label, options, selectedIds, onChange, placeholder, maxItems = 3
}: {
    label: string,
    options: CatalogItem[],
    selectedIds: string[],
    onChange: (id: string) => void,
    placeholder: string,
    maxItems?: number
}) {
    const [isOpen, setIsOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={ref}>
            <label className="block text-sm text-[#888c94] mb-1">{label}</label>
            <div
                className="w-full bg-[#0b0c10]/50 border border-white/10 rounded-xl px-4 py-2.5 text-white cursor-pointer flex justify-between items-center"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="truncate pr-4">
                    {selectedIds.length === 0
                        ? placeholder
                        : options.filter(o => selectedIds.includes(o.id)).map(o => o.name).join(", ")}
                </span>
                <i className="ph-bold ph-caret-down text-[#888c94] shrink-0"></i>
            </div>

            {isOpen && (
                <div className="absolute z-10 w-full mt-2 bg-[#1a1b21] border border-white/10 rounded-xl shadow-2xl max-h-60 overflow-y-auto p-2">
                    {options.map(o => {
                        const isSelected = selectedIds.includes(o.id)
                        const isDisabled = !isSelected && selectedIds.length >= maxItems
                        return (
                            <label key={o.id} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5'}`}>
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-white/20 bg-[#0b0c10] text-[#00d2ff] focus:ring-[#00d2ff] focus:ring-offset-0"
                                    checked={isSelected}
                                    disabled={isDisabled}
                                    onChange={() => onChange(o.id)}
                                />
                                <span className="text-sm">{o.name}</span>
                            </label>
                        )
                    })}
                </div>
            )}
        </div>
    )
}


export default function CocktailForm({
    glasses,
    techniques,
    ices,
    tastes,
    garnishes,
    bottles,
    initialData
}: {
    glasses: CatalogItem[]
    techniques: CatalogItem[]
    ices: CatalogItem[]
    tastes: CatalogItem[]
    garnishes: CatalogItem[]
    bottles?: BottleItem[]
    initialData?: any
}) {
    bottles = bottles || []
    const router = useRouter()
    const [pickerOpen, setPickerOpen] = useState<number | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [showConfirm, setShowConfirm] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    // Form State
    const [name, setName] = useState(initialData?.name || "")
    const [description, setDescription] = useState(initialData?.description || "")
    const [history, setHistory] = useState(initialData?.history || "")
    const [instruction, setInstruction] = useState(initialData?.instruction || "")
    const [pictureUrl, setPictureUrl] = useState(initialData?.pictureUrl || "")
    const [automationLevel, setAutomationLevel] = useState(initialData?.automationLevel || 0)

    const [glassIds, setGlassIds] = useState<string[]>(initialData?.glasses?.map((g: any) => g.id) || [])
    const [techniqueIds, setTechniqueIds] = useState<string[]>(initialData?.techniques?.map((t: any) => t.id) || [])
    const [iceIds, setIceIds] = useState<string[]>(initialData?.ices?.map((i: any) => i.id) || [])
    const [garnishIds, setGarnishIds] = useState<string[]>(initialData?.garnishes?.map((g: any) => g.id) || [])
    const [tasteIds, setTasteIds] = useState<string[]>(initialData?.tastes?.map((t: any) => t.id) || [])

    const handleToggle = (setter: React.Dispatch<React.SetStateAction<string[]>>, current: string[], id: string, max: number) => {
        if (current.includes(id)) {
            setter(current.filter(i => i !== id))
        } else if (current.length < max) {
            setter([...current, id])
        }
    }

    // Ingredients (Max 8)
    const [ingredients, setIngredients] = useState(() => {
        if (initialData?.recipe) {
            try {
                const parsed = typeof initialData.recipe === 'string' ? JSON.parse(initialData.recipe) : initialData.recipe;
                if (Array.isArray(parsed) && parsed.length > 0) {
                    // Map 0.031 back to "Dash" for UI display
                    return parsed.map((ing: any) => {
                        if (ing.amount === 0.031 || ing.amount === "0.031") {
                            return { ...ing, amount: "Dash" };
                        }
                        return ing;
                    });
                }
            } catch (e) { }
        }
        return [{ name: "", amount: "1", unit: "parts" }];
    })

    const totalParts = ingredients.reduce((sum, ing) => {
        const amtStr = String(ing.amount).trim().toLowerCase()
        const amt = amtStr === "dash" ? 0.031 : (parseFloat(String(ing.amount)) || 0)
        return sum + amt
    }, 0)

    const addIngredient = () => {
        if (ingredients.length < 8) {
            setIngredients([...ingredients, { name: "", amount: "1", unit: "parts" }])
        }
    }

    const removeIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index))
    }

    const updateIngredient = (index: number, field: string, value: string) => {
        const newIngredients = [...ingredients]
        newIngredients[index] = { ...newIngredients[index], [field]: value }
        setIngredients(newIngredients)
    }

    const handleAmountStep = (index: number, step: number) => {
        const newIngredients = [...ingredients];
        const currentStr = String(newIngredients[index].amount).trim().toLowerCase();
        let current = currentStr === "dash" ? 0 : (parseFloat(currentStr) || 0);

        let next = current + step;
        if (next < 0.25 && step < 0) {
            newIngredients[index] = { ...newIngredients[index], amount: "Dash" };
        } else {
            if (next < 0.25 && step > 0) next = 0.25;
            newIngredients[index] = { ...newIngredients[index], amount: String(next) };
        }
        setIngredients(newIngredients);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const endpoint = initialData ? `/api/cocktails/${initialData.id}` : "/api/cocktails"
            const method = initialData ? "PUT" : "POST"

            const finalRecipe = ingredients
                .filter(i => i.name.trim() !== "") // clean empty ones
                .map(i => {
                    const amtStr = String(i.amount).trim().toLowerCase();
                    return {
                        ...i,
                        amount: amtStr === "dash" ? 0.031 : (parseFloat(String(i.amount)) || 0)
                    };
                });

            const res = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name, description, history, instruction, pictureUrl,
                    volume: totalParts,
                    automationLevel: Number(automationLevel),
                    glassIds, techniqueIds, iceIds, tasteIds, garnishIds,
                    recipe: finalRecipe
                })
            })

            if (!res.ok) {
                const text = await res.text()
                throw new Error(text || "Failed to save cocktail")
            }

            router.push("/dashboard/cocktails")
            router.refresh()
        } catch (err: any) {
            setError(err.message || "An error occurred")
            setLoading(false)
        }
    }

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!initialData) return;
        setShowConfirm(true);
    }

    const confirmDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!initialData) return;
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/cocktails/${initialData.id}`, { method: 'DELETE' });
            if (res.ok) {
                router.push("/dashboard/cocktails");
                router.refresh();
            } else {
                alert("Failed to delete cocktail.");
                setIsDeleting(false);
                setShowConfirm(false);
            }
        } catch (err) {
            console.error(err);
            setIsDeleting(false);
            setShowConfirm(false);
        }
    }

    const cancelDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowConfirm(false);
    }

    return (
        <>
        <form onSubmit={handleSubmit} className="space-y-8 bg-[#1a1b21]/80 backdrop-blur-md border border-white/5 rounded-3xl p-8 shadow-2xl relative">
            {/* Custom Confirm Dialog Overlay */}
            {showConfirm && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-center rounded-3xl" onClick={cancelDelete}>
                    <div className="bg-[#1a1b21] p-6 rounded-2xl border border-white/10 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        <i className="ph-fill ph-warning-circle text-4xl text-red-500 mb-4 inline-block"></i>
                        <h4 className="text-xl font-bold mb-2 text-white">Delete "{name}"?</h4>
                        <p className="text-[#888c94] text-sm mb-6">This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button type="button" onClick={cancelDelete} disabled={isDeleting} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors disabled:opacity-50">
                                Cancel
                            </button>
                            <button type="button" onClick={confirmDelete} disabled={isDeleting} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors disabled:opacity-50">
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {error && <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-sm border border-red-500/20">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-5">
                    <h3 className="text-xl font-semibold border-b border-white/10 pb-2 flex items-center gap-2">
                        <i className="ph-fill ph-info text-[#00d2ff]"></i> Basic Info
                    </h3>
                    <div>
                        <label className="block text-sm text-[#888c94] mb-1">Cocktail Name *</label>
                        <input type="text" required value={name} onChange={e => setName(e.target.value)}
                            className="w-full bg-[#0b0c10]/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-[#00d2ff]" />
                    </div>
                    <div>
                        <label className="block text-sm text-[#888c94] mb-1">Total Volume (Calculated)</label>
                        <div className="w-full bg-[#0b0c10]/30 border border-white/10 rounded-xl px-4 py-2.5 text-white/50 cursor-not-allowed">
                            {totalParts} Parts
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-[#888c94] mb-1">Description / About</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4}
                            placeholder="A vibrant and sharp cocktail with a subtle underlying sweetness."
                            className="w-full bg-[#0b0c10]/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-[#00d2ff]" />
                    </div>
                    <div>
                        <label className="block text-sm text-[#888c94] mb-1">History</label>
                        <textarea value={history} onChange={e => setHistory(e.target.value)} rows={4}
                            placeholder="This drink is a contemporary twist on the classic Vesper..."
                            className="w-full bg-[#0b0c10]/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-[#00d2ff]" />
                    </div>
                    <div>
                        <label className="block text-sm text-[#888c94] mb-1">Image URL (e.g. /images/cocktails/drink.webp)</label>
                        <input type="text" value={pictureUrl} onChange={e => setPictureUrl(e.target.value)} placeholder="/images/..."
                            className="w-full bg-[#0b0c10]/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-[#00d2ff]" />
                    </div>
                    <div>
                        <label className="block text-sm text-[#888c94] mb-3">Automation-Level (1-5)</label>
                        <div className="flex gap-2 bg-[#0b0c10]/50 border border-white/10 rounded-xl px-4 py-4 w-fit">
                            {[1, 2, 3, 4, 5].map((level) => {
                                const isActive = automationLevel >= level;
                                return (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => setAutomationLevel(level)}
                                        className={`w-10 h-2.5 rounded-full transition-all duration-300 ${isActive
                                            ? 'bg-[#888c94] shadow-[0_0_10px_rgba(136,140,148,0.3)]'
                                            : 'bg-white/5 hover:bg-white/10'
                                            }`}
                                        title={`Level ${level}`}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Catalogs Setup */}
                <div className="space-y-5">
                    <h3 className="text-xl font-semibold border-b border-white/10 pb-2 flex items-center gap-2">
                        <i className="ph-fill ph-books text-[#00d2ff]"></i> Profile & Serve
                    </h3>

                    <MultiSelectDropdown
                        label="Taste Profile (Max 3)"
                        options={tastes}
                        selectedIds={tasteIds}
                        onChange={(id) => handleToggle(setTasteIds, tasteIds, id, 3)}
                        placeholder="-- Select Taste --"
                        maxItems={3}
                    />

                    <MultiSelectDropdown
                        label="Glasses (Max 2)"
                        options={glasses}
                        selectedIds={glassIds}
                        onChange={(id) => handleToggle(setGlassIds, glassIds, id, 2)}
                        placeholder="-- Select Glass --"
                        maxItems={2}
                    />

                    <MultiSelectDropdown
                        label="Ice (Max 3)"
                        options={ices}
                        selectedIds={iceIds}
                        onChange={(id) => handleToggle(setIceIds, iceIds, id, 3)}
                        placeholder="-- Select Ice --"
                        maxItems={3}
                    />

                    <MultiSelectDropdown
                        label="Techniques (Max 2)"
                        options={techniques}
                        selectedIds={techniqueIds}
                        onChange={(id) => handleToggle(setTechniqueIds, techniqueIds, id, 2)}
                        placeholder="-- Select Technique --"
                        maxItems={2}
                    />

                    <MultiSelectDropdown
                        label="Garnishes (Max 3)"
                        options={garnishes}
                        selectedIds={garnishIds}
                        onChange={(id) => handleToggle(setGarnishIds, garnishIds, id, 3)}
                        placeholder="-- Select Garnish --"
                        maxItems={3}
                    />

                    {/* Image Preview Area */}
                    {pictureUrl && (
                        <div className="mt-8 pt-8 border-t border-white/10">
                            <label className="block text-sm text-[#888c94] mb-3 flex items-center gap-2">
                                <i className="ph-bold ph-eye text-[#00d2ff]"></i> Cocktail Preview
                            </label>
                            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#0b0c10]/50 border border-white/10 group shadow-2xl">
                                <img
                                    src={pictureUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).style.opacity = '0';
                                    }}
                                    onLoad={(e) => {
                                        (e.currentTarget as HTMLImageElement).style.opacity = '1';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-transparent pointer-events-none opacity-60"></div>
                                <div className="absolute bottom-5 left-5 right-5">
                                    <p className="text-white font-bold text-xl truncate drop-shadow-lg">{name || "Your Cocktail"}</p>
                                    <p className="text-[#00d2ff] text-[10px] font-black uppercase tracking-[0.2em]">Visual Verification</p>
                                </div>
                                {!pictureUrl.startsWith('http') && !pictureUrl.startsWith('/') && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                        <p className="text-xs text-white/40 bg-black/60 px-3 py-1.5 rounded-full border border-white/5">Invalid path format</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Recipe Grid */}
            <div className="pt-6 border-t border-white/10">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                        <i className="ph-fill ph-flask text-[#00d2ff]"></i> Recipe Ingredients (Max 8)
                    </h3>
                    <button type="button" onClick={addIngredient} disabled={ingredients.length >= 8}
                        className="text-xs bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20 disabled:opacity-50 flex items-center gap-1">
                        <i className="ph-bold ph-plus"></i> Add
                    </button>
                </div>

                {/* Headers */}
                <div className="hidden md:flex gap-3 px-2 mb-2 text-[10px] font-black text-[#888c94] uppercase tracking-wider">
                    <div className="w-8"></div>
                    <div className="flex-1">Ingredient</div>
                    <div className="w-24 text-center mr-10">Parts</div>
                </div>

                <div className="space-y-3">
                    {ingredients.map((ing, i) => (
                        <div key={i} className="flex gap-3 items-center bg-[#0b0c10]/30 p-2 rounded-xl border border-white/5">
                            <div className="w-8 text-center text-[#888c94] font-bold">{i + 1}</div>

                            <div className="flex-1">
                                <button
                                    type="button"
                                    onClick={() => setPickerOpen(i)}
                                    className={`w-full bg-[#0b0c10]/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-left flex items-center justify-between gap-2 hover:border-[#00d2ff]/40 transition-colors ${ing.name ? "text-white" : "text-[#888c94]"}`}
                                >
                                    <span className="truncate">{ing.name || "Select ingredient…"}</span>
                                    <i className="ph-bold ph-caret-down text-[#888c94] shrink-0 text-xs"></i>
                                </button>
                            </div>

                            <div className="relative flex items-center w-24">
                                <input
                                    type="text"
                                    value={ing.amount}
                                    onChange={e => updateIngredient(i, "amount", e.target.value)}
                                    className="w-full bg-[#0b0c10]/50 border border-white/10 rounded-lg pl-2 pr-6 py-2 text-sm text-white focus:ring-1 focus:ring-[#00d2ff] text-center uppercase"
                                    placeholder="Parts"
                                />
                                <div className="absolute right-1 flex flex-col justify-center h-full gap-[2px] py-1">
                                    <button type="button" onClick={() => handleAmountStep(i, 0.25)} className="text-[#888c94] hover:text-white leading-none p-1">
                                        <i className="ph-bold ph-caret-up text-[10px]"></i>
                                    </button>
                                    <button type="button" onClick={() => handleAmountStep(i, -0.25)} className="text-[#888c94] hover:text-white leading-none p-1">
                                        <i className="ph-bold ph-caret-down text-[10px]"></i>
                                    </button>
                                </div>
                            </div>

                            <button type="button" onClick={() => removeIngredient(i)} className="text-red-400 hover:text-red-300 p-2">
                                <i className="ph-bold ph-trash"></i>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Instructions & Let's Go */}
            <div className="pt-6 border-t border-white/10">
                <label className="block text-sm text-[#888c94] mb-1">Instructions (How to make it)</label>
                <textarea value={instruction} onChange={e => setInstruction(e.target.value)} rows={4}
                    className="w-full bg-[#0b0c10]/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-[#00d2ff] mb-8" />

                <div className="flex gap-4">
                    <button type="submit" disabled={loading}
                        className="flex-1 bg-[#00d2ff]/20 hover:bg-[#00d2ff]/30 text-[#00d2ff] border border-[#00d2ff]/20 font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                        {loading ? "Saving..." : <><i className="ph-bold ph-check"></i> Save Cocktail</>}
                    </button>
                    {initialData && (
                        <button type="button" onClick={handleDeleteClick} disabled={loading || isDeleting}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 font-bold px-8 rounded-xl text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                            title="Delete Cocktail">
                            <i className="ph-fill ph-trash text-2xl"></i>
                        </button>
                    )}
                </div>
            </div>

        </form>

        {pickerOpen !== null && (
            <BottlePickerModal
                bottles={bottles ?? []}
                title="Select Ingredient"
                onSelect={b => { updateIngredient(pickerOpen, "name", b.name); }}
                onClose={() => setPickerOpen(null)}
            />
        )}
        </>
    )
}
