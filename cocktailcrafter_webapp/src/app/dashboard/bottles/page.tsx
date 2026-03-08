import { prisma } from "@/lib/prisma"
import BottlesManager from "./BottlesManager"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function BottlesPage() {
    try {
        const bottles = await prisma.bottle.findMany({
            orderBy: { name: 'asc' }
        });

        // Safe serialization for Next.js Server Components
        const serializedBottles = bottles.map(b => ({
            ...b,
            createdAt: b.createdAt instanceof Date ? b.createdAt.toISOString() : b.createdAt,
            updatedAt: b.updatedAt instanceof Date ? b.updatedAt.toISOString() : b.updatedAt,
        }));

        return (
            <div className="p-8 max-w-7xl mx-auto min-h-screen">
                <BottlesManager initialBottles={JSON.parse(JSON.stringify(serializedBottles))} />
            </div>
        );
    } catch (error) {
        console.error("Prisma Fetch Error:", error);
        return (
            <div className="p-20 text-center">
                <h1 className="text-2xl font-bold text-red-500">Database Connection Error</h1>
                <p className="text-white/40 mt-2">The server is currently unable to fetch the bottle library. Please try again in a few seconds.</p>
            </div>
        );
    }
}
