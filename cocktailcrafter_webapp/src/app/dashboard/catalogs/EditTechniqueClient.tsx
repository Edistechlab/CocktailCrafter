"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function EditTechniqueClient({ technique }: { technique: { id: string, name: string, description: string | null, instructions: string | null } }) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [name, setName] = useState(technique.name)
    const [description, setDescription] = useState(technique.description || "")
    const [instructions, setInstructions] = useState(technique.instructions || "")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    // Sync state when technique prop or open state changes
    useEffect(() => {
        if (open) {
            setName(technique.name)
            setDescription(technique.description || "")
            setInstructions(technique.instructions || "")
        }
    }, [open, technique])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const res = await fetch(`/api/techniques/${technique.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, description, instructions })
            })

            if (!res.ok) {
                const text = await res.text()
                throw new Error(text || "Failed to update technique")
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
                <div className="flex justify-between items-start">
                    <h4 className="font-medium text-white mb-1 group-hover:text-[#00d2ff] transition-colors">{technique.name}</h4>
                    <i className="ph-fill ph-pencil-simple text-white/20 group-hover:text-[#00d2ff] transition-colors"></i>
                </div>
                <p className="text-sm text-[#888c94] mb-2">{technique.description}</p>
                {technique.instructions && (
                    <div className="bg-[#00d2ff]/5 border border-[#00d2ff]/10 rounded-lg p-2.5">
                        <p className="text-[10px] font-black uppercase text-[#00d2ff] mb-1 tracking-widest flex items-center gap-1.5">
                            <i className="ph-fill ph-info"></i> Guide
                        </p>
                        <p className="text-xs text-[#888c94] leading-relaxed italic">{technique.instructions}</p>
                    </div>
                )}
            </div>

            {open && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-[#1a1b21] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <i className="ph-fill ph-pencil-simple text-[#00d2ff]"></i>
                                Edit Technique
                            </h3>
                            <button onClick={() => setOpen(false)} className="text-[#888c94] hover:text-white transition-colors">
                                <i className="ph-bold ph-x text-xl"></i>
                            </button>
                        </div>

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
                                    placeholder="e.g. Dry Shake"
                                    className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none transition-all placeholder:text-white/20"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#888c94] mb-1.5">Description (Optional)</label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="e.g. Shake without ice first"
                                    className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none transition-all placeholder:text-white/20"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#888c94] mb-1.5">Step-by-Step Instructions (Optional)</label>
                                <textarea
                                    value={instructions}
                                    onChange={e => setInstructions(e.target.value)}
                                    placeholder="e.g. Fill shaker with ice, shake vigorously for 12 seconds..."
                                    rows={3}
                                    className="w-full bg-[#0b0c10] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#00d2ff] outline-none transition-all placeholder:text-white/20"
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
