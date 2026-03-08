const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const updates = [
    {
        name: "Citrus Twists / Peels",
        description: "Aromatic oils from lemon, orange, or lime peels.",
        instructions: "Cut a thin strip of peel (avoid the white pith). Twist it over the drink to express the essential oils onto the surface, then drop it in or drape it on the rim."
    },
    {
        name: "Citrus Wheels / Slices",
        description: "Thin round slices of fresh citrus fruit.",
        instructions: "Slice the fruit crosswise into thin, uniform wheels. Place on the rim of the glass or float on top of the drink for visual appeal."
    },
    {
        name: "Citrus Wedges",
        description: "Thick quarters of citrus fruit providing squeezable juice.",
        instructions: "Cut the lime or lemon into eighths. These are meant to be squeezed by the guest into the drink to adjust the acidity."
    },
    {
        name: "Fresh Herbs",
        description: "Mint leaves, basil, or rosemary sprigs.",
        instructions: "For herbs like mint, smack the sprig between your palms before garnishing to 'wake up' the aromatic oils."
    },
    {
        name: "Cocktail Cherries",
        description: "Maraschino, Luxardo, or brandied cherries.",
        instructions: "Place one or two cherries on a cocktail pick and rest it across the rim, or drop them directly into the glass for a sweet finish."
    },
    {
        name: "Olives",
        description: "Savory green olives, often used in Martinis.",
        instructions: "Skewer three olives on a pick (the 'Rule of Three') and rest it in the glass. For a 'Dirty' version, add a splash of the olive brine."
    },
    {
        name: "Pickled / Savory Garnishes",
        description: "Pickled onions (Gibsons), beans, or celery.",
        instructions: "Use these to add an umami or savory note. Often used in Bloody Marys or Gibsons."
    },
    {
        name: "Fresh Fruits / Berries",
        description: "Strawberries, blackberries, or fresh fruit chunks.",
        instructions: "Place small berries directly into the glass or skewer larger fruit chunks (like pineapple) on a pick."
    },
    {
        name: "Tropical / Exotic Fruits",
        description: "Pineapple wedges, passion fruit halves, or coconut.",
        instructions: "Create a vacation feel with large, bold fruit slices. Passion fruit halves can be floated on top of tiki drinks."
    },
    {
        name: "Rims",
        description: "Salt, sugar, or spice coatings on the glass edge.",
        instructions: "Moisten the rim with a citrus wedge, then dip it into a shallow plate of salt/sugar. Tap the glass to remove excess."
    },
    {
        name: "Grated Spices",
        description: "Freshly grated nutmeg, cinnamon, or cocoa powder.",
        instructions: "Grate the spice directly over the finished drink (or foam) for an immediate aromatic hit as the guest takes a sip."
    },
    {
        name: "Edible Flowers",
        description: "Elegant garnishes like lavender, pansies, or rose petals.",
        instructions: "Gently float the flower on top of the drink or foam. Ensure they are specifically food-grade/edible flowers."
    },
    {
        name: "Dehydrated Fruits",
        description: "Dried citrus slices providing a modern, premium look.",
        instructions: "Place a dried wheel on top of the drink. They provide a subtle, concentrated aroma and a beautiful aesthetic."
    },
    {
        name: "Mint",
        description: "Fresh mint sprigs for aroma and decoration.",
        instructions: "Gather a few sprigs and smack them against the back of your hand to release the oils before placing them near the straw."
    },
    {
        name: "Lime Slice",
        description: "A fresh lime wheel or half-wheel.",
        instructions: "Cut a slit to the center of the wheel and slide it onto the rim of the glass."
    },
    {
        name: "Lemon Peel",
        description: "A zest or twist of fresh lemon skin.",
        instructions: "Use a channel knife for a thin spiral or a peeler for a wide swatch. Express the oils and rim the glass with the peel."
    }
];

async function main() {
    for (const item of updates) {
        await prisma.garnish.upsert({
            where: { name: item.name },
            update: {
                description: item.description,
                instructions: item.instructions
            },
            create: {
                name: item.name,
                description: item.description,
                instructions: item.instructions
            }
        });
        console.log(`Updated garnish: ${item.name}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
