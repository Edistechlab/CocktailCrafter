"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"

function VerifyEmailContent() {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    const [status, setStatus] = useState<"loading" | "success" | "error">(token ? "loading" : "error")
    const [message, setMessage] = useState(token ? "Verifying your email..." : "Missing verification token.")
    const router = useRouter()

    useEffect(() => {
        if (!token) {
            return
        }

        const verifyToken = async () => {
            try {
                const res = await fetch("/api/verify-email", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token })
                })

                const data = await res.json()

                if (res.ok) {
                    setStatus("success")
                    setMessage("Your email has been successfully verified!")
                    // Redirect to login with verified flag after 3 seconds
                    setTimeout(() => router.push(`/login?verified=true`), 3000)
                } else {
                    setStatus("error")
                    setMessage(data.message || "Verification failed. The link might be expired.")
                }
            } catch (err) {
                setStatus("error")
                setMessage("An unexpected error occurred.")
            }
        }

        verifyToken()
    }, [token, router])

    return (
        <div className="min-h-screen bg-[#0b0c10] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background Glows */}
            <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-[#00d2ff] opacity-10 blur-3xl rounded-full"></div>
            <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-[#0b0c10] opacity-30 blur-3xl rounded-full"></div>

            {/* Glass Container */}
            <div className="relative z-10 w-full max-w-md bg-[#1a1b21]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl text-center">
                <div className="mb-8">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 shadow-inner border shadow-[0_0_20px_rgba(0,210,255,0.1)] ${status === "loading" ? "bg-white/5 border-white/10 animate-pulse" :
                        status === "success" ? "bg-emerald-500/10 border-emerald-500/20" :
                            "bg-red-500/10 border-red-500/20"
                        }`}>
                        {status === "loading" && (
                            <svg className="animate-spin h-8 w-8 text-[#00d2ff]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {status === "success" && (
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        )}
                        {status === "error" && (
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        )}
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-white mb-4">
                        {status === "loading" ? "Verifying..." :
                            status === "success" ? "Verification Successful!" :
                                "Verification Failed"}
                    </h1>

                    <p className={`text-lg ${status === "success" ? "text-emerald-400" :
                        status === "error" ? "text-red-400" :
                            "text-[#888c94]"
                        }`}>
                        {message}
                    </p>
                </div>

                {status !== "loading" && (
                    <div className="pt-6 border-t border-white/5">
                        <Link
                            href={status === "success" ? "/login?verified=true" : "/login"}
                            className="inline-block w-full bg-[#00d2ff] hover:bg-[#00b8e6] text-[#0b0c10] font-bold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(0,210,255,0.3)]"
                        >
                            {status === "success" ? "Sign In Now" : "Go to Sign In"}
                        </Link>
                    </div>
                )}

                {status === "success" && (
                    <p className="mt-6 text-xs text-[#5c606a] animate-pulse">
                        Redirecting to Sign In in 3 seconds...
                    </p>
                )}
            </div>
        </div>
    )
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0b0c10] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00d2ff]"></div>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    )
}
