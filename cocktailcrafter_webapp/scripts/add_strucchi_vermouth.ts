import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const vermouth = await prisma.bottle.create({
        data: {
            name: "Strucchi Vermouth Rosso",
            description: "An Italian red vermouth, tribute to Arnaldo Strucchi. Rich, intense, and complex.",
            aroma: "Green grapes, bay leaf, tobacco, herbal.",
            tasteProfile: "Medium-bodied, bittersweet, tobacco leaf, cola cubes, anise, liquorice, nutmeg, cinnamon, white pepper, orange peel.",
            alcoholContent: 16,
            parentId: "cmma2hyfj002msz0qrnddeo6z", // Sweet Vermouth
        }
    })
    console.log('Created Vermouth:', vermouth.name)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
