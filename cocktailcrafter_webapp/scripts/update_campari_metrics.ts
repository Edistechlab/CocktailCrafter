import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const updated = await prisma.bottle.update({
        where: { name: "Campari" },
        data: {
            description: "A distinctive red aperitif known for its complex and bittersweet flavor profile. The heart of the Negroni.",
            aroma: "Blood orange peel, orange sherbet, ruby red grapefruit zest, quinine, bay leaf, cherry, lemon thyme, herbal woodiness.",
            tasteProfile: "Herbaceous quinine bitterness, lightly syrupy sweetness, blood orange zest, mint, cherry, honey.",
            texture: "Syrupy and smooth",
            alcoholContent: 25.0,
            sugarContent: 25.0, // approx 250g/L
            acidity: 0.4,
        }
    })
    console.log('Updated Campari with metrics:', updated.name)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
