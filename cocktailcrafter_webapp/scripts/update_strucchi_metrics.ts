import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const updated = await prisma.bottle.update({
        where: { name: "Strucchi Vermouth Rosso" },
        data: {
            sugarContent: 15.0, // 150g/L = 15%
            acidity: 0.5,       // Balanced acidity
            texture: "Medium-bodied, smooth and rich"
        }
    })
    console.log('Updated Vermouth with metrics:', updated.name)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
