"use client"

import Link from "next/link"

export default function CampaignPage() {
    return (
        <div className="campaign-wrapper bg-[#0b0c10] text-[#ffffff] min-h-screen overflow-x-hidden font-outfit">
            <style jsx>{`
                .campaign-wrapper {
                    --bg-base: #0b0c10;
                    --bg-surface: #1a1b21;
                    --accent-cyan: #00d2ff;
                    --accent-cyan-glow: rgba(0, 210, 255, 0.5);
                    --text-main: #ffffff;
                    --text-muted: #888c94;
                    --text-sub: #5c606a;
                    --glass-border: rgba(255, 255, 255, 0.1);
                    --glass-bg: rgba(255, 255, 255, 0.03);
                    --nav-height: 80px;
                }

                .badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(0, 210, 255, 0.1);
                    color: var(--accent-cyan);
                    padding: 6px 16px;
                    border-radius: 20px;
                    font-size: 13px;
                    font-weight: 600;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    border: 1px solid rgba(0, 210, 255, 0.2);
                    margin-bottom: 24px;
                }

                .hero {
                    min-height: 100vh;
                    padding: 60px 5%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 60px;
                    position: relative;
                }

                .hero::before {
                    content: '';
                    position: absolute;
                    top: 20%;
                    left: -10%;
                    width: 50vw;
                    height: 50vw;
                    background: radial-gradient(circle, rgba(0, 210, 255, 0.08) 0%, transparent 70%);
                    z-index: -1;
                    pointer-events: none;
                }

                .hero-content {
                    flex: 1;
                    max-width: 600px;
                    z-index: 10;
                    text-align: left;
                }

                .hero-title {
                    font-size: 52px;
                    font-weight: 700;
                    line-height: 1.1;
                    margin-bottom: 24px;
                    background: linear-gradient(to right, #ffffff, #a0a5b1);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .hero-subtitle {
                    font-size: 20px;
                    color: var(--text-muted);
                    margin-bottom: 40px;
                    max-width: 500px;
                }

                .buy-btn-large {
                    display: inline-flex;
                    align-items: center;
                    gap: 12px;
                    background: rgba(0, 210, 255, 0.1);
                    color: var(--accent-cyan);
                    padding: 18px 40px;
                    border-radius: 20px;
                    font-size: 18px;
                    font-weight: 700;
                    border: 1px solid rgba(0, 210, 255, 0.4);
                    cursor: pointer;
                    box-shadow: 0 0 20px rgba(0, 210, 255, 0.1);
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .buy-btn-large:hover {
                    transform: translateY(-2px);
                    background: rgba(0, 210, 255, 0.2);
                    box-shadow: 0 0 30px rgba(0, 210, 255, 0.2);
                }

                .price-tag {
                    display: flex;
                    flex-direction: column;
                    text-align: left;
                    margin-left: 20px;
                }

                .price-amount {
                    font-size: 28px;
                    font-weight: 700;
                    color: var(--text-main);
                    line-height: 1;
                }

                .price-sub {
                    font-size: 13px;
                    color: var(--text-sub);
                }

                .machine-wrapper {
                    width: 100%;
                    max-width: 500px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                }

                .features {
                    padding: 100px 5%;
                    background: linear-gradient(to bottom, var(--bg-base) 0%, var(--bg-surface) 100%);
                }

                .section-header {
                    text-align: center;
                    margin-bottom: 80px;
                }

                .section-title {
                    font-size: 42px;
                    font-weight: 600;
                    margin-bottom: 15px;
                }

                .feature-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 40px;
                }

                .feature-card {
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 24px;
                    padding: 40px;
                    transition: transform 0.3s ease, background 0.3s ease;
                }

                .feature-card:hover {
                    transform: translateY(-10px);
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(255, 255, 255, 0.15);
                }

                .feature-icon {
                    width: 60px;
                    height: 60px;
                    background: rgba(0, 210, 255, 0.1);
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 32px;
                    color: var(--accent-cyan);
                    margin-bottom: 24px;
                    border: 1px solid rgba(0, 210, 255, 0.2);
                }

                .preorder {
                    padding: 120px 5%;
                    text-align: center;
                    position: relative;
                }

                .stripe-container {
                    max-width: 500px;
                    margin: 40px auto 0;
                    background: var(--bg-surface);
                    border: 1px solid var(--glass-border);
                    border-radius: 24px;
                    padding: 40px;
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
                }

                .stripe-btn {
                    width: 100%;
                    background: rgba(99, 91, 255, 0.1);
                    color: #7b74ff;
                    border: 1px solid rgba(99, 91, 255, 0.4);
                    padding: 16px;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-decoration: none;
                    display: inline-block;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .stripe-btn:hover {
                    background: rgba(99, 91, 255, 0.2);
                    box-shadow: 0 0 20px rgba(99, 91, 255, 0.2);
                }

                @keyframes wave-flow {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }

                .animate-wave-flow {
                    animation: wave-flow 25s linear infinite;
                }

                .animate-wave-flow-slow {
                    animation: wave-flow 45s linear infinite reverse;
                }

                @media (max-width: 900px) {
                    .hero {
                        flex-direction: column;
                        text-align: center;
                        padding-top: 100px;
                    }
                    .hero-content {
                        text-align: center;
                        align-items: center;
                    }
                    .hero-title {
                        font-size: 42px;
                    }
                    .price-tag {
                        margin-left: 0;
                        margin-top: 15px;
                    }
                }
            `}</style>

            {/* Navigation (Transparent/Simplified as per request "without menu") */}
            <nav className="fixed top-0 left-0 w-full h-[80px] bg-transparent z-[1000] flex items-center justify-between px-[5%]">
                <Link href="/" className="flex items-center gap-2.5 text-2xl font-bold hover:opacity-80 transition-opacity">
                    <i className="ph-fill ph-martini text-[#00d2ff] text-[28px] drop-shadow-[0_0_10px_rgba(0,210,255,0.5)]"></i>
                    CocktailCrafter
                </Link>
                <div className="flex gap-4">
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero overflow-hidden isolate">

                <div className="hero-content">
                    <div className="badge">
                        <i className="ph-bold ph-star text-[14px]"></i> Only 50 Spots Available!
                    </div>
                    <h1 className="hero-title">The Ultimate CocktailCrafter.</h1>
                    <p className="hero-subtitle">
                        The first 3D-printed bar tool made for dreamers, creators, and cocktail lovers. Turn your home bar into
                        a playground of flavors.
                        <br /><br />
                        <strong>Get 50 € Off By Reserving As Early Bird.</strong><br />
                        Reserve your VIP spot for a 1 € deposit to lock in an exclusive 20% VIP discount on top of the early
                        bird price, plus an extra VIP gift. Pay a total of just 199 € (+ shipping).
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-5">
                        <a href="#preorder" className="buy-btn-large">
                            <i className="ph-bold ph-ticket text-[24px]"></i>
                            Get Early Access
                        </a>
                        <div className="price-tag">
                            <span className="price-amount text-[28px]">€ 1.00</span>
                            <span className="price-sub text-[13px] text-[#5c606a]">VIP Deposit</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex justify-center items-center relative">
                    {/* Background Waves - restricted to machine side */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[600px] -z-10 pointer-events-none overflow-hidden select-none">
                        {/* Gradient Fade Overlay on the left */}
                        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#0b0c10] via-[#0b0c10]/80 to-transparent z-10"></div>

                        <div className="absolute inset-0 flex items-center justify-center opacity-60">
                            {/* Layer 1: Cyan Waves (Multiple) */}
                            <svg className="absolute w-[200%] h-full transform-gpu animate-wave-flow opacity-70" viewBox="0 0 2000 400" preserveAspectRatio="none">
                                <path d="M0,200 C200,100 300,300 500,200 C700,100 800,300 1000,200 C1200,100 1300,300 1500,200 C1700,100 1800,300 2000,200" fill="none" stroke="url(#cmp_grad1)" strokeWidth="3" />
                                <defs>
                                    <linearGradient id="cmp_grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#00d2ff" stopOpacity="0" />
                                        <stop offset="25%" stopColor="#00d2ff" stopOpacity="0.4" />
                                        <stop offset="50%" stopColor="#00d2ff" stopOpacity="0.8" />
                                        <stop offset="75%" stopColor="#00d2ff" stopOpacity="0.4" />
                                        <stop offset="100%" stopColor="#00d2ff" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <svg className="absolute w-[200%] h-full transform-gpu animate-wave-flow opacity-40 [animation-delay:-10s] [animation-duration:20s]" viewBox="0 0 2000 400" preserveAspectRatio="none">
                                <path d="M0,210 C200,110 300,310 500,210 C700,110 800,310 1000,210 C1200,110 1300,310 1500,210 C1700,110 1800,310 2000,210" fill="none" stroke="url(#cmp_grad1)" strokeWidth="1.5" />
                            </svg>
                            <svg className="absolute w-[200%] h-full transform-gpu animate-wave-flow opacity-20 [animation-delay:-15s] [animation-duration:35s]" viewBox="0 0 2000 400" preserveAspectRatio="none">
                                <path d="M0,195 C200,95 300,295 500,195 C700,95 800,295 1000,195 C1200,95 1300,295 1500,195 C1700,95 1800,295 2000,195" fill="none" stroke="url(#cmp_grad1)" strokeWidth="0.8" />
                            </svg>

                            {/* Layer 2: Deep Blue Waves (Multiple) */}
                            <svg className="absolute w-[200%] h-full transform-gpu animate-wave-flow-slow opacity-50" viewBox="0 0 2000 400" preserveAspectRatio="none">
                                <path d="M0,215 C200,115 300,315 500,215 C700,115 800,315 1000,215 C1200,115 1300,315 1500,215 C1700,115 1800,315 2000,215" fill="none" stroke="url(#cmp_grad2)" strokeWidth="2" />
                                <defs>
                                    <linearGradient id="cmp_grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#3a7bd5" stopOpacity="0" />
                                        <stop offset="25%" stopColor="#3a7bd5" stopOpacity="0.3" />
                                        <stop offset="50%" stopColor="#3a7bd5" stopOpacity="0.6" />
                                        <stop offset="75%" stopColor="#3a7bd5" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#3a7bd5" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <svg className="absolute w-[200%] h-full transform-gpu animate-wave-flow-slow opacity-25 [animation-delay:-5s] [animation-duration:40s]" viewBox="0 0 2000 400" preserveAspectRatio="none">
                                <path d="M0,225 C200,125 300,325 500,225 C700,125 800,325 1000,225 C1200,125 1300,325 1500,225 C1700,125 1800,325 2000,225" fill="none" stroke="url(#cmp_grad2)" strokeWidth="1.2" />
                            </svg>

                            {/* Layer 3: Accent White Highlights */}
                            <svg className="absolute w-[200%] h-full transform-gpu animate-wave-flow opacity-20 [animation-duration:55s] [animation-delay:-8s]" viewBox="0 0 2000 400" preserveAspectRatio="none">
                                <path d="M0,190 C200,90 300,290 500,190 C700,90 800,290 1000,190 C1200,90 1300,290 1500,190 C1700,90 1800,290 2000,190" fill="none" stroke="white" strokeWidth="0.5" />
                            </svg>
                            <svg className="absolute w-[200%] h-full transform-gpu animate-wave-flow opacity-15 [animation-duration:30s] [animation-delay:-20s]" viewBox="0 0 2000 400" preserveAspectRatio="none">
                                <path d="M0,185 C200,85 300,285 500,185 C700,85 800,285 1000,185 C1200,85 1300,285 1500,185 C1700,85 1800,285 2000,185" fill="none" stroke="white" strokeWidth="0.3" />
                            </svg>
                        </div>
                    </div>

                    <div className="machine-wrapper">
                        <img
                            src="/images/CocktaiCrafter_Render_front.webp"
                            alt="CocktailCrafter High Res Render"
                            className="w-full max-w-[500px] h-auto block drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features" id="features">
                <div className="section-header">
                    <h2 className="section-title">Shape the CocktailCrafter</h2>
                    <p className="section-subtitle max-w-[600px] mx-auto text-[#888c94] text-[18px]">
                        Customize, mix, and impress. Whether you’re inventing bold new recipes or
                        perfecting your favorites, CocktailCrafter makes every moment behind the bar fun, creative, and
                        unforgettable.
                    </p>
                </div>

                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <i className="ph-light ph-martini"></i>
                        </div>
                        <h3 className="text-[22px] font-semibold mb-3">200+ Cocktails</h3>
                        <p className="text-[#888c94] text-[15px]">Enjoy over 200 meticulously crafted cocktail recipes right out of the box. Your
                            home bar will never be the same.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <i className="ph-light ph-globe"></i>
                        </div>
                        <h3 className="text-[22px] font-semibold mb-3">Ship Worldwide</h3>
                        <p className="text-[#888c94] text-[15px]">No matter where you are in the world, the CocktailCrafter comes to you. Shipping
                            begins Summer 2026.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <i className="ph-light ph-printer"></i>
                        </div>
                        <h3 className="text-[22px] font-semibold mb-3">3D Print & DIY</h3>
                        <p className="text-[#888c94] text-[15px]">Print your own CocktailCrafter and use the official electronics kit for the
                            assembly.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <i className="ph-light ph-star"></i>
                        </div>
                        <h3 className="text-[22px] font-semibold mb-3">VIP Exclusive</h3>
                        <p className="text-[#888c94] text-[15px]">Lock in your €50 Early Bird discount plus an extra 20% off by reserving today.
                            Secure your 199 € total price.</p>
                    </div>
                </div>
            </section>

            {/* Email Signup Section (Keeping it simple as in original) */}
            <section className="py-[100px] px-5 text-center bg-[#1a1b21] border-y border-white/10">
                <div className="max-w-[800px] mx-auto">
                    <h2 className="text-[32px] md:text-[42px] font-bold mb-5 tracking-tight uppercase">GET IN EARLY AND SHAPE THE COCKTAILCRAFTER!</h2>
                    <p className="text-[#888c94] text-[18px] mb-8 leading-relaxed">
                        SIGN UP NOW TO SECURE YOUR DISCOUNT AND GET AN EMAIL WHEN THE CAMPAIGN LAUNCHES—ONLY 50 SPOTS
                        AVAILABLE!<br />
                        <strong className="text-[#00d2ff] block mt-2 font-bold text-[20px]">Get 50 € Off By Reserving As Early Bird.</strong>
                    </p>
                    <form action="https://formsubmit.co/info@cocktailcrafter.ch" method="POST" className="flex flex-col gap-4 max-w-[500px] mx-auto">
                        <input type="email" name="email" placeholder="Enter your best email address" required
                            className="w-full px-6 py-4 rounded-xl border border-white/10 bg-black/40 text-white text-center focus:outline-none focus:border-[#00d2ff] transition-all" />
                        <button type="submit" className="w-full bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/40 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-[#00d2ff]/20 transition-all shadow-[0_0_20px_rgba(0,210,255,0.1)]">
                            Sign Up to the VIP List
                        </button>
                    </form>
                </div>
            </section>

            {/* Pre-order Section */}
            <section className="preorder" id="preorder">
                <div className="section-header">
                    <h2 className="section-title">Reserve Your VIP Spot</h2>
                    <p className="text-[#888c94] text-[18px]">Place a 1 € deposit today and get Early Access on Kickstarter. (Only 50 Spots Available!)</p>
                </div>

                <div className="stripe-container">
                    <div className="mb-8">
                        <h3 className="text-[24px] font-semibold mb-2">Secure Checkout</h3>
                        <div className="flex items-center justify-center gap-2 text-[12px] text-[#888c94]">
                            <i className="ph-fill ph-lock-key text-[#635bff]"></i> Powered by Stripe
                        </div>
                    </div>

                    <a href="https://buy.stripe.com/9B6bJ30Hn2mi07G9UkaEE00" target="_blank" className="stripe-btn">
                        Pay € 1.00 directly via Stripe
                    </a>

                    <div className="mt-6 text-[13px] text-[#888c94]">
                        Clicking the button will safely redirect you to our secure Stripe Checkout page to place your €1.00
                        deposit.
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[#888c94] text-[14px]">
                <div className="flex items-center gap-2.5 text-lg font-bold text-white">
                    <i className="ph-fill ph-martini text-[#00d2ff] text-xl drop-shadow-[0_0_10px_rgba(0,210,255,0.5)]"></i>
                    CocktailCrafter
                </div>
                <div>
                    &copy; 2026 Edi's Techlab & CADEMON.
                </div>
                <div className="flex gap-6">
                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    <Link href="/imprint" className="hover:text-white transition-colors">Imprint</Link>
                </div>
            </footer>
        </div>
    )
}
