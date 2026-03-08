import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

interface BottleData {
  category: string
  type: string
  products: string[]
}

const SPIRITS_DATA: BottleData[] = [
  // WHISKEY
  {
    category: "Whiskey",
    type: "Bourbon",
    products: ["Maker's Mark", "Buffalo Trace", "Woodford Reserve", "Jim Beam", "Evan Williams", "Wild Turkey", "Bulleit Bourbon"]
  },
  {
    category: "Whiskey",
    type: "Tennessee Whiskey",
    products: ["Jack Daniel's", "George Dickel", "Chattanooga Whiskey"]
  },
  {
    category: "Whiskey",
    type: "Scotch Single Malt",
    products: ["Glenfiddich", "Macallan", "Glenmorangie", "Oban", "Talisker", "Highland Park", "Bowmore", "Islay Mist"]
  },
  {
    category: "Whiskey",
    type: "Scotch Blended",
    products: ["Johnnie Walker", "Chivas Regal", "Ballantine's", "Dewar's", "J&B Rare"]
  },
  {
    category: "Whiskey",
    type: "Irish Whiskey",
    products: ["Jameson", "Redbreast", "Bushmills", "Tullamore Dew", "Powers"]
  },
  {
    category: "Whiskey",
    type: "Rye Whiskey",
    products: ["Bulleit Rye", "Sazerac Rye", "Rittenhouse Rye", "Michter's Rye", "Old Overholt"]
  },
  {
    category: "Whiskey",
    type: "Canadian Whisky",
    products: ["Crown Royal", "Canadian Club", "Seagram's VO", "Canadian Mist"]
  },
  {
    category: "Whiskey",
    type: "Japanese Whisky",
    products: ["Yamazaki", "Hibiki", "Hakushu", "Suntory Whisky"]
  },

  // GIN
  {
    category: "Gin",
    type: "London Dry Gin",
    products: ["Beefeater", "Tanqueray", "Bombay Sapphire", "Gordon's", "Seagram's", "Gilbey's"]
  },
  {
    category: "Gin",
    type: "Plymouth Gin",
    products: ["Plymouth Gin", "Plymouth Navy Strength Gin", "Plymouth Sloe Gin"]
  },
  {
    category: "Gin",
    type: "Old Tom Gin",
    products: ["Hayman's Old Tom", "Ransom Old Tom"]
  },
  {
    category: "Gin",
    type: "Dry Gin",
    products: ["Gordon's", "Tanqueray", "Bombay Sapphire"]
  },
  {
    category: "Gin",
    type: "New Western Gin",
    products: ["Hendrick's", "Aviation Gin", "St. George Botanivore", "Citadelle"]
  },
  {
    category: "Gin",
    type: "Sloe Gin",
    products: ["Plymouth Sloe Gin", "Hayman's Sloe Gin"]
  },
  {
    category: "Gin",
    type: "Genever",
    products: ["Bols Genever", "Filliers Genever", "Ketel One", "De Kuyper"]
  },
  {
    category: "Gin",
    type: "Navy Strength Gin",
    products: ["Plymouth Navy Strength", "Hayman's Navy Strength"]
  },
  {
    category: "Gin",
    type: "Barrel Aged Gin",
    products: ["Citadelle Réserve", "Old Forester Gin"]
  },
  {
    category: "Gin",
    type: "Contemporary Gin",
    products: ["Roku Gin", "Mazu Gin", "Citadelle Gin"]
  },

  // RUM
  {
    category: "Rum",
    type: "White Rum",
    products: ["Bacardi", "Havana Club", "Plantation 3 Stars", "Cruzan White", "Light Rum"]
  },
  {
    category: "Rum",
    type: "Gold Rum",
    products: ["Mount Gay", "Appleton Estate", "Rum Nation", "Pampero"]
  },
  {
    category: "Rum",
    type: "Dark Rum",
    products: ["Goslings", "Myers's", "Matusalem", "Neisson Dark Rum"]
  },
  {
    category: "Rum",
    type: "Spiced Rum",
    products: ["Captain Morgan", "Sailor Jerry", "Bacardi Spiced", "Kraken Dark Spiced"]
  },
  {
    category: "Rum",
    type: "Aged Rum",
    products: ["Ron Zacapa", "Diplomático", "Havana Club Reserva", "Pyrat Cask Matured"]
  },
  {
    category: "Rum",
    type: "Overproof Rum",
    products: ["Wray & Nephew", "Plantation O.F.T.D.", "Rum Fire"]
  },
  {
    category: "Rum",
    type: "Agricole Rum",
    products: ["Rhum Clément", "Rhum J.M", "Neisson Rum"]
  },
  {
    category: "Rum",
    type: "Cachaça",
    products: ["Leblon", "Ypióca", "Pitu", "Cachaca 51"]
  },

  // TEQUILA
  {
    category: "Tequila",
    type: "Blanco",
    products: ["Patrón Silver", "Don Julio Blanco", "Olmeca", "El Tesoro", "Espolòn"]
  },
  {
    category: "Tequila",
    type: "Reposado",
    products: ["Patrón Reposado", "Espolòn Reposado", "Herradura Reposado", "Don Julio Reposado"]
  },
  {
    category: "Tequila",
    type: "Añejo",
    products: ["Don Julio Añejo", "Herradura Añejo", "Patrón Añejo", "Sauza Tres Generaciones"]
  },
  {
    category: "Tequila",
    type: "Extra Añejo",
    products: ["Gran Patrón", "Clase Azul"]
  },
  {
    category: "Tequila",
    type: "Cristalino",
    products: ["Don Julio Cristalino", "Maestro Dobel"]
  },

  // VERMOUTH
  {
    category: "Vermouth",
    type: "Dry Vermouth",
    products: ["Noilly Prat", "Martini Dry", "Dolin", "Boissiere"]
  },
  {
    category: "Vermouth",
    type: "Sweet Vermouth",
    products: ["Martini Rosso", "Cinzano Rosso", "Carpano Antica", "Noilly Prat Rouge"]
  },
  {
    category: "Vermouth",
    type: "Bianco Vermouth",
    products: ["Martini Bianco", "Cinzano Bianco", "Carpano"]
  },
  {
    category: "Vermouth",
    type: "Rosé Vermouth",
    products: ["Martini Rosato", "Lillet Rosé"]
  },
  {
    category: "Vermouth",
    type: "Extra Dry Vermouth",
    products: ["Martini Extra Dry", "Noilly Prat Extra Dry"]
  },

  // VODKA
  {
    category: "Vodka",
    type: "Classic Vodka",
    products: ["Absolut", "Smirnoff", "Stolichnaya", "Finlandia", "Gordon's Vodka"]
  },
  {
    category: "Vodka",
    type: "Premium Vodka",
    products: ["Grey Goose", "Belvedere", "Cîroc", "Ketel One", "Tito's"]
  },
  {
    category: "Vodka",
    type: "Flavored Vodka",
    products: ["Absolut Citron", "Smirnoff Raspberry", "Stolichnaya Vanil", "Absolut Lime"]
  },
  {
    category: "Vodka",
    type: "Potato Vodka",
    products: ["Chopin", "Luksusowa", "Crystal Head"]
  },
  {
    category: "Vodka",
    type: "Wheat Vodka",
    products: ["Ketel One", "Grey Goose"]
  },
  {
    category: "Vodka",
    type: "Rye Vodka",
    products: ["Belvedere"]
  },
  {
    category: "Vodka",
    type: "Corn Vodka",
    products: ["Tito's"]
  },

  // BRANDY
  {
    category: "Brandy",
    type: "Cognac",
    products: ["Hennessy", "Rémy Martin", "Courvoisier", "Martell", "Hine"]
  },
  {
    category: "Brandy",
    type: "Armagnac",
    products: ["Château de Laubade", "Delord", "Samalens"]
  },
  {
    category: "Brandy",
    type: "Pisco",
    products: ["Barsol", "Macchu Pisco", "Pisco Portón"]
  },
  {
    category: "Brandy",
    type: "Calvados",
    products: ["Père Magloire", "Boulard", "Busnel"]
  },
  {
    category: "Brandy",
    type: "Spanish Brandy",
    products: ["Torres", "Fundador", "Carlos I"]
  },
  {
    category: "Brandy",
    type: "American Brandy",
    products: ["E&J", "Christian Brothers", "Paul Masson"]
  },

  // LIQUEUR
  {
    category: "Liqueur",
    type: "Orange Liqueur",
    products: ["Cointreau", "Triple Sec", "Curaçao Orange", "Grand Marnier", "Pierre Ferrand"]
  },
  {
    category: "Liqueur",
    type: "Coffee Liqueur",
    products: ["Kahlúa", "Tia Maria", "Espresso Liqueur"]
  },
  {
    category: "Liqueur",
    type: "Herbal Liqueur",
    products: ["Chartreuse Verte", "Chartreuse Jaune", "Bénédictine", "Jägermeister"]
  },
  {
    category: "Liqueur",
    type: "Cream Liqueur",
    products: ["Baileys Irish Cream", "Amaretto", "Frangelico", "Cream Liqueur"]
  },
  {
    category: "Liqueur",
    type: "Fruit Liqueur",
    products: ["Framboise", "Crème de Cassis", "Maraschino Liqueur", "Raspberry Liqueur"]
  },
  {
    category: "Liqueur",
    type: "Almond Liqueur",
    products: ["Amaretto di Saronno", "Amaretto", "Disaronno"]
  },
  {
    category: "Liqueur",
    type: "Anise Liqueur",
    products: ["Pastis", "Ouzo", "Sambuca", "Ouzo 12"]
  },

  // AMARO
  {
    category: "Amaro",
    type: "Amaro",
    products: ["Averna", "Amaro Montenegro", "Amaro Lucano"]
  },
  {
    category: "Amaro",
    type: "Aperitif Bitter",
    products: ["Campari", "Aperol", "Luxardo Bitter"]
  },
  {
    category: "Amaro",
    type: "Digestif Bitter",
    products: ["Fernet-Branca", "Underberg", "Ramazzotti"]
  },

  // APERITIF WINE
  {
    category: "Aperitif Wine",
    type: "Quinquina",
    products: ["Lillet Blanc", "Lillet Rouge", "Lillet Rosé"]
  },
  {
    category: "Aperitif Wine",
    type: "Americano",
    products: ["Cocchi Americano"]
  },
  {
    category: "Aperitif Wine",
    type: "Aperitif Wine",
    products: ["Dubonnet Rouge", "Dubonnet White"]
  },

  // MEZCAL
  {
    category: "Mezcal",
    type: "Espadín",
    products: ["Del Maguey", "Mezcal Vago", "Alipus Oaxaca"]
  },
  {
    category: "Mezcal",
    type: "Tobalá",
    products: ["Montelobos", "Del Maguey Tobala"]
  },
  {
    category: "Mezcal",
    type: "Ensamble",
    products: ["El Jolgorio", "Cobá"]
  },

  // SPARKLING WINE
  {
    category: "Sparkling Wine",
    type: "Champagne",
    products: ["Moët & Chandon", "Veuve Clicquot", "Dom Pérignon", "Taittinger", "Pol Roger"]
  },
  {
    category: "Sparkling Wine",
    type: "Prosecco",
    products: ["La Marca", "Mionetto", "Martini Prosecco", "Col Vetoraz"]
  },
  {
    category: "Sparkling Wine",
    type: "Sekt",
    products: ["Rotkäppchen", "Henkell", "Faber"]
  },
  {
    category: "Sparkling Wine",
    type: "Cava",
    products: ["Freixenet", "Codorníu", "Mont Marçal"]
  },
  {
    category: "Sparkling Wine",
    type: "Crémant",
    products: ["Lucien Albrecht", "Jura Crémant"]
  },

  // ABSINTHE
  {
    category: "Absinthe",
    type: "Verte",
    products: ["Pernod", "La Fée Verte", "Absinthe du Val"]
  },
  {
    category: "Absinthe",
    type: "Blanche",
    products: ["Kübler", "La Clandestine", "Pernod Anis"]
  },
  {
    category: "Absinthe",
    type: "Bohemian",
    products: ["Hill's Absinthe"]
  }
]

