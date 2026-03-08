const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const bottles = await prisma.bottle.findMany({
    where: {
      OR: [
        { alternatives: { not: null, not: "" } },
        { nonAlcoholicOptions: { not: null, not: "" } }
      ]
    }
  });

  for (const b of bottles) {
    if (b.alternatives) {
      console.log(`Bottle: ${b.name} -> Alternatives: ${b.alternatives}`);
    }
    if (b.nonAlcoholicOptions) {
      console.log(`Bottle: ${b.name} -> N/A: ${b.nonAlcoholicOptions}`);
    }
  }
}

main().finally(() => prisma.$disconnect());
