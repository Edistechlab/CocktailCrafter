"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"

function ResetPasswordContent() {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    const router = useRouter()

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!token) {
            setError("Missing reset token.")
        }
    }, [token])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            return setError("Passwords do not match")
        }
        if (password.length < 8) {
            return setError("Password must be at least 8 characters long")
        }

        setLoading(true)
        setError("")
        setMessage("")

        try {
            const res = await fetch("/api/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password })
            })

            const data = await res.json()

            if (res.ok) {
                setMessage(data.message)
                setTimeout(() => router.push("/login?reset=true"), 2000)
            } else {
                setError(data.message || "An error occurred.")
            }
        } catch (err) {
            setError("Something went wrong.")
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
                            <path d="M12 11V6a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v5" />
                            <path d="M4 11h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Set New Password</h1>
                    <p className="text-[#888c94] text-sm">Please choose a secure new password for your account.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm mb-6">
                        {error}
                    </div>
                )}

                {message ? (
                    <div className="text-center">
                        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm mb-8">
                            {message}
                        </div>
                        <p className="text-xs text-[#5c606a] animate-pulse mb-8">Redirecting to login...</p>
                        <Link
                            href="/login"
                            className="inline-block w-full bg-[#00d2ff] hover:bg-[#00b8e6] text-[#0b0c10] font-bold py-3.5 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(0,210,255,0.3)]"
                        >
                            Back to Sign In
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-[#888c94] mb-2" htmlFor="password">
                                New Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                                className="w-full bg-[#0b0c10]/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#00d2ff]/50 focus:border-transparent transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#888c94] mb-2" htmlFor="confirmPassword">
                                Confirm New Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full bg-[#0b0c10]/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#00d2ff]/50 focus:border-transparent transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !token}
                            className="w-full bg-[#00d2ff] hover:bg-[#00b8e6] text-[#0b0c10] font-bold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(0,210,255,0.3)] hover:shadow-[0_0_30px_rgba(0,210,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0b0c10] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00d2ff]"></div>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    )
}
