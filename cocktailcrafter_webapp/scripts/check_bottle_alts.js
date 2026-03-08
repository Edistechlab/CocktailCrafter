const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const bottles = await prisma.bottle.findMany();
    let countAlt = 0;
    let countNA = 0;

    for (const b of bottles) {
        if (b.alternatives) {
            console.log(`Bottle: ${b.name} -> Alternatives string: ${b.alternatives}`);
            countAlt++;
        }
        if (b.nonAlcoholicOptions) {
            console.log(`Bottle: ${b.name} -> NA string: ${b.nonAlcoholicOptions}`);
            countNA++;
        }
        if (b.alternativeId) {
            console.log(`Bottle: ${b.name} -> alternativeId: ${b.alternativeId}`);
        }
        if (b.nonAlcoholicId) {
            console.log(`Bottle: ${b.name} -> nonAlcoholicId: ${b.nonAlcoholicId}`);
        }
    }
    console.log('bottles with alternatives string: ' + countAlt);
    console.log('bottles with NA string: ' + countNA);
}

main().finally(() => prisma.$disconnect());
