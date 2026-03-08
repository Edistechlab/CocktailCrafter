import { prisma } from "@/lib/prisma"
import CocktailForm from "./CocktailForm"

export default async function NewCocktailPage() {
    const [glasses, techniques, ices, tastes, garnishes, allBottles] = await Promise.all([
        prisma.glassType.findMany({ orderBy: { name: 'asc' } }),
        prisma.shakeTechnique.findMany({ orderBy: { name: 'asc' } }),
        prisma.iceType.findMany({ orderBy: { name: 'asc' } }),
        prisma.tasteProfile.findMany({ orderBy: { name: 'asc' } }),
        prisma.garnish.findMany({ orderBy: { name: 'asc' } }),
        prisma.bottle.findMany({ orderBy: { name: 'asc' } })
    ])

    // Filter bottles to only show categories/generics in recipes.
    const parentIds = new Set(allBottles.map((b: any) => b.parentId).filter(Boolean));
    const bottles = allBottles
        .filter((b: any) => !b.parentId || parentIds.has(b.id))
        .map((b: any) => {
            if (b.parentId) {
                const parent = allBottles.find((p: any) => p.id === b.parentId);
                if (parent) {
                    return { ...b, name: `${parent.name}: ${b.name}` };
                }
            }
            return b;
        })
        .sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <header className="mb-8 text-left">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Craft New Cocktail</h1>
                <p className="text-[#888c94]">Fill out the details to add a new recipe to your CocktailCrafter database.</p>
            </header>

            <CocktailForm
                glasses={glasses}
                techniques={techniques}
                ices={ices}
                tastes={tastes}
                garnishes={garnishes}
                bottles={bottles}
            />
        </div>
    )
}
