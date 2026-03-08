"use client"

import { useRouter } from "next/navigation"
import { useState, useMemo } from "react"

interface User {
    id: string
    firstName: string | null
    lastName: string | null
    email: string | null
    emailVerified: Date | null
    role: string
    createdAt: Date
    _count: {
        cocktails: number
        favorites: number
    }
}

interface UsersListClientProps {
    users: User[]
    currentUserRole: string
}

export default function UsersListClient({ users, currentUserRole }: UsersListClientProps) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const [userToDelete, setUserToDelete] = useState<{ id: string, name: string } | null>(null)
    const [isUpdating, setIsUpdating] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<"all" | "verified" | "pending">("all")

    const [sortField, setSortField] = useState<"firstName" | "lastName" | "email" | "cocktails" | "favorites">("firstName")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

    const roles = ["USER", "MODERATOR", "ADMIN", "SUPER_ADMIN"]

    const filteredUsers = useMemo(() => {
        let result = users.filter(user => {
            const matchesSearch =
                (user.firstName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
                (user.lastName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
                (user.email?.toLowerCase() || "").includes(searchQuery.toLowerCase())

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "verified" && user.emailVerified) ||
                (statusFilter === "pending" && !user.emailVerified)

            return matchesSearch && matchesStatus
        })

        return [...result].sort((a, b) => {
            let valA: any, valB: any;

            if (sortField === "cocktails") {
                valA = a._count.cocktails;
                valB = b._count.cocktails;
            } else if (sortField === "favorites") {
                valA = a._count.favorites;
                valB = b._count.favorites;
            } else {
                valA = (a[sortField] || "").toLowerCase();
                valB = (b[sortField] || "").toLowerCase();
            }

            if (valA < valB) return sortOrder === "asc" ? -1 : 1;
            if (valA > valB) return sortOrder === "asc" ? 1 : -1;
            return 0;
        })
    }, [users, searchQuery, statusFilter, sortField, sortOrder])

    const toggleSort = (field: "firstName" | "lastName" | "email" | "cocktails" | "favorites") => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortOrder("asc")
        }
    }

    const confirmDelete = (userId: string, userName: string) => {
        setUserToDelete({ id: userId, name: userName })
    }

    const executeDelete = async () => {
        if (!userToDelete) return;

        const userId = userToDelete.id;
        setIsDeleting(userId)
        setUserToDelete(null)

        try {
            const res = await fetch(`/api/users/${userId}`, {
                method: "DELETE"
            })

            if (res.ok) {
                router.refresh()
            } else {
                const error = await res.json()
                alert(error.message || "Failed to delete user")
            }
        } catch (err: any) {
            console.error(err)
            alert(err?.message || "An error occurred while deleting the user")
        } finally {
            setIsDeleting(null)
        }
    }

    const handleRoleChange = async (userId: string, newRole: string) => {
        setIsUpdating(userId)
        try {
            const res = await fetch(`/api/users/${userId}`, {
                method: "PATCH",
                body: JSON.stringify({ role: newRole }),
                headers: { "Content-Type": "application/json" }
            })

            if (res.ok) {
                router.refresh()
            } else {
                const error = await res.json()
                alert(error.message || "Failed to update role")
            }
        } catch (err) {
            console.error(err)
            alert("An error occurred while updating the role")
        } finally {
            setIsUpdating(null)
        }
    }

    const isSuperAdmin = currentUserRole === "SUPER_ADMIN"

    return (
        <div className="space-y-6 relative">
            {/* Custom Confirm Modal */}
            {userToDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-[#1a1b21] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden animate-fade-in">
                        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-red-500/10 blur-[60px] rounded-full pointer-events-none -mr-20 -mt-20"></div>
                        <h3 className="text-2xl font-bold mb-2 flex items-center gap-3 text-red-400">
                            <i className="ph-fill ph-warning-circle text-3xl"></i> Delete User
                        </h3>
                        <p className="text-[#888c94] mb-8 leading-relaxed">
                            Are you sure you want to delete <strong className="text-white">"{userToDelete.name}"</strong>? This will permanently remove all their Cocktails and Favorites. This action cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setUserToDelete(null)}
                                className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={executeDelete}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)]"
                            >
                                Delete User
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#1a1b21]/40 p-4 rounded-2xl border border-white/5">
                <div className="relative w-full md:max-w-md">
                    <i className="ph ph-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[#888c94]"></i>
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#0b0c10]/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#00d2ff]/50 transition-all text-sm"
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <button
                        onClick={() => setStatusFilter("all")}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${statusFilter === "all"
                            ? "bg-[#00d2ff]/20 border-[#00d2ff]/30 text-[#00d2ff]"
                            : "bg-white/5 border-white/5 text-[#888c94] hover:bg-white/10"
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setStatusFilter("verified")}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${statusFilter === "verified"
                            ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                            : "bg-white/5 border-white/5 text-[#888c94] hover:bg-white/10"
                            }`}
                    >
                        Verified
                    </button>
                    <button
                        onClick={() => setStatusFilter("pending")}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${statusFilter === "pending"
                            ? "bg-orange-500/20 border-orange-500/30 text-orange-400"
                            : "bg-white/5 border-white/5 text-[#888c94] hover:bg-white/10"
                            }`}
                    >
                        Pending
                    </button>
                </div>
            </div>

            <div className="bg-[#1a1b21]/80 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#0b0c10]/50 text-white border-b border-white/10">
                                <th className="px-6 py-4 font-semibold text-sm whitespace-nowrap">
                                    <button onClick={() => toggleSort("firstName")} className="flex items-center gap-2 hover:text-[#00d2ff] transition-colors group">
                                        First Name
                                        <i className={`ph ph-caret-${sortField === "firstName" ? (sortOrder === "asc" ? "up" : "down") : "up-down"} ${sortField === "firstName" ? "text-[#00d2ff]" : "text-[#888c94] opacity-40 group-hover:opacity-100"}`}></i>
                                    </button>
                                </th>
                                <th className="px-6 py-4 font-semibold text-sm whitespace-nowrap">
                                    <button onClick={() => toggleSort("lastName")} className="flex items-center gap-2 hover:text-[#00d2ff] transition-colors group">
                                        Last Name
                                        <i className={`ph ph-caret-${sortField === "lastName" ? (sortOrder === "asc" ? "up" : "down") : "up-down"} ${sortField === "lastName" ? "text-[#00d2ff]" : "text-[#888c94] opacity-40 group-hover:opacity-100"}`}></i>
                                    </button>
                                </th>
                                <th className="px-6 py-4 font-semibold text-sm whitespace-nowrap">
                                    <button onClick={() => toggleSort("email")} className="flex items-center gap-2 hover:text-[#00d2ff] transition-colors group">
                                        Email
                                        <i className={`ph ph-caret-${sortField === "email" ? (sortOrder === "asc" ? "up" : "down") : "up-down"} ${sortField === "email" ? "text-[#00d2ff]" : "text-[#888c94] opacity-40 group-hover:opacity-100"}`}></i>
                                    </button>
                                </th>
                                <th className="px-6 py-4 font-semibold text-sm whitespace-nowrap">Role</th>
                                <th className="px-6 py-4 font-semibold text-sm whitespace-nowrap">Status</th>
                                <th className="px-6 py-4 font-semibold text-sm whitespace-nowrap">
                                    <button onClick={() => toggleSort("cocktails")} className="flex items-center gap-2 hover:text-[#00d2ff] transition-colors group mx-auto">
                                        Cocktails
                                        <i className={`ph ph-caret-${sortField === "cocktails" ? (sortOrder === "asc" ? "up" : "down") : "up-down"} ${sortField === "cocktails" ? "text-[#00d2ff]" : "text-[#888c94] opacity-40 group-hover:opacity-100"}`}></i>
                                    </button>
                                </th>
                                <th className="px-6 py-4 font-semibold text-sm whitespace-nowrap">
                                    <button onClick={() => toggleSort("favorites")} className="flex items-center gap-2 hover:text-[#00d2ff] transition-colors group mx-auto">
                                        Favorites
                                        <i className={`ph ph-caret-${sortField === "favorites" ? (sortOrder === "asc" ? "up" : "down") : "up-down"} ${sortField === "favorites" ? "text-[#00d2ff]" : "text-[#888c94] opacity-40 group-hover:opacity-100"}`}></i>
                                    </button>
                                </th>
                                <th className="px-6 py-4 font-semibold text-sm text-right whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-[#888c94]">
                                        {searchQuery || statusFilter !== "all" ? "No matching users found." : "No users registered yet."}
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => {
                                    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'User';
                                    const userRole = user.role || "USER"

                                    return (
                                        <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 text-white font-medium">
                                                {user.firstName || "-"}
                                            </td>
                                            <td className="px-6 py-4 text-white font-medium">
                                                {user.lastName || "-"}
                                            </td>
                                            <td className="px-6 py-4 text-[#888c94] text-sm">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                {isSuperAdmin ? (
                                                    <select
                                                        value={userRole}
                                                        disabled={isUpdating === user.id}
                                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                        className="bg-[#0b0c10]/50 border border-white/10 rounded px-2 py-1 text-[10px] uppercase font-bold text-white focus:ring-1 focus:ring-[#00d2ff] outline-none transition-all disabled:opacity-50"
                                                    >
                                                        {roles.map(r => (
                                                            <option key={r} value={r} className="bg-[#1a1b21]">{r}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <span className={`inline-flex items-center gap-1 ${userRole === "SUPER_ADMIN" ? "text-[#00d2ff]" : userRole === "ADMIN" ? "text-purple-400" : "text-[#888c94]"} font-black px-2 py-0.5 rounded text-[9px] uppercase tracking-widest bg-white/5 border border-white/5`}>
                                                        {userRole === "SUPER_ADMIN" && <i className="ph ph-crown"></i>}
                                                        {userRole}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.emailVerified ? (
                                                    <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wide border border-emerald-500/20">
                                                        <i className="ph ph-check-circle"></i>
                                                        Verified
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-400 font-bold px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wide border border-orange-500/20">
                                                        <i className="ph ph-clock"></i>
                                                        Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center gap-1.5 bg-[#00d2ff]/10 text-[#00d2ff] font-bold px-3 py-1 rounded-lg text-sm">
                                                    <i className="ph-fill ph-martini"></i>
                                                    {user._count.cocktails}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center gap-1.5 bg-pink-500/10 text-pink-500 font-bold px-3 py-1 rounded-lg text-sm">
                                                    <i className="ph-fill ph-heart"></i>
                                                    {user._count.favorites}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); confirmDelete(user.id, fullName) }}
                                                    disabled={isDeleting === user.id}
                                                    className="p-2 text-[#888c94] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all disabled:opacity-50"
                                                    title="Delete User"
                                                >
                                                    {isDeleting === user.id ? (
                                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    ) : (
                                                        <i className="ph ph-trash text-xl"></i>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
