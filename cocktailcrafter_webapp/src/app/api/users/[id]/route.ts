import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        // Only Super Admins can delete other users
        if (!session?.user?.id || session.user.role !== "SUPER_ADMIN") {
            return NextResponse.json(
                { message: "Forbidden: Admin access required" },
                { status: 403 }
            )
        }

        const { id } = await params

        // Prevent deleting yourself from this route (safety)
        if (id === session.user.id) {
            return NextResponse.json(
                { message: "You cannot delete your own account from the user management page." },
                { status: 400 }
            )
        }

        // Delete the user
        await prisma.user.delete({
            where: { id }
        })

        return NextResponse.json(
            { message: "User successfully deleted" },
            { status: 200 }
        )

    } catch (error: any) {
        console.error("Delete user error:", error)
        return NextResponse.json(
            { message: `An error occurred while deleting the user: ${error?.message || String(error)}` },
            { status: 500 }
        )
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        // Only Super Admins can change roles
        if (!session?.user?.id || session.user.role !== "SUPER_ADMIN") {
            return NextResponse.json(
                { message: "Forbidden: Admin access required" },
                { status: 403 }
            )
        }

        const { id } = await params
        const { role } = await req.json()

        const allowedRoles = ["USER", "MODERATOR", "ADMIN", "SUPER_ADMIN"]

        if (!role || !allowedRoles.includes(role)) {
            return NextResponse.json(
                { message: "Invalid role specified" },
                { status: 400 }
            )
        }

        // Prevent changing your own role (safety)
        if (id === session.user.id) {
            return NextResponse.json(
                { message: "You cannot change your own role." },
                { status: 400 }
            )
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { role }
        })

        return NextResponse.json(
            { message: "User role updated successfully", role: updatedUser.role },
            { status: 200 }
        )

    } catch (error) {
        console.error("Update user role error:", error)
        return NextResponse.json(
            { message: "An error occurred while updating the user role" },
            { status: 500 }
        )
    }
}
