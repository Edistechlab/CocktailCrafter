const { PrismaClient } = require('../node_modules/.prisma/client')
const p = new PrismaClient()

async function main() {
    // Revert Mai Tai back to original URL
    const maitai = await p.cocktail.findFirst({ where: { name: 'Mai Tai' } })
    if (maitai) {
        await p.cocktail.update({
            where: { id: maitai.id },
            data: { pictureUrl: '/images/cocktails/Mai_Tai.webp' }
        })
        console.log('✅ Mai Tai URL restored to Mai_Tai.webp')
    }
    await p.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
