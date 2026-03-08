import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import CocktailForm from "../../new/CocktailForm"

export default async function EditCocktailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) redirect("/login")

    const isSuperAdmin = session.user.role === "SUPER_ADMIN"

    const [cocktail, glasses, techniques, ices, tastes, garnishes, allBottles] = await Promise.all([
        prisma.cocktail.findUnique({
            where: { id },
            include: { glasses: true, techniques: true, ices: true, tastes: true, garnishes: true }
        }),
        prisma.glassType.findMany({ orderBy: { name: 'asc' } }),
        prisma.shakeTechnique.findMany({ orderBy: { name: 'asc' } }),
        prisma.iceType.findMany({ orderBy: { name: 'asc' } }),
        prisma.tasteProfile.findMany({ orderBy: { name: 'asc' } }),
        prisma.garnish.findMany({ orderBy: { name: 'asc' } }),
        prisma.bottle.findMany({ orderBy: { name: 'asc' } })
    ])

    if (!cocktail) notFound()

    // Only owner or super admin can edit
    if (!isSuperAdmin && cocktail.userId !== session.user.id) notFound()

    const parentIds = new Set(allBottles.map((b: any) => b.parentId).filter(Boolean))
    const bottles = allBottles
        .filter((b: any) => !b.parentId || parentIds.has(b.id))
        .map((b: any) => {
            if (b.parentId) {
                const parent = allBottles.find((p: any) => p.id === b.parentId)
                if (parent) return { ...b, name: `${parent.name}: ${b.name}` }
            }
            return b
        })
        .sort((a: any, b: any) => a.name.localeCompare(b.name))

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <Link href="/dashboard/cocktails" className="inline-flex items-center gap-2 text-[#888c94] hover:text-white transition-colors mb-6 text-sm font-semibold">
                <i className="ph-bold ph-arrow-left"></i> Back to Cocktails
            </Link>
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Edit Cocktail</h1>
                <p className="text-[#888c94]">Update the details for <span className="text-white font-semibold">{cocktail.name}</span>.</p>
            </header>

            <CocktailForm
                glasses={glasses}
                techniques={techniques}
                ices={ices}
                tastes={tastes}
                garnishes={garnishes}
                bottles={bottles}
                initialData={cocktail}
            />
        </div>
    )
}
