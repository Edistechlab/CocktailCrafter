import { prisma } from "@/lib/prisma"
import UsersListClient from "./UsersListClient"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function UsersPage() {
    const session = await getServerSession(authOptions)
    const currentUserRole = session?.user?.role || "USER"

    // Fetch all users sorted by newer registrations first
    const usersData = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            emailVerified: true,
            role: true,
            createdAt: true,
            _count: {
                select: {
                    cocktails: true,
                    favorites: true
                }
            }
        }
    })

    // Prepare data for client component
    const users = usersData.map(u => ({
        ...u,
        createdAt: new Date(u.createdAt),
        emailVerified: u.emailVerified ? new Date(u.emailVerified) : null
    }))

    const totalCount = users.length
    const verifiedCount = users.filter(u => u.emailVerified).length

    return (
        <div className="p-8 max-w-[1400px] mx-auto">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Registered Users</h1>
                    <p className="text-[#888c94]">View and manage all registered accounts on CocktailCrafter.</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-6 shadow-xl">
                    <div className="text-center border-r border-white/10 pr-6">
                        <p className="text-[10px] text-[#888c94] uppercase tracking-widest font-bold mb-0.5">Total</p>
                        <p className="text-xl font-black text-white">{totalCount}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] text-emerald-500 uppercase tracking-widest font-bold mb-0.5">Verified</p>
                        <p className="text-xl font-black text-emerald-400">{verifiedCount}</p>
                    </div>
                </div>
            </header>

            {/* Client Component for Interactive User Table with Search/Filters */}
            <UsersListClient users={users} currentUserRole={currentUserRole} />
        </div>
    )
}