const NON_ALCOHOLIC_DATA: BottleData[] = [
  // JUICE
  {
    category: "Juice",
    type: "Orange Juice",
    products: ["Fresh Orange Juice", "Tropicana", "Minute Maid", "Simply Orange"]
  },
  {
    category: "Juice",
    type: "Lemon Juice",
    products: ["Fresh Lemon Juice", "Lemon Juice Concentrate", "ReaLemon"]
  },
  {
    category: "Juice",
    type: "Lime Juice",
    products: ["Fresh Lime Juice", "Lime Juice Concentrate", "RealLime"]
  },
  {
    category: "Juice",
    type: "Pineapple Juice",
    products: ["Dole Pineapple Juice", "Tropicana Pineapple", "Pure Pineapple"]
  },
  {
    category: "Juice",
    type: "Cranberry Juice",
    products: ["Ocean Spray", "Tropicana Cranberry", "Pure Cranberry"]
  },
  {
    category: "Juice",
    type: "Apple Juice",
    products: ["Fresh Apple Juice", "Martinelli's", "Apple Juice Concentrate"]
  },
  {
    category: "Juice",
    type: "Tomato Juice",
    products: ["Clamato", "Tomato Juice", "V8"]
  },
  {
    category: "Juice",
    type: "Grapefruit Juice",
    products: ["Fresh Grapefruit Juice", "Tropicana Grapefruit"]
  },
  {
    category: "Juice",
    type: "Pineapple Juice",
    products: ["Dole", "Tropicana", "Pure Juice"]
  },
  {
    category: "Juice",
    type: "Coconut Juice",
    products: ["Thai Coconut Juice", "Natural Coconut Water"]
  },

  // SOFT DRINK / SODA
  {
    category: "Soft Drink",
    type: "Cola",
    products: ["Coca-Cola", "Pepsi", "Coke Zero", "Diet Coke"]
  },
  {
    category: "Soft Drink",
    type: "Ginger Beer",
    products: ["Fever-Tree", "Bundaberg", "Q Ginger Beer", "Cock & Bull"]
  },
  {
    category: "Soft Drink",
    type: "Ginger Ale",
    products: ["Schweppes", "Canada Dry", "Fever-Tree Ginger Ale"]
  },
  {
    category: "Soft Drink",
    type: "Tonic Water",
    products: ["Fever-Tree", "Schweppes Tonic", "Q Tonic", "Canada Dry"]
  },
  {
    category: "Soft Drink",
    type: "Lemon-Lime Soda",
    products: ["Sprite", "7UP", "San Pellegrino Limonata"]
  },
  {
    category: "Soft Drink",
    type: "Orange Soda",
    products: ["Fanta Orange", "Orange Crush"]
  },
  {
    category: "Soft Drink",
    type: "Ginger Ale",
    products: ["Canada Dry", "Schweppes"]
  },
  {
    category: "Soft Drink",
    type: "Soda Water",
    products: ["Perrier", "San Pellegrino", "Club Soda", "Fever-Tree Soda Water"]
  },

  // SYRUP
  {
    category: "Syrup",
    type: "Simple Syrup",
    products: ["Monin Simple Syrup", "Rich Simple Syrup", "Homemade Simple Syrup"]
  },
  {
    category: "Syrup",
    type: "Grenadine",
    products: ["Monin Grenadine", "Rose's Grenadine", "Pomegranate Syrup"]
  },
  {
    category: "Syrup",
    type: "Orgeat Syrup",
    products: ["Monin Orgeat", "Torani Orgeat", "Almond Syrup"]
  },
  {
    category: "Syrup",
    type: "Falernum",
    products: ["John D. Taylor's Falernum", "Homemade Falernum"]
  },
  {
    category: "Syrup",
    type: "Honey Syrup",
    products: ["Honey Syrup", "Raw Honey", "Acacia Honey"]
  },
  {
    category: "Syrup",
    type: "Agave Syrup",
    products: ["Agave Nectar", "Agave Syrup", "Pure Agave"]
  },
  {
    category: "Syrup",
    type: "Coconut Syrup",
    products: ["Monin Coconut", "Coconut Sugar Syrup"]
  },
  {
    category: "Syrup",
    type: "Vanilla Syrup",
    products: ["Monin Vanilla", "Vanilla Extract Syrup"]
  },

  // BITTERS
  {
    category: "Bitters",
    type: "Aromatic Bitters",
    products: ["Angostura Aromatic Bitters", "Peychaud's Bitters", "Regan's Orange Bitters"]
  },
  {
    category: "Bitters",
    type: "Orange Bitters",
    products: ["Regan's Orange Bitters", "Fee Brothers Orange", "Angostura Orange"]
  },
  {
    category: "Bitters",
    type: "Chocolate Bitters",
    products: ["Angostura Chocolate", "Bittermens Xocolatl"]
  },
  {
    category: "Bitters",
    type: "Walnut Bitters",
    products: ["Fee Brothers Walnut", "Bittermens Walnut"]
  },
  {
    category: "Bitters",
    type: "Celery Bitters",
    products: ["Fee Brothers Celery"]
  }
]

