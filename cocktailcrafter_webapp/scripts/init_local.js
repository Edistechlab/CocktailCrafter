const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('--- Initializing Local Dashboard ---')

    // 1. Ensure a user exists
    let user = await prisma.user.findFirst({ where: { email: 'edi@cocktail-crafter.com' } })
    if (!user) {
        user = await prisma.user.create({
            data: {
                name: 'Edi',
                email: 'edi@cocktail-crafter.com',
                nickname: 'Edi Techlab'
            }
        })
        console.log('✅ Local user "Edi" created.')
    } else {
        console.log('✅ User "Edi" already exists.')
    }
}

main()
    .catch(e => { console.error(e); process.exit(1) })
    .finally(async () => { await prisma.$disconnect() })
