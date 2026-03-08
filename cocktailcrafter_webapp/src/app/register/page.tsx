"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.message || "Something went wrong")
            } else {
                router.push("/login?registered=true")
            }
        } catch (err) {
            setError("An unexpected error occurred.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0b0c10] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">

            {/* Background Glows */}
            <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-[#00d2ff] opacity-10 blur-3xl rounded-full"></div>
            <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-[#0b0c10] opacity-30 blur-3xl rounded-full"></div>

            {/* Glass Container */}
            <div className="relative z-10 w-full max-w-md bg-[#1a1b21]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0b0c10] border border-white/5 rounded-2xl mb-4 shadow-inner">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00d2ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <line x1="19" y1="8" x2="19" y2="14" />
                            <line x1="22" y1="11" x2="16" y2="11" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Create Account</h1>
                    <p className="text-[#888c94] text-sm">Join the CocktailCrafter community</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm text-center mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[#888c94] mb-1.5" htmlFor="firstName">
                                First Name
                            </label>
                            <input
                                id="firstName"
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                className="w-full bg-[#0b0c10]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#00d2ff]/50 focus:border-transparent transition-all"
                                placeholder="Max"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#888c94] mb-1.5" htmlFor="lastName">
                                Last Name
                            </label>
                            <input
                                id="lastName"
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                className="w-full bg-[#0b0c10]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#00d2ff]/50 focus:border-transparent transition-all"
                                placeholder="Smith"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#888c94] mb-1.5" htmlFor="email">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-[#0b0c10]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#00d2ff]/50 focus:border-transparent transition-all"
                            placeholder="max@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#888c94] mb-1.5" htmlFor="password">
                            Choose Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-[#0b0c10]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#00d2ff]/50 focus:border-transparent transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-3 mt-2">
                        <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-1">Beta / Test Mode</p>
                        <p className="text-orange-300/70 text-xs">This app is currently in test mode. No guarantee is made regarding data availability or security. Data may be lost at any time.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#00d2ff] hover:bg-[#00b8e6] text-[#0b0c10] font-bold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(0,210,255,0.3)] hover:shadow-[0_0_30px_rgba(0,210,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-white/5 text-center">
                    <p className="text-[#888c94] text-sm mb-4">Already have an account?</p>
                    <Link
                        href="/login"
                        className="inline-block w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 px-4 rounded-xl border border-white/5 transition-all"
                    >
                        Sign In
                    </Link>
                </div>

            </div>
        </div>
    )
}
