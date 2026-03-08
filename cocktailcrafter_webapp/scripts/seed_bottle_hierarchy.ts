import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface BottleData {
  category: string;
  type: string;
  brand: string;
}

// Complete bottle hierarchy with all provided data
const BOTTLE_HIERARCHY: BottleData[] = [
  // WHISKEY
  { category: "Whiskey", type: "Bourbon", brand: "Maker's Mark" },
  { category: "Whiskey", type: "Bourbon", brand: "Buffalo Trace" },
  { category: "Whiskey", type: "Bourbon", brand: "Woodford Reserve" },
  { category: "Whiskey", type: "Tennessee Whiskey", brand: "Jack Daniel's" },
  { category: "Whiskey", type: "Tennessee Whiskey", brand: "George Dickel" },
  { category: "Whiskey", type: "Scotch Single Malt", brand: "Glenfiddich" },
  { category: "Whiskey", type: "Scotch Single Malt", brand: "Macallan" },
  { category: "Whiskey", type: "Scotch Blended", brand: "Johnnie Walker" },
  { category: "Whiskey", type: "Scotch Blended", brand: "Chivas Regal" },
  { category: "Whiskey", type: "Irish Whiskey", brand: "Jameson" },
  { category: "Whiskey", type: "Irish Whiskey", brand: "Redbreast" },
  { category: "Whiskey", type: "Rye Whiskey", brand: "Bulleit Rye" },
  { category: "Whiskey", type: "Rye Whiskey", brand: "Sazerac Rye" },
  { category: "Whiskey", type: "Canadian Whisky", brand: "Crown Royal" },
  { category: "Whiskey", type: "Canadian Whisky", brand: "Canadian Club" },
  { category: "Whiskey", type: "Japanese Whisky", brand: "Yamazaki" },
  { category: "Whiskey", type: "Japanese Whisky", brand: "Hibiki" },

  // GIN
  { category: "Gin", type: "London Dry Gin", brand: "Beefeater" },
  { category: "Gin", type: "London Dry Gin", brand: "Tanqueray" },
  { category: "Gin", type: "London Dry Gin", brand: "Bombay Sapphire" },
  { category: "Gin", type: "Plymouth Gin", brand: "Plymouth Gin" },
  { category: "Gin", type: "Old Tom Gin", brand: "Hayman's Old Tom" },
  { category: "Gin", type: "Dry Gin", brand: "Gordon's" },
  { category: "Gin", type: "New Western Gin", brand: "Hendrick's" },
  { category: "Gin", type: "New Western Gin", brand: "Aviation" },
  { category: "Gin", type: "Sloe Gin", brand: "Plymouth Sloe Gin" },
  { category: "Gin", type: "Genever", brand: "Bols Genever" },
  { category: "Gin", type: "Genever", brand: "Filliers Genever" },
  { category: "Gin", type: "Navy Strength Gin", brand: "Plymouth Navy Strength" },
  { category: "Gin", type: "Navy Strength Gin", brand: "Hayman's Navy Strength" },
  { category: "Gin", type: "Barrel Aged Gin", brand: "Citadelle Réserve" },
  { category: "Gin", type: "Contemporary Gin", brand: "Roku Gin" },

  // RUM
  { category: "Rum", type: "White Rum", brand: "Bacardi" },
  { category: "Rum", type: "White Rum", brand: "Havana Club" },
  { category: "Rum", type: "White Rum", brand: "Plantation 3 Stars" },
  { category: "Rum", type: "Gold Rum", brand: "Mount Gay" },
  { category: "Rum", type: "Gold Rum", brand: "Appleton Estate" },
  { category: "Rum", type: "Dark Rum", brand: "Goslings" },
  { category: "Rum", type: "Dark Rum", brand: "Myers's" },
  { category: "Rum", type: "Spiced Rum", brand: "Captain Morgan" },
  { category: "Rum", type: "Spiced Rum", brand: "Sailor Jerry" },
  { category: "Rum", type: "Aged Rum", brand: "Ron Zacapa" },
  { category: "Rum", type: "Aged Rum", brand: "Diplomático" },
  { category: "Rum", type: "Overproof Rum", brand: "Wray & Nephew" },
  { category: "Rum", type: "Overproof Rum", brand: "Plantation O.F.T.D." },
  { category: "Rum", type: "Agricole Rum", brand: "Rhum Clément" },
  { category: "Rum", type: "Agricole Rum", brand: "Rhum J.M" },
  { category: "Rum", type: "Cachaça", brand: "Leblon" },
  { category: "Rum", type: "Cachaça", brand: "Ypióca" },

  // TEQUILA
  { category: "Tequila", type: "Blanco", brand: "Patrón" },
  { category: "Tequila", type: "Blanco", brand: "Don Julio" },
  { category: "Tequila", type: "Blanco", brand: "Olmeca" },
  { category: "Tequila", type: "Reposado", brand: "Patrón" },
  { category: "Tequila", type: "Reposado", brand: "Espolòn" },
  { category: "Tequila", type: "Reposado", brand: "Herradura" },
  { category: "Tequila", type: "Añejo", brand: "Don Julio" },
  { category: "Tequila", type: "Añejo", brand: "Herradura" },
  { category: "Tequila", type: "Añejo", brand: "Patrón" },
  { category: "Tequila", type: "Extra Añejo", brand: "Gran Patrón" },
  { category: "Tequila", type: "Extra Añejo", brand: "Clase Azul" },
  { category: "Tequila", type: "Cristalino", brand: "Don Julio" },
  { category: "Tequila", type: "Cristalino", brand: "Maestro Dobel" },

  // VERMOUTH
  { category: "Vermouth", type: "Dry Vermouth", brand: "Noilly Prat" },
  { category: "Vermouth", type: "Dry Vermouth", brand: "Martini" },
  { category: "Vermouth", type: "Dry Vermouth", brand: "Dolin" },
  { category: "Vermouth", type: "Sweet Vermouth", brand: "Martini Rosso" },
  { category: "Vermouth", type: "Sweet Vermouth", brand: "Cinzano Rosso" },
  { category: "Vermouth", type: "Sweet Vermouth", brand: "Carpano Antica" },
  { category: "Vermouth", type: "Bianco Vermouth", brand: "Martini Bianco" },
  { category: "Vermouth", type: "Bianco Vermouth", brand: "Cinzano Bianco" },
  { category: "Vermouth", type: "Rosé Vermouth", brand: "Martini Rosato" },
  { category: "Vermouth", type: "Rosé Vermouth", brand: "Lillet Rosé" },
  { category: "Vermouth", type: "Extra Dry Vermouth", brand: "Martini Extra Dry" },
  { category: "Vermouth", type: "Extra Dry Vermouth", brand: "Noilly Prat Extra Dry" },

  // VODKA
  { category: "Vodka", type: "Classic Vodka", brand: "Absolut" },
  { category: "Vodka", type: "Classic Vodka", brand: "Smirnoff" },
  { category: "Vodka", type: "Classic Vodka", brand: "Stolichnaya" },
  { category: "Vodka", type: "Premium Vodka", brand: "Grey Goose" },
  { category: "Vodka", type: "Premium Vodka", brand: "Belvedere" },
  { category: "Vodka", type: "Premium Vodka", brand: "Cîroc" },
  { category: "Vodka", type: "Flavored Vodka", brand: "Absolut Citron" },
  { category: "Vodka", type: "Flavored Vodka", brand: "Smirnoff Raspberry" },
  { category: "Vodka", type: "Flavored Vodka", brand: "Stolichnaya Vanil" },
  { category: "Vodka", type: "Potato Vodka", brand: "Chopin" },
  { category: "Vodka", type: "Potato Vodka", brand: "Luksusowa" },
  { category: "Vodka", type: "Wheat Vodka", brand: "Ketel One" },
  { category: "Vodka", type: "Wheat Vodka", brand: "Grey Goose" },
  { category: "Vodka", type: "Rye Vodka", brand: "Belvedere" },
  { category: "Vodka", type: "Corn Vodka", brand: "Tito's" },

  // BRANDY
  { category: "Brandy", type: "Cognac", brand: "Hennessy" },
  { category: "Brandy", type: "Cognac", brand: "Rémy Martin" },
  { category: "Brandy", type: "Armagnac", brand: "Château de Laubade" },
  { category: "Brandy", type: "Pisco", brand: "Barsol" },
  { category: "Brandy", type: "Calvados", brand: "Père Magloire" },
  { category: "Brandy", type: "Spanish Brandy", brand: "Torres" },
  { category: "Brandy", type: "American Brandy", brand: "E&J" },

  // LIQUEUR
  { category: "Liqueur", type: "Orange Liqueur", brand: "Cointreau" },
  { category: "Liqueur", type: "Coffee Liqueur", brand: "Kahlúa" },
  { category: "Liqueur", type: "Herbal Liqueur", brand: "Chartreuse" },
  { category: "Liqueur", type: "Cream Liqueur", brand: "Baileys" },
  { category: "Liqueur", type: "Fruit Liqueur", brand: "Chambord" },

  // AMARO
  { category: "Amaro", type: "Amaro", brand: "Averna" },
  { category: "Amaro", type: "Aperitif Bitter", brand: "Campari" },
  { category: "Amaro", type: "Digestif Bitter", brand: "Fernet" },

  // APERITIF WINE
  { category: "Aperitif Wine", type: "Quinquina", brand: "Lillet" },
  { category: "Aperitif Wine", type: "Americano", brand: "Cocchi Americano" },

  // MEZCAL
  { category: "Mezcal", type: "Espadín", brand: "Del Maguey" },
  { category: "Mezcal", type: "Tobalá", brand: "Montelobos" },

  // SPARKLING WINE
  { category: "Sparkling Wine", type: "Champagne", brand: "Moët & Chandon" },
  { category: "Sparkling Wine", type: "Champagne", brand: "Veuve Clicquot" },
  { category: "Sparkling Wine", type: "Champagne", brand: "Dom Pérignon" },
  { category: "Sparkling Wine", type: "Prosecco", brand: "La Marca" },
  { category: "Sparkling Wine", type: "Prosecco", brand: "Mionetto" },
  { category: "Sparkling Wine", type: "Prosecco", brand: "Martini Prosecco" },
  { category: "Sparkling Wine", type: "Sekt", brand: "Rotkäppchen" },
  { category: "Sparkling Wine", type: "Sekt", brand: "Henkell" },
  { category: "Sparkling Wine", type: "Cava", brand: "Freixenet" },
  { category: "Sparkling Wine", type: "Cava", brand: "Codorníu" },
  { category: "Sparkling Wine", type: "Crémant", brand: "Lucien Albrecht" },

  // ABSINTHE
  { category: "Absinthe", type: "Verte", brand: "Pernod" },
  { category: "Absinthe", type: "Verte", brand: "La Fée" },
  { category: "Absinthe", type: "Blanche", brand: "Kübler" },
  { category: "Absinthe", type: "Blanche", brand: "La Clandestine" },
  { category: "Absinthe", type: "Bohemian", brand: "Hill's" },

  // JUICE
  { category: "Juice", type: "Orange Juice", brand: "Fresh Orange Juice" },
  { category: "Juice", type: "Lemon Juice", brand: "Fresh Lemon Juice" },
  { category: "Juice", type: "Lime Juice", brand: "Fresh Lime Juice" },
  { category: "Juice", type: "Pineapple Juice", brand: "Dole Pineapple Juice" },
  { category: "Juice", type: "Cranberry Juice", brand: "Ocean Spray" },
  { category: "Juice", type: "Grapefruit Juice", brand: "Fresh Grapefruit Juice" },
  { category: "Juice", type: "Pomegranate Juice", brand: "Pomegreynat" },

  // SOFT DRINK / SODA
  { category: "Soft Drink", type: "Cola", brand: "Coca-Cola" },
  { category: "Soft Drink", type: "Cola", brand: "Pepsi" },
  { category: "Soft Drink", type: "Ginger Beer", brand: "Fever-Tree" },
  { category: "Soft Drink", type: "Ginger Ale", brand: "Schweppes" },
  { category: "Soft Drink", type: "Tonic Water", brand: "Fever-Tree" },
  { category: "Soft Drink", type: "Club Soda", brand: "San Pellegrino" },
  { category: "Soft Drink", type: "Lemonade", brand: "Fever-Tree" },
  { category: "Soft Drink", type: "Orange Soda", brand: "Fanta" },

  // SYRUP
  { category: "Syrup", type: "Simple Syrup", brand: "Homemade Simple Syrup" },
  { category: "Syrup", type: "Gomme Syrup", brand: "Homemade Gomme Syrup" },
  { category: "Syrup", type: "Honey Syrup", brand: "Honey" },
  { category: "Syrup", type: "Almond Syrup", brand: "Orgeat" },
  { category: "Syrup", type: "Grenadine", brand: "Monin Grenadine" },

  // BITTERS
  { category: "Bitters", type: "Aromatic Bitters", brand: "Angostura" },
  { category: "Bitters", type: "Orange Bitters", brand: "Regan's Orange Bitters" },
  { category: "Bitters", type: "Walnut Bitters", brand: "Klindt Organic Bitters" },
  { category: "Bitters", type: "Chocolate Bitters", brand: "Angostura Cocoa Bitters" },

  // CREAM / DAIRY
  { category: "Cream", type: "Heavy Cream", brand: "Organic Heavy Cream" },
  { category: "Cream", type: "Coconut Cream", brand: "Aroy-D Coconut Cream" },
  { category: "Cream", type: "Irish Cream", brand: "Baileys" },
];

