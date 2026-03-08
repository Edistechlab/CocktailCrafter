import Link from "next/link"

export function FrontendFooter() {
    return (
        <footer className="bg-[#0b0c10]/80 border-t border-white/5 py-16 px-6 md:px-12 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center justify-between">
                <div className="flex flex-col items-center md:items-start space-y-4">
                    <div className="text-2xl font-black flex items-center gap-3 text-white">
                        <i className="ph-fill ph-martini text-[#00d2ff] text-[28px] drop-shadow-[0_0_10px_rgba(0,210,255,0.4)]"></i>
                        Cocktail<span className="text-[#00d2ff]">Crafter.</span>
                    </div>
                    <p className="text-[12px] text-[#888c94]/80 max-w-xs text-center md:text-left leading-relaxed">
                        Refining the artisan world of cocktails through modern engineering and standardized precision.
                    </p>
                </div>

                <div className="flex flex-col items-center md:items-end space-y-6">
                    <div className="flex flex-wrap justify-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-[#888c94]">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="/imprint" className="hover:text-white transition-colors">Imprint</Link>
                    </div>

                    <div className="text-xs text-[#888c94]/40 font-bold uppercase tracking-widest pt-4 md:pt-0">
                        &copy; {new Date().getFullYear()} Edi's Techlab & CADEMON
                    </div>
                </div>
            </div>
        </footer>
    )
}
