"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BottleIcon } from "@/components/BottleIcon"

// Bottle Categories and Types Data
const BOTTLE_DATA = [
  { category: "Absinthe", types: ["Verte", "Blanche", "Rouge"] },
  { category: "Amaro", types: ["Amaro"] },
  { category: "Aperitif Wine", types: ["Aperitif Wine"] },
  { category: "Bitters", types: ["Angostura Bitters", "Orange Bitters", "Aromatic Bitters", "Walnut Bitters", "Celery Bitters", "Chocolate Bitters"] },
  { category: "Brandy", types: ["Cognac", "Armagnac", "Brandy de Jerez"] },
  { category: "Gin", types: ["London Dry Gin", "Plymouth Gin", "Old Tom Gin", "Dry Gin", "New Western Gin", "Sloe Gin", "Genever", "Navy Strength Gin", "Barrel Aged Gin", "Contemporary Gin"] },
  { category: "Juice", types: ["Orange Juice", "Lemon Juice", "Lime Juice", "Cranberry Juice", "Pineapple Juice", "Grapefruit Juice", "Apple Juice"] },
  { category: "Liqueur", types: ["Orange Liqueur", "Coffee Liqueur", "Herbal Liqueur", "Chocolate Liqueur", "Almond Liqueur", "Anise Liqueur", "Coconut Liqueur"] },
  { category: "Mezcal", types: ["Mezcal Joven", "Mezcal Reposado", "Mezcal Anejo"] },
  { category: "Rum", types: ["White Rum", "Gold Rum", "Dark Rum", "Spiced Rum", "Overproof Rum", "Rhum Agricole", "Navy Rum", "Premium Aged Rum"] },
  { category: "Soft Drink", types: ["Cola", "Tonic Water", "Ginger Beer", "Lemonade", "Ginger Ale", "Grenadine", "Soda Water", "Lemon-Lime Soda", "Bitter Lemon"] },
  { category: "Sparkling Wine", types: ["Champagne", "Prosecco", "Cava", "Sparkling Wine"] },
  { category: "Syrup", types: ["Simple Syrup", "Rich Syrup", "Flavored Syrup", "Agave Syrup", "Coconut Syrup", "Vanilla Syrup"] },
  { category: "Tequila", types: ["Blanco Tequila", "Reposado Tequila", "Anejo Tequila", "Mezcal"] },
  { category: "Vermouth", types: ["Dry Vermouth", "Sweet Vermouth", "Bianco Vermouth", "Rotwein"] },
  { category: "Vodka", types: ["Classic Vodka", "Flavored Vodka", "Premium Vodka"] },
  { category: "Whiskey", types: ["Bourbon", "Tennessee Whiskey", "Scotch Single Malt", "Scotch Blended", "Irish Whiskey", "Rye Whiskey", "Canadian Whisky", "Japanese Whisky"] },
  { category: "Wine", types: ["Red Wine", "White Wine", "Rose Wine"] },
]

