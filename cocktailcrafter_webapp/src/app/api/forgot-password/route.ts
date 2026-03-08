import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import crypto from "crypto"
import { sendPasswordResetEmail } from "@/lib/mail"

export async function POST(req: Request) {
    try {
        const { email } = await req.json()

        if (!email) {
            return NextResponse.json(
                { message: "Email is required" },
                { status: 400 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            // Return success even if user not found for security (avoid enumeration)
            return NextResponse.json(
                { message: "If an account exists with that email, a reset link has been sent." },
                { status: 200 }
            )
        }

        // 1. Generate Reset Token
        const tokenValue = crypto.randomBytes(32).toString('hex')
        const expires = new Date(Date.now() + 3600 * 1000) // 1 hour from now

        // 2. Clean up old tokens and save new one
        await prisma.passwordResetToken.deleteMany({
            where: { email }
        })

        await prisma.passwordResetToken.create({
            data: {
                email,
                token: tokenValue,
                expires,
            }
        })

        // 3. Send Reset Email (fire-and-forget)
        sendPasswordResetEmail(email, tokenValue).catch(err =>
            console.error("Failed to send reset email:", err)
        )

        return NextResponse.json(
            { message: "If an account exists with that email, a reset link has been sent." },
            { status: 200 }
        )

    } catch (error) {
        console.error("Forgot password error:", error)
        return NextResponse.json(
            { message: "An error occurred" },
            { status: 500 }
        )
    }
}
