"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { BottleIcon } from "./BottleIcon"

export function DashboardSidebar() {
    const pathname = usePathname()
    const { data: session } = useSession()
    const [viewAsUser, setViewAsUser] = useState(false)

    const isSuperAdmin = session?.user?.role === "SUPER_ADMIN"

    const allLinks = [
        { name: "Overview", href: "/dashboard", icon: <i className="ph ph-squares-four text-xl"></i> },
        { name: "Cocktails", href: "/dashboard/cocktails", icon: <i className="ph ph-martini text-xl"></i> },
        { name: "Bottles", href: "/dashboard/bottles", icon: <BottleIcon className="w-5 h-5" /> },
        { name: "Favorites", href: "/dashboard/favorites", icon: <i className="ph ph-heart text-xl"></i> },
        { name: "Sets", href: "/dashboard/sets", icon: <i className="ph ph-books text-xl"></i> },
        { name: "Catalogs", href: "/dashboard/catalogs", icon: <i className="ph ph-list-dashes text-xl"></i> },
        { name: "Users", href: "/dashboard/users", icon: <i className="ph ph-users text-xl"></i> },
        { name: "Settings", href: "/dashboard/settings", icon: <i className="ph ph-gear text-xl"></i> },
    ]

    const userOnlyLinks = ["Favorites", "Sets", "Settings"]

    const links = isSuperAdmin && !viewAsUser
        ? allLinks
        : allLinks.filter(link => userOnlyLinks.includes(link.name))

    return (
        <aside className="w-64 bg-[#1a1b21] border-r border-white/5 hidden md:flex flex-col h-screen fixed top-0 left-0 pt-6">
            <div className="px-6 mb-4 flex items-center gap-3">
                <i className="ph-fill ph-martini text-[#00d2ff] text-2xl"></i>
                <h2 className="text-white font-bold text-lg tracking-wide">CrafterAdmin</h2>
            </div>

            {/* User Profile Section */}
            <div className="px-6 mb-4 mt-2">
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00d2ff]/20 to-[#3a7bd5]/20 flex items-center justify-center border border-white/10 shrink-0">
                        <i className="ph-fill ph-user text-[#00d2ff] text-xl"></i>
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-white font-black text-sm truncate uppercase tracking-tighter">
                            {session?.user?.name || "Mixologist"}
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <p className="text-[10px] text-[#888c94] font-bold uppercase tracking-widest truncate">
                                {isSuperAdmin ? "Super Admin" : "Crafter"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* View-as-User toggle — only for Super Admin */}
            {isSuperAdmin && (
                <div className="px-6 mb-4">
                    <button
                        onClick={() => setViewAsUser(v => !v)}
                        className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                            viewAsUser
                                ? "bg-orange-500/20 border border-orange-500/40 text-orange-400 hover:bg-orange-500/30"
                                : "bg-white/5 border border-white/5 text-[#888c94] hover:bg-white/10 hover:text-white"
                        }`}
                    >
                        <i className={`ph-bold ${viewAsUser ? "ph-eye-slash" : "ph-eye"} text-base`}></i>
                        {viewAsUser ? "Exit User View" : "Preview as User"}
                    </button>
                </div>
            )}

            <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                {links.map((link) => {
                    const isActive = link.href === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname.startsWith(link.href)
                    return (
                        <div key={link.name}>
                            <Link
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? "bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/20"
                                    : "text-[#888c94] hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <span className={`${isActive ? "text-[#00d2ff]" : "text-[#888c94] group-hover:text-white"}`}>
                                    {link.icon}
                                </span>
                                <span className="font-medium text-sm">{link.name}</span>
                            </Link>
                            {link.note && (
                                <p className="text-[10px] text-[#555] px-4 pb-1 -mt-1 tracking-wide">{link.note}</p>
                            )}
                        </div>
                    )
                })}

                <div className="pt-4 mt-4 border-t border-white/5 space-y-1">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 text-[#888c94] hover:bg-white/5 hover:text-[#00d2ff] transition-all group rounded-xl"
                    >
                        <i className="ph ph-globe text-xl group-hover:drop-shadow-[0_0_8px_rgba(0,210,255,0.4)]"></i>
                        <span className="font-bold text-[10px] tracking-widest uppercase opacity-70">Visit Website</span>
                    </Link>
                </div>
            </nav>

            <div className="p-4 border-t border-white/5">
                <form action="/api/auth/signout" method="POST">
                    <button type="submit" className="flex items-center gap-3 px-4 py-3 w-full text-left text-[#888c94] hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                        <i className="ph ph-sign-out text-xl"></i>
                        <span className="font-medium text-sm">Sign Out</span>
                    </button>
                </form>
            </div>
        </aside>
    )
}
