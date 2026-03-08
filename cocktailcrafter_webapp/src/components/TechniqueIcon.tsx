import React from 'react'

export function TechniqueIcon({ type, className = "w-6 h-6" }: { type: string, className?: string }) {
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

    // Shake
    if (t.includes('shake')) {
        return (
            <svg {...props}>
                <path d="M12 3a9 9 0 0 1 9 9" />
                <path d="M3 12a9 9 0 0 1 9-9" />
                <path d="M12 21a9 9 0 0 1-9-9" />
                <path d="M21 12a9 9 0 0 1-9 9" />
                <path d="M8 8l8 8" />
                <path d="M16 8l-8 8" />
            </svg>
        )
    }

    // Stir
    if (t.includes('stir')) {
        return (
            <svg {...props}>
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                <path d="M12 8l0 8" />
                <path d="M8 12l8 0" />
            </svg>
        )
    }

    // Build / Layers
    if (t.includes('build') || t.includes('layer')) {
        return (
            <svg {...props}>
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
            </svg>
        )
    }

    // Blend
    if (t.includes('blend')) {
        return (
            <svg {...props}>
                <path d="M6 3h12l-2 18H8L6 3z" />
                <path d="M12 10v4" />
                <path d="M10 12h4" />
            </svg>
        )
    }

    // Muddle
    if (t.includes('muddle')) {
        return (
            <svg {...props}>
                <path d="M9 3h6v4H9z" />
                <path d="M12 7v14" />
                <path d="M8 21h8" />
            </svg>
        )
    }

    // Default: Shaker Icon
    return (
        <svg {...props}>
            <path d="M8 3h8v2H8z" />
            <path d="M7 5l1 16h8l1-16H7z" />
            <path d="M10 8h4" />
        </svg>
    )
}
