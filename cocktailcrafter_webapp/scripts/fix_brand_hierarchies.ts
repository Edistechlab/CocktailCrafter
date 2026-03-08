import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const brandData = [
        { name: "Jack Daniel's", parent: 'cmma2hyf8001wsz0q2ca4rg9c', alc: 40.0, sugar: 0.1, acidity: 0.0, texture: 'Smooth, woody' },
        { name: "Tanqueray", parent: 'cmma2hyfe0028sz0qeizkx38f', alc: 43.1, sugar: 0.0, acidity: 0.0, texture: 'Sharp and clean' },
        { name: "Absolut Vodka", parent: 'cmma2hyfm002tsz0q74q2eakl', alc: 40.0, sugar: 0.0, acidity: 0.0, texture: 'Neutral and sharp' },
        { name: "Bacardi Carta Blanca", parent: 'cmma2hyfn002vsz0qeg4v0jwb', alc: 37.5, sugar: 0.0, acidity: 0.0, texture: 'Light and crisp' },
        { name: "Jose Cuervo Especial", parent: 'cmma2hyfj002nsz0q0tbaytrh', alc: 38.0, sugar: 0.5, acidity: 0.0, texture: 'Sharp and spicy' }
    ]

    for (const b of brandData) {
        await prisma.bottle.updateMany({
            where: { name: b.name },
            data: {
                parentId: b.parent,
                alcoholContent: b.alc,
                sugarContent: b.sugar,
                acidity: b.acidity,
                texture: b.texture
            }
        })
    }

    console.log('Updated brand hierarchies and metrics.')
}

main().finally(() => prisma.$disconnect())
