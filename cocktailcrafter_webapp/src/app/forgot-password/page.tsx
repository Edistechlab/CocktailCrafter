"use client"

import { useState } from "react"
import Link from "next/link"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setMessage("")

        try {
            const res = await fetch("/api/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            })

            const data = await res.json()

            if (res.ok) {
                setMessage(data.message)
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
                            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3m-3-3l-2.5-2.5" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Forgot Password?</h1>
                    <p className="text-[#888c94] text-sm text-balance">Enter your email and we'll send you a link to reset your password.</p>
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
                            <label className="block text-sm font-medium text-[#888c94] mb-2" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-[#0b0c10]/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#00d2ff]/50 focus:border-transparent transition-all"
                                placeholder="name@example.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#00d2ff] hover:bg-[#00b8e6] text-[#0b0c10] font-bold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(0,210,255,0.3)] hover:shadow-[0_0_30px_rgba(0,210,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>

                        <div className="text-center">
                            <Link href="/login" className="text-sm font-medium text-[#00d2ff] hover:text-[#00b8e6] transition-colors">
                                Back to Sign In
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
