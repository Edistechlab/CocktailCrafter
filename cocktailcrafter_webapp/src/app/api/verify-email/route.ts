import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const { token } = await req.json()

        if (!token) {
            return NextResponse.json(
                { message: "Missing token" },
                { status: 400 }
            )
        }

        // Find the token in the database
        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token }
        })

        if (!verificationToken) {
            return NextResponse.json(
                { message: "Invalid or expired token" },
                { status: 400 }
            )
        }

        // Check if token has expired
        if (new Date(verificationToken.expires) < new Date()) {
            await prisma.verificationToken.delete({
                where: { token }
            })
            return NextResponse.json(
                { message: "Token has expired" },
                { status: 400 }
            )
        }

        // Find and update the user
        const user = await prisma.user.findUnique({
            where: { email: verificationToken.identifier }
        })

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 400 }
            )
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { emailVerified: new Date() }
        })

        // Delete the used token
        await prisma.verificationToken.delete({
            where: { token }
        })

        return NextResponse.json(
            { message: "Email verified successfully" },
            { status: 200 }
        )

    } catch (error) {
        console.error("Email verification error:", error)
        return NextResponse.json(
            { message: "An error occurred during verification" },
            { status: 500 }
        )
    }
}
