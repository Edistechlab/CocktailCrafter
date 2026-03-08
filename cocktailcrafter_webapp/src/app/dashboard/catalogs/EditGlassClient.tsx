"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { GlassIcon } from "@/components/GlassIcon"

export default function EditGlassClient({ glass }: { glass: { id: string, name: string, description: string | null, instructions: string | null, volume: number | null, pictureUrl: string | null, affiliateLink: string | null } }) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [name, setName] = useState(glass.name)
    const [description, setDescription] = useState(glass.description || "")
    const [instructions, setInstructions] = useState(glass.instructions || "")
    const [volume, setVolume] = useState(glass.volume?.toString() || "")
    const [pictureUrl, setPictureUrl] = useState(glass.pictureUrl || "")
    const [affiliateLink, setAffiliateLink] = useState(glass.affiliateLink || "")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (open) {
            setName(glass.name)
            setDescription(glass.description || "")
            setInstructions(glass.instructions || "")
            setVolume(glass.volume?.toString() || "")
            setPictureUrl(glass.pictureUrl || "")
            setAffiliateLink(glass.affiliateLink || "")
        }
    }, [open, glass])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const res = await fetch(`/api/glasses/${glass.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, description, instructions, volume, pictureUrl, affiliateLink })
            })

            if (!res.ok) {
                const text = await res.text()
                throw new Error(text || "Failed to update glass")
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
                className="bg-[#1a1b21]/50 border border-white/5 rounded-xl p-4 cursor-pointer hover:bg-white/5 hover:border-white/20 transition-all group"
            >
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-[#00d2ff]/5 transition-colors">
                        <GlassIcon type={glass.name} className="w-6 h-6 text-white/40 group-hover:text-[#00d2ff]/60 transition-colors" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h4 className="font-bold text-white text-sm group-hover:text-[#00d2ff] transition-colors">{glass.name}</h4>
                            <i className="ph-fill ph-pencil-simple text-white/20 group-hover:text-[#00d2ff] transition-colors text-xs"></i>
                        </div>
                        {glass.volume && <span className="text-[10px] font-black text-[#888c94] uppercase tracking-widest">{glass.volume}ml Capacity</span>}
                    </div>
                </div>
                <p className="text-xs text-[#888c94] mb-2">{glass.description}</p>
                {glass.instructions && (
                    <div className="bg-[#00d2ff]/5 border border-[#00d2ff]/10 rounded-lg p-2.5">
                        <p className="text-[10px] font-black uppercase text-[#00d2ff] mb-1 tracking-widest flex items-center gap-1.5">
                            <i className="ph-fill ph-info"></i> Care & Chilling
                        </p>
                        <p className="text-xs text-[#888c94] leading-relaxed italic">{glass.instructions}</p>
                    </div>
                )}
            </div>

            {open && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-[#1a1b21] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <i className="ph-fill ph-pencil-simple text-[#00d2ff]"></i>
                                Edit Glassware
                            </h3>
                            <button onClick={() => setOpen(false)} className="text-[#888c94] hover:text-white transition-colors">
                                <i className="ph-bold ph-x text-xl"></i>
                            </button>
                        </div>

                        {/* Image Preview Area */}
                        {pictureUrl && (
                            <div className="w-full aspect-[21/14] bg-[#0b0c10] border-b border-white/5 relative overflow-hidden group/preview">
                                <img
                                    src={pictureUrl}
                                    alt={name}
                                    className="w-full h-full object-cover object-center opacity-60 group-hover/preview:opacity-100 group-hover/preview:scale-105 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1b21] via-[#1a1b21]/20 to-transparent pointer-events-none"></div>
                                <div className="absolute bottom-4 left-6">
                                    <div className="text-[10px] font-black uppercase text-[#00d2ff] tracking-[0.2em] mb-1">Visual Reference</div>
                                    <div className="text-white font-bold text-sm tracking-tight">{name}</div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-sm mb-4">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-[#888c94] mb-1.5">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="e.g. Coupette"
                                    className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none transition-all placeholder:text-white/20"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#888c94] mb-1.5">Volume (ml)</label>
                                    <input
                                        type="number"
                                        value={volume}
                                        onChange={e => setVolume(e.target.value)}
                                        placeholder="e.g. 180"
                                        className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none transition-all placeholder:text-white/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#888c94] mb-1.5">Description (Optional)</label>
                                    <input
                                        type="text"
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        placeholder="Classic stemmed glass"
                                        className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none transition-all placeholder:text-white/20"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#888c94] mb-1.5">Handling / Chilling Info (Optional)</label>
                                <textarea
                                    value={instructions}
                                    onChange={e => setInstructions(e.target.value)}
                                    placeholder="e.g. Always pre-chill in the freezer for 10 minutes..."
                                    rows={3}
                                    className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none transition-all placeholder:text-white/20"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#888c94] mb-1.5">Picture URL (Optional)</label>
                                <input
                                    type="text"
                                    value={pictureUrl}
                                    onChange={e => setPictureUrl(e.target.value)}
                                    placeholder="e.g. /images/glasses/coupe_glass.webp"
                                    className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none transition-all placeholder:text-white/20 text-xs font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#888c94] mb-1.5">Affiliate Link (Optional)</label>
                                <input
                                    type="url"
                                    value={affiliateLink}
                                    onChange={e => setAffiliateLink(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none transition-all placeholder:text-white/20 text-xs font-mono"
                                />
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