async function seedBottleHierarchy() {
  try {
    console.log("🍾 Starting bottle hierarchy seed...\n");

    // Clear existing bottles
    await prisma.bottle.deleteMany({});
    console.log("✨ Cleared existing bottles");

    // Track created bottles for hierarchy linking
    const createdBottles: Record<string, string> = {};

    // Create categories
    const categories = [...new Set(BOTTLE_HIERARCHY.map((b) => b.category))];

    for (const categoryName of categories) {
      const categoryBottle = await prisma.bottle.create({
        data: {
          name: categoryName,
          category: categoryName,
          type: null,
          productName: null,
          description: `${categoryName} category`,
          alcoholContent: 0,
        },
      });

      createdBottles[`category:${categoryName}`] = categoryBottle.id;
      console.log(`✅ Created category: ${categoryName}`);

      // Get all types for this category
      const types = [
        ...new Set(
          BOTTLE_HIERARCHY.filter((b) => b.category === categoryName).map(
            (b) => b.type
          )
        ),
      ];

      for (const typeName of types) {
        const typeBottle = await prisma.bottle.create({
          data: {
            name: `${categoryName}: ${typeName}`,
            category: categoryName,
            type: typeName,
            productName: null,
            parentId: categoryBottle.id,
            description: `${typeName} ${categoryName}`,
            alcoholContent: 0,
          },
        });

        createdBottles[`type:${categoryName}:${typeName}`] = typeBottle.id;
        console.log(`  └─ Created type: ${typeName}`);

        // Get all brands for this type
        const brands = [
          ...new Set(
            BOTTLE_HIERARCHY.filter(
              (b) => b.category === categoryName && b.type === typeName
            ).map((b) => b.brand)
          ),
        ];

        for (const brandName of brands) {
          // Determine alcohol content based on category
          let alcoholContent = 0;
          if (
            ![
              "Juice",
              "Soft Drink",
              "Syrup",
              "Bitters",
              "Cream",
            ].includes(categoryName)
          ) {
            alcoholContent = 40; // Default spirit ABV
          }

          const brandBottle = await prisma.bottle.create({
            data: {
              name: `${categoryName}: ${typeName}: ${brandName}`,
              category: categoryName,
              type: typeName,
              productName: brandName,
              parentId: typeBottle.id,
              description: `${brandName} - ${typeName} ${categoryName}`,
              alcoholContent:
                categoryName === "Sparkling Wine"
                  ? 12
                  : categoryName === "Juice" ||
                      categoryName === "Soft Drink" ||
                      categoryName === "Syrup" ||
                      categoryName === "Bitters" ||
                      categoryName === "Cream"
                    ? 0
                    : alcoholContent,
            },
          });

          createdBottles[
            `brand:${categoryName}:${typeName}:${brandName}`
          ] = brandBottle.id;
          console.log(`    └─ Created brand: ${brandName}`);
        }
      }

      console.log("");
    }

    console.log("\n✨ Bottle hierarchy seed completed successfully!");
    console.log(
      `📊 Total bottles created: ${Object.keys(createdBottles).length}`
    );
  } catch (error) {
    console.error("❌ Error seeding bottles:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedBottleHierarchy();
