"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

import { Suspense } from "react"

function LoginForm() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await signIn("credentials", {
                username,
                password,
                redirect: false
            })

            if (res?.error) {
                if (res.error === "CredentialsSignin") {
                    setError("Invalid email or password.")
                } else {
                    setError("Please verify your email address before signing in.")
                }
            } else {
                router.push("/dashboard")
                router.refresh()
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
                        {/* Simple Glass Icon SVG */}
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00d2ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8 22h8" />
                            <path d="M12 11v11" />
                            <path d="m19 3-7 8-7-8Z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome back</h1>
                    <p className="text-[#888c94] text-sm">Sign in to your CocktailCrafter Portal</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm text-center mb-6">
                        {error}
                    </div>
                )}

                {searchParams.get("registered") && (
                    <div className="bg-[#00d2ff]/10 border border-[#00d2ff]/20 text-[#00d2ff] p-4 rounded-xl text-sm mb-6 flex items-start gap-4">
                        <div className="w-8 h-8 rounded-lg bg-[#00d2ff]/10 flex items-center justify-center shrink-0">
                            <i className="ph ph-envelope text-lg"></i>
                        </div>
                        <div>
                            <p className="font-bold">Check your Inbox!</p>
                            <p className="opacity-70 text-xs mt-0.5">We've sent you a verification link. Please confirm your email to sign in.</p>
                        </div>
                    </div>
                )}

                {searchParams.get("verified") && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm mb-6 flex items-start gap-4">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                            <i className="ph ph-check-circle text-lg"></i>
                        </div>
                        <div>
                            <p className="font-bold">Email Verified!</p>
                            <p className="opacity-70 text-xs mt-0.5">Your account is now active. You can sign in below.</p>
                        </div>
                    </div>
                )}

                {searchParams.get("reset") && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm mb-6 flex items-start gap-4">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                            <i className="ph ph-key text-lg"></i>
                        </div>
                        <div>
                            <p className="font-bold">Password Reset!</p>
                            <p className="opacity-70 text-xs mt-0.5">Your password has been updated. You can now sign in.</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-[#888c94] mb-1.5" htmlFor="username">
                            Email or Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoComplete="username"
                            className="w-full bg-[#0b0c10]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#00d2ff]/50 focus:border-transparent transition-all"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-sm font-medium text-[#888c94]" htmlFor="password">
                                Password
                            </label>
                            <Link href="/forgot-password" className="text-[11px] text-[#00d2ff]/60 hover:text-[#00d2ff] transition-colors">
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            className="w-full bg-[#0b0c10]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#00d2ff]/50 focus:border-transparent transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#00d2ff] hover:bg-[#00b8e6] text-[#0b0c10] font-bold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(0,210,255,0.3)] hover:shadow-[0_0_30px_rgba(0,210,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-white/5 text-center">
                    <p className="text-[#888c94] text-sm mb-4">Don't have an account yet?</p>
                    <Link
                        href="/register"
                        className="inline-block w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 px-4 rounded-xl border border-white/5 transition-all text-center"
                    >
                        Create Account
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0b0c10] flex items-center justify-center text-white">Loading...</div>}>
            <LoginForm />
        </Suspense>
    )
}
