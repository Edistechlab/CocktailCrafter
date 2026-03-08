const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

// The logic from lib/cocktailCalculations.ts
function calculateMetrics(ingredients, dilution = 0) {
    let totalVolume = 0;
    let totalAlcoholVolume = 0;
    let totalSugar = 0;
    let totalAcid = 0;

    ingredients.forEach(ing => {
        const amount = ing.amount;
        totalVolume += amount;
        if (ing.alcoholContent) totalAlcoholVolume += (amount * ing.alcoholContent) / 100;
        if (ing.sugarContent) totalSugar += (amount * ing.sugarContent) / 100;
        if (ing.acidity) totalAcid += (amount * ing.acidity) / 100;
    });

    if (totalVolume === 0) return { abv: 0, balance: 5 };

    const finalVolume = totalVolume * (1 + dilution);
    const abv = (totalAlcoholVolume / finalVolume) * 100;

    let balance = 5;
    const ACID_WEIGHT = 10;
    if (totalAcid > 0) {
        const weightedRatio = totalSugar / (totalAcid * ACID_WEIGHT);
        if (weightedRatio > 0) {
            balance = 5 + (Math.log2(weightedRatio) * 2);
        } else {
            balance = 1;
        }
    } else if (totalSugar > 0) {
        balance = 8;
    }
    balance = Math.min(10, Math.max(0, balance));

    return {
        abv: parseFloat(abv.toFixed(1)),
        balance: parseFloat(balance.toFixed(1))
    };
}

async function main() {
    console.log('🔄 Syncing Database to Mobile CocktailData.json...');

    const cocktails = await prisma.cocktail.findMany({
        include: {
            tastes: true,
            techniques: true,
            garnishes: true,
            glasses: true,
            ices: true,
            user: true
        }
    });

    const bottles = await prisma.bottle.findMany({
        include: {
            nonAlcoholic: true
        }
    });

    const bottlesMap = bottles.reduce((acc, b) => ({ ...acc, [b.id]: b }), {});

    // Generate NA Mapping
    const naMapping = {};
    bottles.forEach(b => {
        if (b.nonAlcoholic) {
            naMapping[b.name] = b.nonAlcoholic.name;
        }
    });

    const recipes = cocktails.map(c => {
        const rawMix = c.mixList || '[]';
        let mixList = [];
        try {
            mixList = JSON.parse(rawMix);
        } catch (e) {
            console.error(`Error parsing mixList for ${c.name}`);
        }

        if (mixList.length === 0) {
            console.warn(`⚠️ Warning: ${c.name} has an empty mixList!`);
        }

        const technique = c.techniques[0];
        const dilution = technique ? (technique.dilution || 0) : 0;

        const calcIngredients = mixList.map(item => {
            const bottle = bottlesMap[item.bottleId];
            return {
                amount: parseFloat(item.amount) || 0,
                alcoholContent: bottle ? (bottle.alcoholContent || 0) : 0,
                sugarContent: bottle ? (bottle.sugarContent || 0) : 0,
                acidity: bottle ? (bottle.acidity || 0) : 0
            };
        });

        const metrics = calculateMetrics(calcIngredients, dilution);

        return {
            id: c.id,
            name: c.name,
            description: c.description || "",
            pictureUrl: c.pictureUrl || "",
            automationLevel: c.automationLevel || 0,
            recipeJson: rawMix,
            instructions: c.instruction || "",
            history: c.history || "",
            abv: metrics.abv,
            balance: metrics.balance,
            votingScore: c.votingScore || 0,
            ratingAvg: 0,
            ratingCount: 0,
            glass: c.glasses[0]?.name || "Standard Glass",
            ice: c.ices[0]?.name || "None",
            garnishes: c.garnishes.map(g => ({ name: g.name, description: g.description })),
            tastes: c.tastes.map(t => t.name),
            technique: technique ? technique.name : "Build"
        };
    });

    const output = { recipes, naMapping };
    const outputPath = path.join(__dirname, '../cocktailcrafter-mobile/constants/CocktailData.json');

    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`✅ Successfully synced ${recipes.length} cocktails to mobile JSON.`);
    console.log(`✅ Included ${Object.keys(naMapping).length} NA ingredient mappings.`);
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
