import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"
import { sendAccountDeletionEmail } from "@/lib/mail"

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            )
        }

        const userId = session.user.id

        // Fetch user data before deleting (we need email + name for the goodbye email)
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true, firstName: true, name: true }
        })

        await prisma.user.delete({ where: { id: userId } })

        // Send goodbye email (fire-and-forget — don't fail the delete if email fails)
        if (user?.email) {
            sendAccountDeletionEmail(user.email, user.firstName || user.name).catch(err =>
                console.error("Failed to send deletion email:", err)
            )
        }

        return NextResponse.json(
            { message: "Account successfully deleted" },
            { status: 200 }
        )

    } catch (error) {
        console.error("Delete account error:", error)
        return NextResponse.json(
            { message: "An error occurred while deleting your account" },
            { status: 500 }
        )
    }
}
