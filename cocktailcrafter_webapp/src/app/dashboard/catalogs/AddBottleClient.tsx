"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BottleIcon } from "@/components/BottleIcon"

const BOTTLE_DATA = [
    { category: "Absinthe", types: ["Verte", "Blanche", "Rouge", "Bohemian"] },
    { category: "Amaro", types: ["Amaro", "Aperitif Bitter"] },
    { category: "Aperitif Wine", types: ["Americano", "Aperitif Wine"] },
    { category: "Bitters", types: ["Angostura Bitters", "Orange Bitters", "Aromatic Bitters", "Walnut Bitters", "Celery Bitters", "Chocolate Bitters"] },
    { category: "Brandy", types: ["Cognac", "Armagnac", "Calvados", "Pisco", "American Brandy", "Spanish Brandy", "Brandy de Jerez"] },
    { category: "Gin", types: ["London Dry Gin", "Plymouth Gin", "Old Tom Gin", "Dry Gin", "New Western Gin", "Sloe Gin", "Genever", "Navy Strength Gin", "Barrel Aged Gin", "Contemporary Gin"] },
    { category: "Juice", types: ["Orange Juice", "Lemon Juice", "Lime Juice", "Cranberry Juice", "Pineapple Juice", "Grapefruit Juice", "Apple Juice", "Tomato Juice", "Passionfruit Juice"] },
    { category: "Liqueur", types: ["Orange Liqueur", "Coffee Liqueur", "Herbal Liqueur", "Chocolate Liqueur", "Almond Liqueur", "Anise Liqueur", "Coconut Liqueur", "Cream Liqueur", "Bitter Liqueur", "Aperitif Liqueur"] },
    { category: "Mezcal", types: ["Espadín", "Ensamble", "Tobalá"] },
    { category: "Rum", types: ["White Rum", "Gold Rum", "Dark Rum", "Spiced Rum", "Overproof Rum", "Rhum Agricole", "Agricole Rum", "Navy Rum", "Premium Aged Rum", "Aged", "Cachaça"] },
    { category: "Soft Drink", types: ["Cola", "Tonic Water", "Ginger Beer", "Lemonade", "Ginger Ale", "Soda Water", "Lemon-Lime Soda", "Bitter Lemon"] },
    { category: "Sparkling Wine", types: ["Champagne", "Prosecco", "Cava", "Sparkling Wine"] },
    { category: "Syrup", types: ["Simple Syrup", "Rich Syrup", "Flavored Syrup", "Agave Syrup", "Coconut Syrup", "Vanilla Syrup", "Orgeat Syrup", "Honey Syrup", "Grenadine"] },
    { category: "Tequila", types: ["Blanco", "Reposado", "Añejo", "Extra Añejo", "Mezcal"] },
    { category: "Vermouth", types: ["Dry Vermouth", "Sweet Vermouth", "Bianco Vermouth"] },
    { category: "Vodka", types: ["Classic Vodka", "Flavored Vodka", "Premium Vodka", "Potato Vodka"] },
    { category: "Whiskey", types: ["Bourbon", "Tennessee Whiskey", "Scotch Single Malt", "Scotch Blended", "Irish Whiskey", "Rye Whiskey", "Canadian Whisky", "Japanese Whisky"] },
    { category: "Wine", types: ["Red Wine", "White Wine", "Rose Wine"] },
]

