import React from 'react'

export function IceIcon({ type, className = "w-6 h-6" }: { type: string, className?: string }) {
    const props = {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.5",
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
        className
    }

    const t = type.toLowerCase()

    // No Ice
    if (t.includes('no ice') || t.includes('neat') || t.includes('straight')) {
        return (
            <svg {...props}>
                <circle cx="12" cy="12" r="9" strokeOpacity="0.3" strokeDasharray="2 4" />
                <path d="M7 7l10 10" strokeOpacity="0.5" />
            </svg>
        )
    }

    // Sphere
    if (t.includes('sphere')) {
        return (
            <svg {...props}>
                <circle cx="12" cy="12" r="8" />
                <path d="M8 8c1.5-1.5 3.5-2 6-1" opacity="0.5" />
            </svg>
        )
    }

    // Crushed / Pebble
    if (t.includes('crushed') || t.includes('pebble')) {
        return (
            <svg {...props}>
                <path d="M8 8l2 3-3 2z" />
                <path d="M14 6l3 2-2 4-4-1z" />
                <path d="M8 17l4 2 2-3-4-2z" />
                <path d="M16 16l3-1-1-4-2 2z" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="9" cy="13" r="1" />
                <circle cx="15" cy="13" r="1" />
            </svg>
        )
    }

    // Collins Spear
    if (t.includes('spear') || t.includes('collins')) {
        return (
            <svg {...props}>
                <rect x="8" y="4" width="8" height="16" rx="1" />
                <path d="M10 6v12" opacity="0.3" />
                <path d="M14 6L10 18" opacity="0.2" />
            </svg>
        )
    }

    // Large Cube / King Cube / Clear Ice
    if (t.includes('large') || t.includes('king') || t.includes('clear')) {
        return (
            <svg {...props}>
                <rect x="6" y="6" width="12" height="12" rx="1" />
                <path d="M9 9h6v6H9z" opacity="0.3" />
                <path d="M6 6l3 3" opacity="0.3" />
            </svg>
        )
    }

    // Small Cube / Cracked Ice
    if (t.includes('small') || t.includes('cracked')) {
        return (
            <svg {...props}>
                <rect x="7" y="7" width="5" height="5" rx="0.5" />
                <rect x="13" y="10" width="4" height="4" rx="0.5" />
                <rect x="9" y="14" width="4" height="4" rx="0.5" />
                <path d="M10 10l-2 2" opacity="0.5" />
            </svg>
        )
    }

    // Default (Standard Cube)
    return (
        <svg {...props}>
            <rect x="8" y="8" width="8" height="8" rx="1" />
            <path d="M11 11h2v2h-2z" opacity="0.5" />
            <path d="M8 8l3 3" opacity="0.5" />
        </svg>
    )
}
