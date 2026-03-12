"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"

export function FrontendNavbar() {
    const { data: session, status } = useSession()
    const loading = status === "loading"
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <nav className="fixed top-0 left-0 w-full bg-[#0b0c10]/70 backdrop-blur-xl border-b border-white/5 z-[1000] transition-all">
            <div className="max-w-7xl mx-auto h-[80px] px-6 md:px-12 flex items-center justify-between">
                <Link href="/" className="text-2xl font-black flex items-center gap-3 text-white hover:scale-[1.02] transition-transform">
                    <div className="w-10 h-10 bg-[#00d2ff]/10 rounded-xl border border-[#00d2ff]/20 flex items-center justify-center shadow-[0_0_15px_rgba(0,210,255,0.2)]">
                        <i className="ph-fill ph-martini text-[#00d2ff] text-2xl"></i>
                    </div>
                    <span className="tracking-tighter">Cocktail<span className="text-[#00d2ff]/80">Crafter.</span></span>
                </Link>

                {/* Desktop menu */}
                <div className="hidden md:flex items-center gap-14">
                    <Link href="/cocktails" className="text-[13px] font-black uppercase tracking-[0.2em] text-[#888c94] hover:text-[#00d2ff] transition-colors whitespace-nowrap">
                        Cocktails
                    </Link>
                    <Link href="/glassware" className="text-[13px] font-black uppercase tracking-[0.2em] text-[#888c94] hover:text-[#00d2ff] transition-colors whitespace-nowrap">
                        Glassware
                    </Link>
                    <Link href="/campaign" className="text-[13px] font-black uppercase tracking-[0.2em] text-[#888c94] hover:text-[#00d2ff] transition-colors whitespace-nowrap">
                        Campaign
                    </Link>

                    <div className="h-4 w-px bg-white/10"></div>

                    {!loading && (
                        <>
                            {session ? (
                                <div className="flex items-center gap-4">
                                    <Link
                                        href="/dashboard/cocktails"
                                        className="px-6 py-2.5 bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 text-[#00d2ff] text-[11px] font-black uppercase tracking-[0.2em] border border-[#00d2ff]/40 rounded-xl transition-all shadow-[0_0_15px_rgba(0,210,255,0.1)] flex items-center gap-2"
                                    >
                                        <i className="ph-fill ph-layout text-sm"></i>
                                        {session.user?.role === "SUPER_ADMIN" ? "Admin" : "My Crafter"}
                                    </Link>
                                    <button
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                        className="px-6 py-2.5 bg-red-500/5 hover:bg-red-500/10 text-red-500/60 hover:text-red-500 text-[11px] font-black uppercase tracking-[0.2em] border border-red-500/20 hover:border-red-500/40 rounded-xl transition-all flex items-center gap-2"
                                    >
                                        <i className="ph-fill ph-sign-out text-sm"></i>
                                        Log Out
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="px-6 py-2.5 bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 text-[#00d2ff] text-[11px] font-black uppercase tracking-[0.2em] border border-[#00d2ff]/40 rounded-xl transition-all shadow-[0_0_15px_rgba(0,210,255,0.1)]"
                                >
                                    Sign In
                                </Link>
                            )}
                        </>
                    )}
                </div>

                {/* Hamburger button */}
                <button
                    className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[6px]"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Menu"
                >
                    <span className={`block w-6 h-[2px] bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`block w-6 h-[2px] bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block w-6 h-[2px] bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </button>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="md:hidden bg-[#0b0c10]/95 backdrop-blur-xl border-t border-white/5 px-6 py-6 flex flex-col gap-6">
                    <Link href="/cocktails" onClick={() => setMenuOpen(false)} className="text-[13px] font-black uppercase tracking-[0.2em] text-[#888c94] hover:text-[#00d2ff] transition-colors">
                        Cocktails
                    </Link>
                    <Link href="/glassware" onClick={() => setMenuOpen(false)} className="text-[13px] font-black uppercase tracking-[0.2em] text-[#888c94] hover:text-[#00d2ff] transition-colors">
                        Glassware
                    </Link>
                    <Link href="/campaign" onClick={() => setMenuOpen(false)} className="text-[13px] font-black uppercase tracking-[0.2em] text-[#888c94] hover:text-[#00d2ff] transition-colors">
                        Campaign
                    </Link>

                    <div className="h-px w-full bg-white/10"></div>

                    {!loading && (
                        <>
                            {session ? (
                                <div className="flex flex-col gap-3">
                                    <Link
                                        href="/dashboard/cocktails"
                                        onClick={() => setMenuOpen(false)}
                                        className="px-6 py-3 bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 text-[#00d2ff] text-[11px] font-black uppercase tracking-[0.2em] border border-[#00d2ff]/40 rounded-xl transition-all flex items-center gap-2 justify-center"
                                    >
                                        <i className="ph-fill ph-layout text-sm"></i>
                                        {session.user?.role === "SUPER_ADMIN" ? "Admin" : "My Crafter"}
                                    </Link>
                                    <button
                                        onClick={() => { signOut({ callbackUrl: '/' }); setMenuOpen(false) }}
                                        className="px-6 py-3 bg-red-500/5 hover:bg-red-500/10 text-red-500/60 hover:text-red-500 text-[11px] font-black uppercase tracking-[0.2em] border border-red-500/20 hover:border-red-500/40 rounded-xl transition-all flex items-center gap-2 justify-center"
                                    >
                                        <i className="ph-fill ph-sign-out text-sm"></i>
                                        Log Out
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setMenuOpen(false)}
                                    className="px-6 py-3 bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 text-[#00d2ff] text-[11px] font-black uppercase tracking-[0.2em] border border-[#00d2ff]/40 rounded-xl transition-all text-center"
                                >
                                    Sign In
                                </Link>
                            )}
                        </>
                    )}
                </div>
            )}
        </nav>
    )
}
