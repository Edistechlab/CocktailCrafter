import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const updated = await prisma.bottle.update({
        where: { id: "cmmadfn7o0000gb2yjqnf7y5j" },
        data: {
            sugarContent: 23.0, // approx 230g/L
            acidity: 0.4,
            texture: "Syrupy and complex",
            description: "A non-alcoholic tribute to the Italian bitter orange. Rich, vibrant and complex.",
            aroma: "Blood orange peel, ruby red grapefruit, maraschino cherries.",
            tasteProfile: "Bitter orange and zesty grapefruit, offset with generous sweetness."
        }
    })
    console.log('Updated Lyre\'s Italian Orange with metrics:', updated.name)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
