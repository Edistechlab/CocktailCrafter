"use client"

import { useState, useEffect } from "react"

export function AgeVerification() {
    const [show, setShow] = useState(false)

    useEffect(() => {
        const verified = localStorage.getItem("age-verified")
        if (!verified) {
            setTimeout(() => {
                setShow(true)
                document.body.style.overflow = "hidden"
            }, 0)
        }
    }, [])

    const handleVerify = () => {
        localStorage.setItem("age-verified", "true")
        setShow(false)
        document.body.style.overflow = "auto"
    }

    if (!show) return null

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
            {/* Dark Backdrop with heavy blur */}
            <div className="absolute inset-0 bg-[#0b0c10]/95 backdrop-blur-2xl"></div>

            {/* Content Container */}
            <div className="relative max-w-xl w-full bg-[#1a1b21] border border-white/10 rounded-[48px] p-12 shadow-2xl text-center space-y-10 group">
                <div className="space-y-4">
                    <div className="flex justify-center">
                        <div className="w-20 h-20 bg-[#00d2ff]/10 rounded-3xl flex items-center justify-center mb-4">
                            <i className="ph-fill ph-shield-check text-[#00d2ff] text-4xl"></i>
                        </div>
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight italic">
                        Age Verification<span className="text-[#00d2ff]">.</span>
                    </h2>
                    <p className="text-[#888c94] font-medium leading-relaxed">
                        To access Cocktail Crafter, you must be of legal drinking age in your country.
                        Please confirm you are 18 years or older.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                        onClick={handleVerify}
                        className="flex-1 px-8 py-5 bg-[#00d2ff] text-black font-black uppercase tracking-widest text-[11px] rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(0,210,255,0.3)]"
                    >
                        I am 18 or older
                    </button>
                    <button
                        onClick={() => window.location.href = "https://www.responsibility.org"}
                        className="flex-1 px-8 py-5 bg-white/5 text-[#888c94] border border-white/10 font-black uppercase tracking-widest text-[11px] rounded-2xl hover:bg-white/10 hover:text-white transition-all"
                    >
                        I am under 18
                    </button>
                </div>

                <div className="text-[10px] text-[#888c94]/40 font-bold uppercase tracking-[0.2em]">
                    Please drink responsibly. By entering, you agree to our Terms of Use.
                </div>
            </div>
        </div>
    )
}
