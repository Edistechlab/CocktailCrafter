"use client"

import React from 'react'

export const CocktailMachineSVG = () => {
    return (
        <svg
            viewBox="0 0 600 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto drop-shadow-[0_40px_80px_rgba(0,0,0,0.5)]"
            style={{ perspective: '1000px' }}
        >
            <defs>
                <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#f0f2f5" />
                </linearGradient>
                <linearGradient id="nicheShadow" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#e2e8f0" />
                    <stop offset="20%" stopColor="#f8fafc" />
                    <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
                <linearGradient id="bottleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1a4d5c" stopOpacity="1" />
                    <stop offset="100%" stopColor="#0a2a33" stopOpacity="0.8" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Side Panel (Bottle side) */}
            <path
                d="M150 120 L180 100 L180 480 L150 500 Z"
                fill="#e2e8f0"
            />

            {/* Bottles inside side panel */}
            <g transform="translate(155, 140)">
                {[0, 1, 2, 3, 4].map((i) => (
                    <rect
                        key={i}
                        x={0}
                        y={i * 60}
                        width="15"
                        height="45"
                        rx="4"
                        fill="url(#bottleGradient)"
                        opacity={0.8 - i * 0.1}
                    />
                ))}
            </g>

            {/* Main Body Chassis */}
            <path
                d="M180 100 C180 80 200 70 230 70 H480 C510 70 530 90 530 120 V460 C530 490 510 510 480 510 H230 C200 510 180 490 180 460 V100Z"
                fill="url(#bodyGradient)"
                stroke="#ffffff"
                strokeWidth="1"
            />

            {/* Top Handle/Feature */}
            <path
                d="M300 70 C300 50 410 50 410 70"
                stroke="#ffffff"
                strokeWidth="20"
                strokeLinecap="round"
            />

            {/* Central Niche Cutout */}
            <path
                d="M260 220 C260 190 280 170 310 170 H400 C430 170 450 190 450 220 V480 H260 V220Z"
                fill="url(#nicheShadow)"
            />

            {/* Inner Back of Niche */}
            <path
                d="M280 230 C280 210 290 200 310 200 H400 C420 200 430 210 430 230 V480 H280 V230Z"
                fill="#f1f5f9"
                opacity="0.5"
            />

            {/* Dispensing Nozzle */}
            <rect x="345" y="170" width="20" height="25" rx="4" fill="#ffffff" />
            <circle cx="355" cy="195" r="3" fill="#cbd5e1" />

            {/* Display Screen */}
            <rect x="380" y="110" width="60" height="45" rx="4" fill="#1a1b21" />
            <rect x="385" y="115" width="50" height="35" rx="2" fill="#00d2ff" opacity="0.1" />
            {/* Small Glowing Dot for 'Active' */}
            <circle cx="390" cy="122" r="2" fill="#00d2ff" filter="url(#glow)" />

            {/* Control Knob */}
            <circle cx="485" cy="132" r="12" fill="#111111" />
            <circle cx="485" cy="132" r="8" fill="#1e1b1b" />
            <path d="M485 124 L485 132" stroke="#ffffff" strokeWidth="1" />

            {/* Drip Tray */}
            <path
                d="M240 480 H470 C485 480 495 490 495 505 C495 525 470 540 355 540 C240 540 215 525 215 505 C215 490 225 480 240 480Z"
                fill="#111111"
            />
            {/* Grill Lines on Drip Tray */}
            <g stroke="#333333" strokeWidth="1">
                {[490, 495, 500, 505, 510, 515, 520, 525, 530].map((y, idx) => (
                    <line key={idx} x1={260 + idx * 2} y1={y} x2={450 - idx * 2} y2={y} />
                ))}
            </g>

            {/* Front Light/Logo Accent */}
            <path d="M180 250 L180 350" stroke="#00d2ff" strokeWidth="2" opacity="0.3" filter="url(#glow)" />

        </svg>
    )
}
