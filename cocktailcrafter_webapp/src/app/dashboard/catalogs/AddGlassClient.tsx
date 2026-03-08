"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AddGlassClient() {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [instructions, setInstructions] = useState("")
    const [volume, setVolume] = useState("")
    const [pictureUrl, setPictureUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const res = await fetch("/api/glasses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, description, instructions, volume, pictureUrl })
            })

            if (!res.ok) {
                const text = await res.text()
                throw new Error(text || "Failed to add glass")
            }

            setOpen(false)
            setName("")
            setDescription("")
            setInstructions("")
            setVolume("")
            setPictureUrl("")
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
                    <div className="bg-[#1a1b21] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <i className="ph-fill ph-brandy text-[#00d2ff]"></i>
                                Add New Glassware
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
                                    {loading ? "Adding..." : "Add Glassware"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
