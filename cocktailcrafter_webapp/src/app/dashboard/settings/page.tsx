"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
    const { data: session } = useSession()
    const [isDeleting, setIsDeleting] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const router = useRouter()

    const handleDeleteAccount = async () => {
        setIsDeleting(true)
        try {
            const res = await fetch("/api/user/delete", { method: "DELETE" })
            if (res.ok) {
                // Success, sign out and redirect to home
                signOut({ callbackUrl: "/" })
            } else {
                alert("Failed to delete account. Please try again.")
            }
        } catch (err) {
            console.error(err)
            alert("An error occurred.")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <header className="mb-10">
                <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Account Settings</h1>
                <p className="text-[#888c94]">Manage your personal account preferences and data.</p>
            </header>

            <div className="space-y-8">
                {/* Profile Overview */}
                <section className="bg-gradient-to-br from-[#1a1b21] to-[#121316] rounded-2xl p-8 border border-white/5 shadow-xl">
                    <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/5">
                        <div className="w-16 h-16 rounded-2xl bg-[#00d2ff]/10 text-[#00d2ff] flex items-center justify-center font-black text-2xl border border-[#00d2ff]/20">
                            {session?.user?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{session?.user?.name}</h2>
                            <p className="text-[#888c94] text-sm">{session?.user?.email}</p>
                            <span className="mt-2 inline-flex items-center gap-1.5 bg-[#00d2ff]/10 text-[#00d2ff] font-bold px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wide border border-[#00d2ff]/20">
                                {session?.user?.role === "SUPER_ADMIN" ? "Super Admin" : "Crafter Account"}
                            </span>
                        </div>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="bg-red-500/5 border border-red-500/10 rounded-2xl p-8 shadow-xl">
                    <div className="flex items-center gap-3 mb-4">
                        <i className="ph ph-warning-circle text-red-500 text-2xl"></i>
                        <h2 className="text-lg font-bold text-red-400">Danger Zone</h2>
                    </div>
                    <p className="text-[#888c94] text-sm mb-6 max-w-xl">
                        Once you delete your account, there is no going back. All your created cocktails,
                        favorites, and personal data will be permanently removed from our servers.
                    </p>

                    {!showConfirm ? (
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                        >
                            <i className="ph ph-trash"></i>
                            Delete My Account
                        </button>
                    ) : (
                        <div className="bg-[#0b0c10]/40 border border-red-500/20 rounded-xl p-6">
                            <p className="text-white font-bold mb-4">Are you absolutely sure?</p>
                            <div className="flex flex-wrap gap-4">
                                <button
                                    disabled={isDeleting}
                                    onClick={handleDeleteAccount}
                                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)] disabled:opacity-50"
                                >
                                    {isDeleting ? "Deleting..." : "Yes, Delete Everything"}
                                </button>
                                <button
                                    disabled={isDeleting}
                                    onClick={() => setShowConfirm(false)}
                                    className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all border border-white/10"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}
