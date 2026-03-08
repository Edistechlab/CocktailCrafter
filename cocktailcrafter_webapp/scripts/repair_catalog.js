const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const scriptsDir = path.join(__dirname, '../scripts');
    const seedFiles = fs.readdirSync(scriptsDir).filter(f => f.startsWith('seed_') && f.endsWith('.js'));

    const bottles = new Set();
    const glasses = new Set();
    const ices = new Set();
    const techniques = new Set();
    const tastes = new Set();
    const garnishes = new Set();

    for (const file of seedFiles) {
        const content = fs.readFileSync(path.join(scriptsDir, file), 'utf8');

        // Match: { name: 'Something' }
        const matches = content.matchAll(/name:\s*'([^']+)'/g);
        for (const match of matches) {
            const name = match[1];
            // Infer type by context if possible or just add to the right one based on common bar names or script lookup names
            // Actually, better to look at where the lookup is happening:
            // .bottle.findFirst({ where: { name: 'X' } })
        }

        // Extract specific types using regex
        const typeRegexes = {
            bottle: /\.bottle\.findFirst\(\{ where: \{ name: '([^']+)' \} \}\)/g,
            glass: /\.glassType\.findFirst\(\{ where: \{ name: '([^']+)' \} \}\)/g,
            ice: /\.iceType\.findFirst\(\{ where: \{ name: '([^']+)' \} \}\)/g,
            technique: /\.shakeTechnique\.findFirst\(\{ where: \{ name: '([^']+)' \} \}\)/g,
            taste: /\.tasteProfile\.findFirst\(\{ where: \{ name: '([^']+)' \} \}\)/g,
            garnish: /\.garnish\.findFirst\(\{ where: \{ name: '([^']+)' \} \}\)/g
        };

        for (const [type, regex] of Object.entries(typeRegexes)) {
            const matches = content.matchAll(regex);
            for (const match of matches) {
                if (type === 'bottle') bottles.add(match[1]);
                if (type === 'glass') glasses.add(match[1]);
                if (type === 'ice') ices.add(match[1]);
                if (type === 'technique') techniques.add(match[1]);
                if (type === 'taste') tastes.add(match[1]);
                if (type === 'garnish') garnishes.add(match[1]);
            }
        }
    }

    console.log(`Discovered: ${bottles.size} bottles, ${glasses.size} glasses, etc.`);

    for (const name of bottles) await prisma.bottle.upsert({ where: { name }, update: {}, create: { name, description: 'Added via repair script' } });
    for (const name of glasses) await prisma.glassType.upsert({ where: { name }, update: {}, create: { name, description: 'Added via repair script' } });
    for (const name of ices) await prisma.iceType.upsert({ where: { name }, update: {}, create: { name, description: 'Added via repair script' } });
    for (const name of techniques) await prisma.shakeTechnique.upsert({ where: { name }, update: {}, create: { name, description: 'Added via repair script' } });
    for (const name of tastes) await prisma.tasteProfile.upsert({ where: { name }, update: {}, create: { name, description: 'Added via repair script' } });
    for (const name of garnishes) await prisma.garnish.upsert({ where: { name }, update: {}, create: { name, description: 'Added via repair script' } });

    console.log('✅ Catalog repaired with all missing entries from existing seed scripts.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