export default function EditBottleClient({ bottle, allBottles }: {
    bottle: {
        id: string,
        name: string,
        category: string | null,
        type: string | null,
        productName: string | null,
        description: string | null,
        aroma: string | null,
        tasteProfile: string | null,
        texture: string | null,
        alcoholContent: number | null,
        sugarContent: number | null,
        acidity: number | null,
        parentId: string | null,
        alternativeId: string | null,
        nonAlcoholicId: string | null,
        country: string | null,
        affiliateLink: string | null,
    },
    allBottles?: { id: string, name: string }[]
}) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [name, setName] = useState(bottle.name)
    const [category, setCategory] = useState(bottle.category || "")
    const [type, setType] = useState(bottle.type || "")
    const [productName, setProductName] = useState(bottle.productName || "")
    const [description, setDescription] = useState(bottle.description || "")
    const [aroma, setAroma] = useState(bottle.aroma || "")
    const [tasteProfile, setTasteProfile] = useState(bottle.tasteProfile || "")
    const [texture, setTexture] = useState(bottle.texture || "")
    const [alcoholContent, setAlcoholContent] = useState(bottle.alcoholContent?.toString() || "")
    const [sugarContent, setSugarContent] = useState(bottle.sugarContent?.toString() || "")
    const [acidity, setAcidity] = useState(bottle.acidity?.toString() || "")
    const [alternativeId, setAlternativeId] = useState(bottle.alternativeId || "")
    const [nonAlcoholicId, setNonAlcoholicId] = useState(bottle.nonAlcoholicId || "")
    const [country, setCountry] = useState(bottle.country || "")
    const [affiliateLink, setAffiliateLink] = useState(bottle.affiliateLink || "")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // Update states when bottle changes
    useEffect(() => {
        setName(bottle.name)
        setCategory(bottle.category || "")
        setType(bottle.type || "")
        setProductName(bottle.productName || "")
        setDescription(bottle.description || "")
        setAroma(bottle.aroma || "")
        setTasteProfile(bottle.tasteProfile || "")
        setTexture(bottle.texture || "")
        setAlcoholContent(bottle.alcoholContent?.toString() || "")
        setSugarContent(bottle.sugarContent?.toString() || "")
        setAcidity(bottle.acidity?.toString() || "")
        setAlternativeId(bottle.alternativeId || "")
        setNonAlcoholicId(bottle.nonAlcoholicId || "")
        setCountry(bottle.country || "")
        setAffiliateLink(bottle.affiliateLink || "")
    }, [bottle])

    // Get available types for selected category
    const availableTypes = category ? BOTTLE_DATA.find(d => d.category === category)?.types || [] : []

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const res = await fetch(`/api/bottles/${bottle.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    category: category || null,
                    type: type || null,
                    productName: productName || null,
                    description: description || null,
                    aroma: aroma || null,
                    tasteProfile: tasteProfile || null,
                    texture: texture || null,
                    alcoholContent: alcoholContent ? parseFloat(alcoholContent) : null,
                    sugarContent: sugarContent ? parseFloat(sugarContent) : 0,
                    acidity: acidity ? parseFloat(acidity) : 0,
                    alternativeId: alternativeId || null,
                    nonAlcoholicId: nonAlcoholicId || null,
                    country: country || null,
                    affiliateLink: affiliateLink || null,
                })
            })

            if (!res.ok) {
                const text = await res.text()
                throw new Error(text || "Failed to update bottle")
            }

            setOpen(false)
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div
                onClick={() => setOpen(true)}
                className="bg-[#1a1b21]/50 border border-white/5 rounded-2xl p-4 cursor-pointer hover:bg-white/5 hover:border-white/20 transition-all group flex gap-4 items-start relative"
            >
                {/* Icon */}
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#00d2ff]/10 transition-colors mt-0.5">
                    <BottleIcon className="w-5 h-5 text-white/30 group-hover:text-[#00d2ff] transition-colors" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Name & Alcohol */}
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                        <h4 className="font-bold text-base text-white group-hover:text-[#00d2ff] transition-colors line-clamp-1 leading-tight flex-1">
                            {bottle.name}
                        </h4>
                        {bottle.alcoholContent !== null && (
                            <span className={`shrink-0 text-[10px] font-black px-2 py-0.5 rounded border transition-colors whitespace-nowrap ${bottle.alcoholContent === 0
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-[#00d2ff]/10 text-[#00d2ff] border-[#00d2ff]/20"
                                }`}>
                                {bottle.alcoholContent}%
                            </span>
                        )}
                    </div>

                    {/* Category & Type Badges */}
                    <div className="flex gap-1.5 flex-wrap mb-2">
                        {bottle.category && (
                            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/25 rounded-md">
                                {bottle.category}
                            </span>
                        )}
                        {bottle.type && (
                            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-white/8 text-white/60 border border-white/15 rounded-md">
                                {bottle.type}
                            </span>
                        )}
                    </div>

                    {/* Description preview */}
                    {bottle.description && (
                        <p className="text-xs text-white/30 line-clamp-1 leading-relaxed">
                            {bottle.description}
                        </p>
                    )}
                </div>
            </div>

            {open && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-[#1a1b21] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <BottleIcon className="w-6 h-6 text-[#00d2ff]" />
                                Edit Ingredient Profile
                            </h3>
                            <button onClick={() => setOpen(false)} className="text-[#888c94] hover:text-white transition-colors">
                                <i className="ph-bold ph-x text-xl"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-sm mb-4">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Category Dropdown */}
                                <div>
                                    <label className="block text-sm font-medium text-[#888c94] mb-1.5">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => {
                                            setCategory(e.target.value)
                                            setType("") // Reset type when category changes
                                        }}
                                        className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none transition-all"
                                    >
                                        <option value="">Select Category...</option>
                                        {BOTTLE_DATA.map(data => (
                                            <option key={data.category} value={data.category}>
                                                {data.category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Type Dropdown */}
                                <div>
                                    <label className="block text-sm font-medium text-[#888c94] mb-1.5">Type</label>
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        disabled={!category}
                                        className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="">Select Type...</option>
                                        {availableTypes.map(t => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Product Name Input */}
                                <div>
                                    <label className="block text-sm font-medium text-[#888c94] mb-1.5">Product Name</label>
                                    <input
                                        type="text"
                                        value={productName}
                                        onChange={e => setProductName(e.target.value)}
                                        placeholder="e.g. Maker's Mark"
                                        className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none transition-all placeholder:text-white/20"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-[#888c94] mb-1.5">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="e.g. Ginger Beer"
                                        className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none transition-all placeholder:text-white/20"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-[#888c94] mb-1.5">Description (Optional)</label>
                                    <input
                                        type="text"
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        placeholder="e.g. Spicy ginger soda"
                                        className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none transition-all placeholder:text-white/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#888c94] mb-1.5">Aroma</label>
                                    <input
                                        type="text"
                                        value={aroma}
                                        onChange={e => setAroma(e.target.value)}
                                        placeholder="e.g. Citrus, Herbal"
                                        className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none transition-all placeholder:text-white/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#888c94] mb-1.5">Taste Profile</label>
                                    <input
                                        type="text"
                                        value={tasteProfile}
                                        onChange={e => setTasteProfile(e.target.value)}
                                        placeholder="e.g. Sweet, Bitter"
                                        className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none transition-all placeholder:text-white/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#888c94] mb-1.5">Texture</label>
                                    <input
                                        type="text"
                                        value={texture}
                                        onChange={e => setTexture(e.target.value)}
                                        placeholder="e.g. Silky, Carbonated"
                                        className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none transition-all placeholder:text-white/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#888c94] mb-1.5">Alcohol Content (%)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={alcoholContent}
                                        onChange={e => setAlcoholContent(e.target.value)}
                                        placeholder="e.g. 40"
                                        className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none transition-all placeholder:text-white/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#888c94] mb-1.5">Sugar (g/100ml)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={sugarContent}
                                        onChange={e => setSugarContent(e.target.value)}
                                        placeholder="e.g. 25"
                                        className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none transition-all placeholder:text-white/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#888c94] mb-1.5">Acidity (Level 0-10)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={acidity}
                                        onChange={e => setAcidity(e.target.value)}
                                        placeholder="e.g. 7"
                                        className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none transition-all placeholder:text-white/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#888c94] mb-1.5">Alternative Bottle</label>
                                    <select
                                        value={alternativeId}
                                        onChange={e => setAlternativeId(e.target.value)}
                                        className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none transition-all"
                                    >
                                        <option value="">None</option>
                                        {(allBottles || []).filter(b => b.id !== bottle.id).map(b => (
                                            <option key={b.id} value={b.id}>{b.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#888c94] mb-1.5">Non-Alcoholic Alternative</label>
                                    <select
                                        value={nonAlcoholicId}
                                        onChange={e => setNonAlcoholicId(e.target.value)}
                                        className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none transition-all"
                                    >
                                        <option value="">None</option>
                                        {(allBottles || []).filter(b => b.id !== bottle.id).map(b => (
                                            <option key={b.id} value={b.id}>{b.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#888c94] mb-1.5">Country of Origin</label>
                                    <input
                                        type="text"
                                        value={country}
                                        onChange={e => setCountry(e.target.value)}
                                        placeholder="e.g. Scotland, Mexico, France"
                                        className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none transition-all placeholder:text-white/20"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-[#888c94] mb-1.5">
                                        Affiliate Link
                                        <span className="ml-2 text-[10px] text-white/20 font-normal normal-case tracking-normal">not visible in overview</span>
                                    </label>
                                    <input
                                        type="url"
                                        value={affiliateLink}
                                        onChange={e => setAffiliateLink(e.target.value)}
                                        placeholder="https://..."
                                        className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none transition-all placeholder:text-white/20"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 px-4 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5] hover:opacity-90 text-black font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50"
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
