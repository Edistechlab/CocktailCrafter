import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

/**
 * Mobile-only login endpoint.
 * Returns real user profile data (firstName, lastName, name, email)
 * since NextAuth cookie-based sessions don't work seamlessly with React Native fetch.
 */
export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
        }

        // Legacy hardcoded super admin (Edi)
        if (email === "Edi" && password === "CocktailEdi") {
            const dbUser = await prisma.user.findFirst({
                where: { name: "Edi" },
                include: { favorites: { select: { cocktailId: true } } }
            })
            if (dbUser) {
                return NextResponse.json({
                    success: true,
                    user: {
                        id: dbUser.id,
                        firstName: dbUser.firstName || dbUser.name || "Edi",
                        lastName: dbUser.lastName || "",
                        name: dbUser.firstName || dbUser.name || "Edi",
                        email: dbUser.email || "edi@cocktailcrafter.app",
                        role: "SUPER_ADMIN",
                    },
                    favorites: (dbUser.favorites || []).map(f => f.cocktailId),
                })
            }
        }

        // Look up user by email or name
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { name: email }
                ]
            },
            include: {
                favorites: { select: { cocktailId: true } }
            }
        })

        if (!user || !user.password) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
        }

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
        }

        // Build a proper display name: prefer firstName, fallback to name, fallback to email prefix
        const firstName = user.firstName || user.name || (user.email?.split("@")[0] ?? "User")
        const lastName = user.lastName || ""
        const displayName = [firstName, lastName].filter(Boolean).join(" ")

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                firstName,
                lastName,
                name: displayName,
                email: user.email,
                role: user.role || "USER",
            },
            favorites: (user.favorites || []).map((f: { cocktailId: string }) => f.cocktailId),
        })
    } catch (error) {
        console.error("[mobile-login] Error:", error)
        return NextResponse.json({ message: "Server error" }, { status: 500 })
    }
}
