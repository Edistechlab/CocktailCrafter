import { prisma } from "@/lib/prisma"
import CatalogsManager from "./CatalogsManager"

export const dynamic = 'force-dynamic'

export default async function CatalogsPage() {
    // Fetch all data sorted alphabetically
    const glasses = await prisma.glassType.findMany({ orderBy: { name: 'asc' } })
    const ices = await prisma.iceType.findMany({ orderBy: { name: 'asc' } })
    const techniques = await prisma.shakeTechnique.findMany({ orderBy: { name: 'asc' } })
    const garnishes = await prisma.garnish.findMany({ orderBy: { name: 'asc' } })

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <CatalogsManager
                initialGlasses={glasses}
                initialIces={ices}
                initialTechniques={techniques}
                initialGarnishes={garnishes}
            />
        </div>
    )
}
