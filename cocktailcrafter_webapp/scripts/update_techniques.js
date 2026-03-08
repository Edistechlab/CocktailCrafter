const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const updates = [
    {
        name: "Standard Stir",
        description: "A gentle mixing method for spirit-forward cocktails.",
        instructions: "Fill a chilled mixing glass with ice. Pour in ingredients. Use a bar spoon to stir gently for 30-40 seconds to achieve perfect dilution and chilling without aerating the drink."
    },
    {
        name: "Standard Shake (Hard/Regular)",
        description: "The most common method for chilling and aerating drinks.",
        instructions: "Combine ingredients in a shaker. Fill with large ice cubes. Shake vigorously horizontally for 12-15 seconds until the outside of the shaker is frost-cold."
    },
    {
        name: "Dry Shake",
        description: "Essential for cocktails with egg whites or aquafaba to create foam.",
        instructions: "Shake all ingredients WITHOUT ice first for 15 seconds to emulsify the proteins. Then add ice and shake again for 10 seconds to chill and dilute."
    },
    {
        name: "Reverse Dry Shake",
        description: "An alternative method for even thicker, more consistent foam.",
        instructions: "Shake ingredients WITH ice first to chill. Strain out the ice, then shake the chilled liquid again without ice to maximize aeration and foam stability."
    },
    {
        name: "Whip Shake (Short Shake)",
        description: "A quick shake with very little ice, often for tiki or crushed ice drinks.",
        instructions: "Add only one or two ice cubes (or a handful of crushed ice) to the shaker. Shake hard until the ice has completely melted. Pour everything (including the liquid ice) into the glass."
    },
    {
        name: "Build / Build over Ice",
        description: "Directly preparing the drink in the serving glass.",
        instructions: "Fill the serving glass with ice. Add ingredients one by one. Use a bar spoon to give it a quick, gentle stir to incorporate the flavors without over-diluting."
    },
    {
        name: "Rolling",
        description: "A gentle aeration method often used for Bloody Marys.",
        instructions: "Pour the ingredients back and forth between two shaker tins (one with ice, one without) about 5-6 times. This aerates the drink without breaking down the tomato juice texture."
    },
    {
        name: "Layered / Float",
        description: "Creating distinct visual layers of different densities.",
        instructions: "Pour the heaviest liquid first. Use the back of a bar spoon held close to the surface to slowly pour subsequent lighter liquids so they 'float' on top."
    },
    {
        name: "Swizzling",
        description: "A traditional method using a swizzle stick for crushed ice drinks.",
        instructions: "Fill a glass 3/4 with crushed ice. Insert the swizzle stick and spin it rapidly between your palms while moving it up and down until frost forms on the outside of the glass."
    }
];

async function main() {
    for (const item of updates) {
        await prisma.shakeTechnique.upsert({
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
        console.log(`Updated technique: ${item.name}`);
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
