import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const updates = [
        { name: 'Cherry Juice', sugar: 12.0, acidity: 3.5, texture: 'Thin, dark red' },
        { name: 'Apricot Syrup', sugar: 60.0, acidity: 1.5, texture: 'Syrupy, orange' },
        { name: 'Juice', sugar: 8.0, acidity: 4.0, texture: 'Thin liquid' },
        { name: 'Crème de Cassis', naId: 'cmmadim7x00009i788yzkk8wj' }, // Cassis Syrup
        { name: 'Cherry Liqueur', naId: 'cmmadfn820002gb2ybpimo14r' }, // Cherry Syrup
        { name: 'Apricot Liqueur', naId: 'cmmad7xg60001b6mv6h01prpr' }, // Apricot Syrup
        { name: 'Crème de Violette', naId: 'cmmadim8700019i788im6mluw' }, // Violet Syrup
        { name: 'Hazelnut Liqueur', naId: 'cmmaiqqiv0000buqr9zkf196l' }, // Hazelnut Syrup
    ]

    for (const u of updates) {
        await prisma.bottle.updateMany({
            where: { name: u.name },
            data: {
                sugarContent: u.sugar ?? undefined,
                acidity: u.acidity ?? undefined,
                texture: u.texture ?? undefined,
                nonAlcoholicId: u.naId ?? undefined,
            }
        })
    }
}

main().finally(() => prisma.$disconnect())