export default function AddBottleClient({ allBottles }: { allBottles: { id: string, name: string }[] }) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [category, setCategory] = useState("")
    const [type, setType] = useState("")
    const [productName, setProductName] = useState("")
    const [description, setDescription] = useState("")
    const [aroma, setAroma] = useState("")
    const [tasteProfile, setTasteProfile] = useState("")
    const [texture, setTexture] = useState("")
    const [alcoholContent, setAlcoholContent] = useState("")
    const [sugarContent, setSugarContent] = useState("")
    const [acidity, setAcidity] = useState("")
    const [parentId, setParentId] = useState("")
    const [alternativeId, setAlternativeId] = useState("")
    const [nonAlcoholicId, setNonAlcoholicId] = useState("")
    const [country, setCountry] = useState("")
    const [affiliateLink, setAffiliateLink] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const availableTypes = category ? BOTTLE_DATA.find(d => d.category === category)?.types || [] : []

    const resetForm = () => {
        setName(""); setCategory(""); setType(""); setProductName("")
        setDescription(""); setAroma(""); setTasteProfile(""); setTexture("")
        setAlcoholContent(""); setSugarContent(""); setAcidity("")
        setParentId(""); setAlternativeId(""); setNonAlcoholicId("")
        setCountry(""); setAffiliateLink("")
        setError("")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)
        try {
            const res = await fetch("/api/bottles", {
                method: "POST",
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
                    parentId: parentId || null,
                    alternativeId: alternativeId || null,
                    nonAlcoholicId: nonAlcoholicId || null,
                    country: country || null,
                    affiliateLink: affiliateLink || null,
                })
            })
            if (!res.ok) {
                const text = await res.text()
                throw new Error(text || "Failed to add bottle")
            }
            setOpen(false)
            resetForm()
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="text-sm bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 text-[#00d2ff] font-bold py-1.5 px-4 rounded-lg transition-colors flex items-center gap-2"
            >
                <i className="ph-bold ph-plus"></i> Add New
            </button>

            {open && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-[#1a1b21] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <BottleIcon className="w-6 h-6 text-[#00d2ff]" />
                                Add New Ingredient Profile
                            </h3>
                            <button onClick={() => { setOpen(false); resetForm() }} className="text-[#888c94] hover:text-white transition-colors">
                                <i className="ph-bold ph-x text-xl"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Category / Type / Product Name */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#888c94] mb-1.5">Category</label>
                                    <select
                                        value={category}
                                        onChange={e => { setCategory(e.target.value); setType("") }}
                                        className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none transition-all"
                                    >
                                        <option value="">Select Category...</option>
                                        {BOTTLE_DATA.map(d => (
                                            <option key={d.category} value={d.category}>{d.category}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#888c94] mb-1.5">Type</label>
                                    <select
                                        value={type}
                                        onChange={e => setType(e.target.value)}
                                        disabled={!category}
                                        className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none transition-all disabled:opacity-50"
                                    >
                                        <option value="">Select Type...</option>
                                        {availableTypes.map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
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

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-[#888c94] mb-1.5">Display Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="e.g. Maker's Mark Bourbon"
                                    className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none transition-all placeholder:text-white/20"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-[#888c94] mb-1.5">Description</label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="e.g. Sweet, full-bodied Kentucky Bourbon"
                                    className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none transition-all placeholder:text-white/20"
                                />
                            </div>

                            {/* Aroma / Taste / Texture */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#888c94] mb-1.5">Aroma</label>
                                    <input type="text" value={aroma} onChange={e => setAroma(e.target.value)} placeholder="e.g. Vanilla, Oak" className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none placeholder:text-white/20" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#888c94] mb-1.5">Taste Profile</label>
                                    <input type="text" value={tasteProfile} onChange={e => setTasteProfile(e.target.value)} placeholder="e.g. Sweet, Spicy" className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none placeholder:text-white/20" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#888c94] mb-1.5">Texture</label>
                                    <input type="text" value={texture} onChange={e => setTexture(e.target.value)} placeholder="e.g. Silky, Full-bodied" className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none placeholder:text-white/20" />
                                </div>
                            </div>

                            {/* Numeric values */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#888c94] mb-1.5">Alcohol (%)</label>
                                    <input type="number" step="0.1" value={alcoholContent} onChange={e => setAlcoholContent(e.target.value)} placeholder="e.g. 40" className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none placeholder:text-white/20" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#888c94] mb-1.5">Sugar (g/100ml)</label>
                                    <input type="number" step="0.1" value={sugarContent} onChange={e => setSugarContent(e.target.value)} placeholder="e.g. 25" className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none placeholder:text-white/20" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#888c94] mb-1.5">Acidity (0–10)</label>
                                    <input type="number" step="0.1" value={acidity} onChange={e => setAcidity(e.target.value)} placeholder="e.g. 3" className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none placeholder:text-white/20" />
                                </div>
                            </div>

                            {/* Country & Affiliate */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                <div>
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

                            {/* Relations */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#888c94] mb-1.5">Parent Category</label>
                                    <select value={parentId} onChange={e => setParentId(e.target.value)} className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none transition-all">
                                        <option value="">None (root node)</option>
                                        {allBottles.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#888c94] mb-1.5">Alternative Bottle</label>
                                    <select value={alternativeId} onChange={e => setAlternativeId(e.target.value)} className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none transition-all">
                                        <option value="">None</option>
                                        {allBottles.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#888c94] mb-1.5">Non-Alcoholic Alternative</label>
                                    <select value={nonAlcoholicId} onChange={e => setNonAlcoholicId(e.target.value)} className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none transition-all">
                                        <option value="">None</option>
                                        {allBottles.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => { setOpen(false); resetForm() }} className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 px-4 rounded-xl transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5] hover:opacity-90 text-black font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50">
                                    {loading ? "Adding..." : "Add Ingredient"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
