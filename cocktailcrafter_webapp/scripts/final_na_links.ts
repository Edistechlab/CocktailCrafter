import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const finalLinks = [
        { name: 'Cachaça', naId: 'cmmaiy95u00005u3a1raaq4p7' }, // White Cane
        { name: 'Maraschino Liqueur', naId: 'cmmadfn820002gb2ybpimo14r' }, // Cherry Syrup
        { name: 'Benedictine', naId: 'cmmaiy96f00015u3asov524om' }, // Agave Syrup as base
        { name: 'Overproof Rum', naId: 'cmmadh4y30000g3timxf9dz1u' }, // Dark Cane
        { name: 'Drambuie', naId: 'cmmaiy96f00015u3asov524om' }, // Agave Syrup as base
    ]

    for (const l of finalLinks) {
        await prisma.bottle.updateMany({
            where: { name: l.name },
            data: { nonAlcoholicId: l.naId }
        })
    }

    console.log('Final NA links completed.')
}

main().finally(() => prisma.$disconnect())
