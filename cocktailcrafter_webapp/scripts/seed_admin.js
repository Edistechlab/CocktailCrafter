const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = "info@edistechlab.com";
    const firstName = "Edi";
    const lastName = "Edlinger";
    const password = "admin-password-123";

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            firstName,
            lastName,
            name: `${firstName} ${lastName}`,
            emailVerified: new Date(),
            role: "SUPER_ADMIN",
        },
        create: {
            email,
            firstName,
            lastName,
            name: `${firstName} ${lastName}`,
            password: hashedPassword,
            emailVerified: new Date(),
            role: "SUPER_ADMIN",
        },
    });

    console.log(`User ${user.email} created/updated and verified.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
