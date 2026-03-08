import React from 'react'

export function GlassIcon({ type, className = "w-6 h-6" }: { type: string, className?: string }) {
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

    // Martini — perfect inverted V (straight diagonal sides), long stem, base
    if (t.includes('martini') || t.includes('cocktail')) {
        return (
            <svg {...props}>
                <path d="M3 4h18" />
                <path d="M3 4L12 15" />
                <path d="M21 4L12 15" />
                <path d="M12 15v5" />
                <path d="M8 20h8" />
            </svg>
        )
    }

    // Highball — narrow straight cylinder, thick flat base foot
    if (t.includes('highball') || t.includes('longdrink')) {
        return (
            <svg {...props}>
                <path d="M8 3h8" />
                <path d="M8 3v18" />
                <path d="M16 3v18" />
                <path d="M8 21h8" />
                <path d="M7 22h10" />
                <path d="M8 9h8" />
            </svg>
        )
    }

    // Rocks / Old Fashioned — short, wide, tapered (wider at top), cut-crystal diagonals
    if (t.includes('rocks') || t.includes('fashioned') || t.includes('tumbler')) {
        return (
            <svg {...props}>
                <path d="M4 7h16" />
                <path d="M4 7L5.5 20" />
                <path d="M20 7L18.5 20" />
                <path d="M5.5 20h13" />
                <path d="M12 20L5 10" />
                <path d="M12 20L19 10" />
            </svg>
        )
    }

    // Coupe / Coupette — wide shallow rounded bowl, medium stem
    if (t.includes('coupe') || t.includes('coupette')) {
        return (
            <svg {...props}>
                <path d="M3 6h18" />
                <path d="M3 6 C3 11 7 14 12 14" />
                <path d="M21 6 C21 11 17 14 12 14" />
                <path d="M12 14v7" />
                <path d="M8.5 21h7" />
            </svg>
        )
    }

    // Margarita — wide rim, outer bowl + inner curved shelf
    if (t.includes('margarita')) {
        return (
            <svg {...props}>
                <path d="M2 5h20" />
                <path d="M2 5 C4 5 9 13 12 13" />
                <path d="M22 5 C20 5 15 13 12 13" />
                <path d="M5 8 Q12 12.5 19 8" />
                <path d="M12 13v7" />
                <path d="M8 20h8" />
            </svg>
        )
    }

    // Collins — taller wider straight glass, slight taper, fill line
    if (t.includes('collins')) {
        return (
            <svg {...props}>
                <path d="M7 3h10" />
                <path d="M7 3L7.5 21" />
                <path d="M17 3L16.5 21" />
                <path d="M7.5 21h9" />
                <path d="M6.5 22h11" />
                <path d="M7 8h10" />
            </svg>
        )
    }

    // Hurricane — S-curve sides: slight waist at top, wide belly, short stem + base
    if (t.includes('hurricane')) {
        return (
            <svg {...props}>
                <path d="M8 3h8" />
                <path d="M8 3 C10 7 4 13 10 19" />
                <path d="M16 3 C14 7 20 13 14 19" />
                <path d="M10 19h4" />
                <path d="M12 19v2" />
                <path d="M9 21h6" />
            </svg>
        )
    }

    // Flute / Champagne — very narrow elongated tube, barely tapered, long stem
    if (t.includes('flute') || t.includes('champagne')) {
        return (
            <svg {...props}>
                <path d="M9.5 3h5" />
                <path d="M9.5 3L10 17" />
                <path d="M14.5 3L14 17" />
                <path d="M10 17h4" />
                <path d="M12 17v4" />
                <path d="M9.5 21h5" />
            </svg>
        )
    }

    // Copper Mug — stocky wide body, D-shaped handle on right, base foot
    if (t.includes('copper') || t.includes('mule')) {
        return (
            <svg {...props}>
                <path d="M5 7h12" />
                <path d="M5 7v12" />
                <path d="M17 7v12" />
                <path d="M5 19h12" />
                <path d="M4 20h14" />
                <path d="M17 10 C21 10 21 18 17 18" />
                <path d="M5 12h12" />
            </svg>
        )
    }

    // Tiki Mug — mug outline + tiki face (angry V-brows, eyes, teeth-grimace)
    if (t.includes('tiki')) {
        return (
            <svg {...props}>
                <path d="M6.5 3h11" />
                <path d="M6.5 3L7 21" />
                <path d="M17.5 3L17 21" />
                <path d="M7 21h10" />
                <path d="M7.5 8L10.5 10.5" />
                <path d="M16.5 8L13.5 10.5" />
                <path d="M8 12h3.5" />
                <path d="M12.5 12h3.5" />
                <path d="M8 16h8" />
                <path d="M8 19h8" />
                <path d="M10 16v3" />
                <path d="M12 16v3" />
                <path d="M14 16v3" />
            </svg>
        )
    }

    // Shot — strong taper (wide top → narrow bottom), thick stepped base
    if (t.includes('shot')) {
        return (
            <svg {...props}>
                <path d="M7 8h10" />
                <path d="M7 8L9 20" />
                <path d="M17 8L15 20" />
                <path d="M9 20h6" />
                <path d="M7.5 22h9" />
            </svg>
        )
    }

    // Nick & Nora — rounded spherical bowl on a medium stem
    if (t.includes('nick') || t.includes('nora')) {
        return (
            <svg {...props}>
                <path d="M8 5h8" />
                <path d="M8 5 C5 7 4 11 12 14" />
                <path d="M16 5 C19 7 20 11 12 14" />
                <path d="M12 14v6" />
                <path d="M8.5 20h7" />
            </svg>
        )
    }

    // Poco Grande / Tulip — vase shape: widens to belly then narrows at rim, long stem
    if (t.includes('poco') || t.includes('tulip')) {
        return (
            <svg {...props}>
                <path d="M9.5 3h5" />
                <path d="M9.5 3 C6 5 4 9 5 12 C7 14 10 15 12 15.5" />
                <path d="M14.5 3 C18 5 20 9 19 12 C17 14 14 15 12 15.5" />
                <path d="M12 15.5v5" />
                <path d="M8.5 20.5h7" />
            </svg>
        )
    }

    // Default (Generic Cup/Glass)
    return (
        <svg {...props}>
            <path d="M7 4h10" />
            <path d="M7 4L8 20" />
            <path d="M17 4L16 20" />
            <path d="M8 20h8" />
            <path d="M6.5 21.5h11" />
        </svg>
    )
}
