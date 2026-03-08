import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json()

        if (!token || !password) {
            return NextResponse.json(
                { message: "Token and new password are required" },
                { status: 400 }
            )
        }

        // Find the token
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token }
        })

        if (!resetToken) {
            return NextResponse.json(
                { message: "Invalid or expired reset token" },
                { status: 400 }
            )
        }

        // Check expiry
        if (new Date(resetToken.expires) < new Date()) {
            await prisma.passwordResetToken.delete({
                where: { token }
            })
            return NextResponse.json(
                { message: "Reset link has expired" },
                { status: 400 }
            )
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Update user
        await prisma.user.update({
            where: { email: resetToken.email },
            data: { password: hashedPassword }
        })

        // Delete used token
        await prisma.passwordResetToken.delete({
            where: { token }
        })

        return NextResponse.json(
            { message: "Password updated successfully" },
            { status: 200 }
        )

    } catch (error) {
        console.error("Reset password error:", error)
        return NextResponse.json(
            { message: "An error occurred during password reset" },
            { status: 500 }
        )
    }
}