async function seedBottles() {
  console.log("🌱 Starting bottle seeding...")

  try {
    // Clear existing bottles
    await prisma.bottle.deleteMany({})
    console.log("🗑️  Cleared existing bottles")

    let createdCount = 0
    const allData = [...SPIRITS_DATA, ...NON_ALCOHOLIC_DATA]
    
    // Track created categories and types to avoid duplicates
    const categoryMap = new Map<string, string>()
    const typeMap = new Map<string, string>()

    // First pass: Create all unique categories
    const uniqueCategories = new Set(allData.map(item => item.category))
    for (const category of uniqueCategories) {
      const categoryBottle = await prisma.bottle.upsert({
        where: { name: category },
        create: {
          name: category,
          category: category,
          type: null,
          productName: null,
          description: `${category} category`
        },
        update: {}
      })
      categoryMap.set(category, categoryBottle.id)
      createdCount++
      console.log(`✓ Created category: ${category}`)
    }

    // Second pass: Create types and products
    for (const item of allData) {
      const categoryId = categoryMap.get(item.category)!
      
      // Create type bottle with category as parent
      const typeBottle = await prisma.bottle.upsert({
        where: { name: item.type },
        create: {
          name: item.type,
          category: item.category,
          type: item.type,
          productName: null,
          description: `${item.type} type within ${item.category}`,
          parentId: categoryId
        },
        update: {
          parentId: categoryId
        }
      })
      typeMap.set(`${item.category}|${item.type}`, typeBottle.id)
      createdCount++
      console.log(`  ├─ Created type: ${item.type}`)

      // Create product bottles with type as parent
      for (const product of item.products) {
        await prisma.bottle.upsert({
          where: { name: product },
          create: {
            name: product,
            category: item.category,
            type: item.type,
            productName: product,
            description: `${product} - ${item.type}`,
            parentId: typeBottle.id
          },
          update: {
            parentId: typeBottle.id
          }
        })
        createdCount++
      }
      console.log(`  │  └─ Created ${item.products.length} products`)
    }

    console.log(`\n✅ Successfully seeded ${createdCount} bottles!`)
  } catch (error) {
    console.error("❌ Error seeding bottles:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedBottles()
