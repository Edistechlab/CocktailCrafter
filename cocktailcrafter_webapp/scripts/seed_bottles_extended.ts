import { prisma } from "@/lib/prisma"

/**
 * Comprehensive bottle database seed script
 * Creates all categories, types, and brands with proper hierarchy
 */

const bottleData = [
  // ==================== WHISKEY ====================
  {
    category: "Whiskey",
    type: "Bourbon",
    products: [
      { name: "Maker's Mark", description: "Kentucky Bourbon Whiskey", alcoholContent: 45.0, tasteProfile: "Smooth, wheated bourbon", aroma: "Vanilla, caramel, oak" },
      { name: "Buffalo Trace", description: "Kentucky Straight Bourbon", alcoholContent: 45.0, tasteProfile: "Vanilla, oak, honey", aroma: "Caramel, vanilla, tobacco" },
      { name: "Woodford Reserve", description: "Distilled Bourbon Whiskey", alcoholContent: 43.2, tasteProfile: "Complex, spicy oak", aroma: "Fruit, vanilla, spice" }
    ]
  },
  {
    category: "Whiskey",
    type: "Tennessee Whiskey",
    products: [
      { name: "Jack Daniel's", description: "Tennessee Whiskey", alcoholContent: 40.0, tasteProfile: "Smooth, charcoal-filtered", aroma: "Vanilla, caramel, oak" },
      { name: "George Dickel", description: "Tennessee Whisky", alcoholContent: 40.0, tasteProfile: "Smooth, mellow", aroma: "Caramel, vanilla" }
    ]
  },
  {
    category: "Whiskey",
    type: "Scotch Single Malt",
    products: [
      { name: "Glenfiddich", description: "Single Malt Scotch Whisky", alcoholContent: 40.0, tasteProfile: "Floral, fruity", aroma: "Pear, apple, honey" },
      { name: "Macallan", description: "Single Malt Scotch Whisky", alcoholContent: 43.0, tasteProfile: "Rich, spicy oak", aroma: "Vanilla, dried fruit, spice" }
    ]
  },
  {
    category: "Whiskey",
    type: "Scotch Blended",
    products: [
      { name: "Johnnie Walker", description: "Blended Scotch Whisky", alcoholContent: 40.0, tasteProfile: "Balanced, smooth", aroma: "Smoke, honey, vanilla" },
      { name: "Chivas Regal", description: "Blended Scotch Whisky", alcoholContent: 40.0, tasteProfile: "Smooth, honeyed", aroma: "Honey, vanilla, fruit" }
    ]
  },
  {
    category: "Whiskey",
    type: "Irish Whiskey",
    products: [
      { name: "Jameson", description: "Irish Whiskey", alcoholContent: 40.0, tasteProfile: "Smooth, slightly sweet", aroma: "Vanilla, spice, fruit" },
      { name: "Redbreast", description: "Single Pot Still Irish Whiskey", alcoholContent: 46.0, tasteProfile: "Rich, spicy, fruity", aroma: "Fruit, spice, heather" }
    ]
  },
  {
    category: "Whiskey",
    type: "Rye Whiskey",
    products: [
      { name: "Bulleit Rye", description: "Kentucky Straight Rye Whiskey", alcoholContent: 45.0, tasteProfile: "Spicy, peppery", aroma: "Rye grain, spice, vanilla" },
      { name: "Sazerac Rye", description: "Straight Rye Whiskey", alcoholContent: 45.0, tasteProfile: "Spicy, complex", aroma: "Rye, spice, oak" }
    ]
  },
  {
    category: "Whiskey",
    type: "Canadian Whisky",
    products: [
      { name: "Crown Royal", description: "Canadian Blended Whisky", alcoholContent: 40.0, tasteProfile: "Smooth, balanced", aroma: "Vanilla, oak, fruit" },
      { name: "Canadian Club", description: "Canadian Blended Whisky", alcoholContent: 40.0, tasteProfile: "Light, smooth", aroma: "Vanilla, grain" }
    ]
  },
  {
    category: "Whiskey",
    type: "Japanese Whisky",
    products: [
      { name: "Yamazaki", description: "Single Malt Japanese Whisky", alcoholContent: 43.0, tasteProfile: "Delicate, fruity", aroma: "Apple, vanilla, oak" },
      { name: "Hibiki", description: "Blended Japanese Whisky", alcoholContent: 43.0, tasteProfile: "Smooth, harmonic", aroma: "Honey, vanilla, spice" }
    ]
  },

  // ==================== GIN ====================
  {
    category: "Gin",
    type: "London Dry Gin",
    products: [
      { name: "Beefeater", description: "London Dry Gin", alcoholContent: 40.0, tasteProfile: "Juniper-forward, dry", aroma: "Juniper, citrus, spice" },
      { name: "Tanqueray", description: "London Dry Gin", alcoholContent: 47.3, tasteProfile: "Dry, piney", aroma: "Juniper, citrus, crispness" },
      { name: "Bombay Sapphire", description: "London Dry Gin", alcoholContent: 40.0, tasteProfile: "Delicate, botanical", aroma: "Citrus, spice, juniper" }
    ]
  },
  {
    category: "Gin",
    type: "Plymouth Gin",
    products: [
      { name: "Plymouth Gin", description: "Plymouth Gin", alcoholContent: 41.2, tasteProfile: "Smooth, citrus-forward", aroma: "Juniper, citrus, spice" }
    ]
  },
  {
    category: "Gin",
    type: "Old Tom Gin",
    products: [
      { name: "Hayman's Old Tom", description: "Old Tom Gin", alcoholContent: 40.0, tasteProfile: "Slightly sweet, fruity", aroma: "Juniper, citrus, fruit" }
    ]
  },
  {
    category: "Gin",
    type: "Dry Gin",
    products: [
      { name: "Gordon's", description: "London Dry Gin", alcoholContent: 40.0, tasteProfile: "Classic dry", aroma: "Juniper, lemon, coriander" }
    ]
  },
  {
    category: "Gin",
    type: "New Western Gin",
    products: [
      { name: "Hendrick's", description: "Contemporary Gin", alcoholContent: 44.0, tasteProfile: "Crisp, cucumber forward", aroma: "Cucumber, juniper, citrus" },
      { name: "Aviation", description: "American Gin", alcoholContent: 42.0, tasteProfile: "Smooth, floral", aroma: "Lavender, anise, juniper" }
    ]
  },
  {
    category: "Gin",
    type: "Sloe Gin",
    products: [
      { name: "Plymouth Sloe Gin", description: "Sloe Gin", alcoholContent: 26.0, tasteProfile: "Sweet, fruity", aroma: "Sloe berry, juniper" }
    ]
  },
  {
    category: "Gin",
    type: "Genever",
    products: [
      { name: "Bols Genever", description: "Dutch Genever", alcoholContent: 35.0, tasteProfile: "Herbal, grain-forward", aroma: "Juniper, herbs, grain" },
      { name: "Filliers Genever", description: "Belgian Genever", alcoholContent: 37.5, tasteProfile: "Complex, herbal", aroma: "Juniper, herbs, citrus" }
    ]
  },
  {
    category: "Gin",
    type: "Navy Strength Gin",
    products: [
      { name: "Plymouth Navy Strength", description: "Navy Strength Gin", alcoholContent: 57.0, tasteProfile: "Bold, juniper-forward", aroma: "Juniper, citrus, spice" },
      { name: "Hayman's Navy Strength", description: "Navy Strength Gin", alcoholContent: 57.0, tasteProfile: "Intense, dry", aroma: "Juniper, lime, spice" }
    ]
  },
  {
    category: "Gin",
    type: "Barrel Aged Gin",
    products: [
      { name: "Citadelle Réserve", description: "Barrel Aged Gin", alcoholContent: 44.0, tasteProfile: "Smooth, oak influences", aroma: "Vanilla, juniper, oak" }
    ]
  },
  {
    category: "Gin",
    type: "Contemporary Gin",
    products: [
      { name: "Roku Gin", description: "Japanese Gin", alcoholContent: 43.0, tasteProfile: "Delicate, floral", aroma: "Cherry, yuzu, juniper" }
    ]
  },

  // ==================== RUM ====================
  {
    category: "Rum",
    type: "White Rum",
    products: [
      { name: "Bacardi", description: "Light Rum", alcoholContent: 37.5, tasteProfile: "Clean, neutral", aroma: "Subtle vanilla, citrus" },
      { name: "Havana Club", description: "Light Rum", alcoholContent: 40.0, tasteProfile: "Clean, sweet", aroma: "Vanilla, caramel" },
      { name: "Plantation 3 Stars", description: "White Rum Blend", alcoholContent: 41.0, tasteProfile: "Smooth, balanced", aroma: "Tropical fruit, vanilla" }
    ]
  },
  {
    category: "Rum",
    type: "Gold Rum",
    products: [
      { name: "Mount Gay", description: "Barbados Gold Rum", alcoholContent: 40.0, tasteProfile: "Smooth, fruity", aroma: "Tropical fruit, vanilla, oak" },
      { name: "Appleton Estate", description: "Jamaican Gold Rum", alcoholContent: 40.0, tasteProfile: "Rich, spicy", aroma: "Molasses, spice, fruit" }
    ]
  },
  {
    category: "Rum",
    type: "Dark Rum",
    products: [
      { name: "Goslings", description: "Dark Rum", alcoholContent: 40.0, tasteProfile: "Rich, molasses", aroma: "Molasses, spice, caramel" },
      { name: "Myers's", description: "Dark Rum", alcoholContent: 40.0, tasteProfile: "Bold, spicy", aroma: "Molasses, spice, fruit" }
    ]
  },
  {
    category: "Rum",
    type: "Spiced Rum",
    products: [
      { name: "Captain Morgan", description: "Spiced Rum", alcoholContent: 35.0, tasteProfile: "Sweet, spiced", aroma: "Vanilla, cinnamon, clove" },
      { name: "Sailor Jerry", description: "Spiced Rum", alcoholContent: 46.0, tasteProfile: "Bold, spiced", aroma: "Vanilla, nutmeg, clove" }
    ]
  },
  {
    category: "Rum",
    type: "Aged Rum",
    products: [
      { name: "Ron Zacapa", description: "Aged Rum", alcoholContent: 40.0, tasteProfile: "Complex, woody", aroma: "Vanilla, oak, spice" },
      { name: "Diplomático", description: "Aged Rum", alcoholContent: 40.0, tasteProfile: "Rich, complex", aroma: "Vanilla, fruit, spice" }
    ]
  },
  {
    category: "Rum",
    type: "Overproof Rum",
    products: [
      { name: "Wray & Nephew", description: "Jamaican Overproof", alcoholContent: 63.0, tasteProfile: "Intense, fruity", aroma: "Fruity, spicy, intense" },
      { name: "Plantation O.F.T.D.", description: "Overproof Rum", alcoholContent: 69.0, tasteProfile: "Bold, complex", aroma: "Spice, fruit, oak" }
    ]
  },
  {
    category: "Rum",
    type: "Agricole Rum",
    products: [
      { name: "Rhum Clément", description: "Agricole Rum", alcoholContent: 40.0, tasteProfile: "Grassy, fruity", aroma: "Grass, fruit, spice" },
      { name: "Rhym J.M", description: "Agricole Rum", alcoholContent: 40.0, tasteProfile: "Herbaceous, complex", aroma: "Grass, herb, fruit" }
    ]
  },
  {
    category: "Rum",
    type: "Cachaça",
    products: [
      { name: "Leblon", description: "Premium Cachaça", alcoholContent: 40.0, tasteProfile: "Smooth, fruity", aroma: "Tropical fruit, sugarcane" },
      { name: "Ypióca", description: "Cachaça", alcoholContent: 40.0, tasteProfile: "Smooth, herbal", aroma: "Sugarcane, herb, citrus" }
    ]
  },

  // ==================== TEQUILA ====================
  {
    category: "Tequila",
    type: "Blanco",
    products: [
      { name: "Patrón", description: "Tequila Blanco", alcoholContent: 40.0, tasteProfile: "Crisp, agave-forward", aroma: "Agave, citrus, pepper" },
      { name: "Don Julio", description: "Tequila Blanco", alcoholContent: 40.0, tasteProfile: "Clean, balanced", aroma: "Agave, citrus, vanilla" },
      { name: "Olmeca", description: "Tequila Blanco", alcoholContent: 38.0, tasteProfile: "Light, fresh", aroma: "Agave, citrus" }
    ]
  },
  {
    category: "Tequila",
    type: "Reposado",
    products: [
      { name: "Patrón Reposado", description: "Tequila Reposado", alcoholContent: 40.0, tasteProfile: "Smooth, oak-influenced", aroma: "Agave, vanilla, oak" },
      { name: "Espolòn", description: "Tequila Reposado", alcoholContent: 40.0, tasteProfile: "Balanced, fruity", aroma: "Agave, fruit, vanilla" },
      { name: "Herradura", description: "Tequila Reposado", alcoholContent: 40.0, tasteProfile: "Rich, complex", aroma: "Agave, vanilla, spice" }
    ]
  },
  {
    category: "Tequila",
    type: "Añejo",
    products: [
      { name: "Don Julio Añejo", description: "Tequila Añejo", alcoholContent: 40.0, tasteProfile: "Smooth, woody", aroma: "Vanilla, oak, caramel" },
      { name: "Herradura Añejo", description: "Tequila Añejo", alcoholContent: 40.0, tasteProfile: "Rich, complex", aroma: "Vanilla, spice, oak" },
      { name: "Patrón Añejo", description: "Tequila Añejo", alcoholContent: 40.0, tasteProfile: "Smooth, aged", aroma: "Vanilla, oak, agave" }
    ]
  },
  {
    category: "Tequila",
    type: "Extra Añejo",
    products: [
      { name: "Gran Patrón", description: "Extra Aged Tequila", alcoholContent: 40.0, tasteProfile: "Complex, smooth", aroma: "Vanilla, oak, spice" },
      { name: "Clase Azul", description: "Extra Aged Tequila", alcoholContent: 40.0, tasteProfile: "Luxurious, smooth", aroma: "Vanilla, caramel, oak" }
    ]
  },
  {
    category: "Tequila",
    type: "Cristalino",
    products: [
      { name: "Don Julio Cristalino", description: "Ultra Smooth Tequila", alcoholContent: 40.0, tasteProfile: "Crystal clear, smooth", aroma: "Agave, vanilla, fruit" },
      { name: "Maestro Dobel", description: "Cristalino Tequila", alcoholContent: 40.0, tasteProfile: "Refined, smooth", aroma: "Agave, vanilla, oak" }
    ]
  },

  // ==================== GIN (continuing) ====================
  {
    category: "Vermouth",
    type: "Dry Vermouth",
    products: [
      { name: "Noilly Prat", description: "French Dry Vermouth", alcoholContent: 18.0, tasteProfile: "Herbal, dry", aroma: "Herbs, citrus, spice" },
      { name: "Martini Dry", description: "Dry Vermouth", alcoholContent: 18.0, tasteProfile: "Dry, herbal", aroma: "Herbs, citrus" },
      { name: "Dolin", description: "French Dry Vermouth", alcoholContent: 17.5, tasteProfile: "Light, herbal", aroma: "Herbs, vanilla, citrus" }
    ]
  },
  {
    category: "Vermouth",
    type: "Sweet Vermouth",
    products: [
      { name: "Martini Rosso", description: "Sweet Vermouth", alcoholContent: 16.0, tasteProfile: "Sweet, herbal", aroma: "Vanilla, caramel, herbs" },
      { name: "Cinzano Rosso", description: "Sweet Vermouth", alcoholContent: 16.0, tasteProfile: "Sweet, aromatic", aroma: "Herbs, spice, vanilla" },
      { name: "Carpano Antica", description: "Sweet Vermouth", alcoholContent: 16.5, tasteProfile: "Rich, spiced", aroma: "Vanilla, spice, fruit" }
    ]
  },
  {
    category: "Vermouth",
    type: "Bianco Vermouth",
    products: [
      { name: "Martini Bianco", description: "White Vermouth", alcoholContent: 16.0, tasteProfile: "Light, sweet", aroma: "Vanilla, citrus, herbs" },
      { name: "Cinzano Bianco", description: "White Vermouth", alcoholContent: 16.0, tasteProfile: "Sweet, aromatic", aroma: "Vanilla, herbs" }
    ]
  },
  {
    category: "Vermouth",
    type: "Rosé Vermouth",
    products: [
      { name: "Martini Rosato", description: "Rosé Vermouth", alcoholContent: 16.0, tasteProfile: "Light, balanced", aroma: "Fruit, herbs, vanilla" },
      { name: "Lillet Rosé", description: "Rosé Vermouth", alcoholContent: 17.0, tasteProfile: "Fruity, botanical", aroma: "Fruit, citrus, herbs" }
    ]
  },
  {
    category: "Vermouth",
    type: "Extra Dry Vermouth",
    products: [
      { name: "Martini Extra Dry", description: "Extra Dry Vermouth", alcoholContent: 18.0, tasteProfile: "Very dry, herbal", aroma: "Herbs, citrus, botanicals" },
      { name: "Noilly Prat Extra Dry", description: "Extra Dry Vermouth", alcoholContent: 18.0, tasteProfile: "Extra dry, herbal", aroma: "Herbs, spice" }
    ]
  },

  // ==================== VODKA ====================
  {
    category: "Vodka",
    type: "Classic Vodka",
    products: [
      { name: "Absolut", description: "Premium Vodka", alcoholContent: 40.0, tasteProfile: "Clean, neutral", aroma: "Subtle grain, citrus" },
      { name: "Smirnoff", description: "Vodka", alcoholContent: 40.0, tasteProfile: "Smooth, clean", aroma: "Grain, subtle sweetness" },
      { name: "Stolichnaya", description: "Russian Vodka", alcoholContent: 40.0, tasteProfile: "Crisp, clean", aroma: "Grain, wheat" }
    ]
  },
  {
    category: "Vodka",
    type: "Premium Vodka",
    products: [
      { name: "Grey Goose", description: "Premium French Vodka", alcoholContent: 40.0, tasteProfile: "Smooth, refined", aroma: "Subtle grain, citrus" },
      { name: "Belvedere", description: "Polish Rye Vodka", alcoholContent: 40.0, tasteProfile: "Smooth, creamy", aroma: "Rye grain, subtle spice" },
      { name: "Cîroc", description: "Grape Vodka", alcoholContent: 40.0, tasteProfile: "Smooth, fruity", aroma: "Grape, citrus" }
    ]
  },
  {
    category: "Vodka",
    type: "Flavored Vodka",
    products: [
      { name: "Absolut Citron", description: "Lemon Flavored Vodka", alcoholContent: 40.0, tasteProfile: "Citrus, clean", aroma: "Lemon, citrus" },
      { name: "Smirnoff Raspberry", description: "Raspberry Flavored Vodka", alcoholContent: 37.5, tasteProfile: "Fruity, sweet", aroma: "Raspberry, fruit" },
      { name: "Stolichnaya Vanil", description: "Vanilla Flavored Vodka", alcoholContent: 40.0, tasteProfile: "Vanilla, smooth", aroma: "Vanilla, spice" }
    ]
  },
  {
    category: "Vodka",
    type: "Potato Vodka",
    products: [
      { name: "Chopin", description: "Polish Potato Vodka", alcoholContent: 40.0, tasteProfile: "Rich, creamy", aroma: "Potato, grain, subtle sweetness" },
      { name: "Luksusowa", description: "Polish Potato Vodka", alcoholContent: 40.0, tasteProfile: "Smooth, earthy", aroma: "Potato, subtle spice" }
    ]
  },
  {
    category: "Vodka",
    type: "Wheat Vodka",
    products: [
      { name: "Ketel One", description: "Dutch Wheat Vodka", alcoholContent: 40.0, tasteProfile: "Smooth, balanced", aroma: "Wheat, subtle citrus" },
      { name: "Grey Goose Wheat", description: "French Wheat Vodka", alcoholContent: 40.0, tasteProfile: "Refined, smooth", aroma: "Wheat, grain, citrus" }
    ]
  },
  {
    category: "Vodka",
    type: "Rye Vodka",
    products: [
      { name: "Belvedere Rye", description: "Rye Vodka", alcoholContent: 40.0, tasteProfile: "Spicy, complex", aroma: "Rye, spice, grain" }
    ]
  },
  {
    category: "Vodka",
    type: "Corn Vodka",
    products: [
      { name: "Tito's", description: "Texas Corn Vodka", alcoholContent: 40.0, tasteProfile: "Smooth, creamy", aroma: "Corn, grain" }
    ]
  },

  // ==================== BRANDY ====================
  {
    category: "Brandy",
    type: "Cognac",
    products: [
      { name: "Hennessy", description: "Cognac", alcoholContent: 40.0, tasteProfile: "Rich, complex", aroma: "Vanilla, oak, fruit" },
      { name: "Rémy Martin", description: "Cognac", alcoholContent: 40.0, tasteProfile: "Elegant, balanced", aroma: "Vanilla, fruit, spice" }
    ]
  },
  {
    category: "Brandy",
    type: "Armagnac",
    products: [
      { name: "Château de Laubade", description: "Armagnac", alcoholContent: 40.0, tasteProfile: "Rich, fruity", aroma: "Plum, vanilla, spice" }
    ]
  },
  {
    category: "Brandy",
    type: "Pisco",
    products: [
      { name: "Barsol", description: "Peruvian Pisco", alcoholContent: 42.0, tasteProfile: "Fruity, clean", aroma: "Grape, fruit, floral" }
    ]
  },
  {
    category: "Brandy",
    type: "Calvados",
    products: [
      { name: "Père Magloire", description: "Apple Calvados", alcoholContent: 40.0, tasteProfile: "Apple, complex", aroma: "Apple, caramel, oak" }
    ]
  },
  {
    category: "Brandy",
    type: "Spanish Brandy",
    products: [
      { name: "Torres", description: "Spanish Brandy", alcoholContent: 36.0, tasteProfile: "Smooth, fruity", aroma: "Fruit, spice, vanilla" }
    ]
  },
  {
    category: "Brandy",
    type: "American Brandy",
    products: [
      { name: "E&J", description: "American Brandy", alcoholContent: 40.0, tasteProfile: "Smooth, sweet", aroma: "Grape, caramel, vanilla" }
    ]
  },

  // ==================== LIQUEUR ====================
  {
    category: "Liqueur",
    type: "Orange Liqueur",
    products: [
      { name: "Cointreau", description: "Orange Liqueur", alcoholContent: 40.0, tasteProfile: "Citrus, clean", aroma: "Orange, citrus, floral" }
    ]
  },
  {
    category: "Liqueur",
    type: "Coffee Liqueur",
    products: [
      { name: "Kahlúa", description: "Coffee Liqueur", alcoholContent: 26.5, tasteProfile: "Coffee, sweet", aroma: "Coffee, vanilla, caramel" }
    ]
  },
  {
    category: "Liqueur",
    type: "Herbal Liqueur",
    products: [
      { name: "Chartreuse", description: "Herbal Liqueur", alcoholContent: 55.0, tasteProfile: "Herbal, complex", aroma: "Herbs, spice, citrus" }
    ]
  },
  {
    category: "Liqueur",
    type: "Cream Liqueur",
    products: []
  },
  {
    category: "Liqueur",
    type: "Fruit Liqueur",
    products: []
  },

  // ==================== AMARO ====================
  {
    category: "Amaro",
    type: "Amaro",
    products: [
      { name: "Averna", description: "Italian Amaro", alcoholContent: 29.0, tasteProfile: "Herbal, bitter-sweet", aroma: "Herbs, spice, citrus" }
    ]
  },
  {
    category: "Amaro",
    type: "Aperitif Bitter",
    products: [
      { name: "Campari", description: "Aperitif Bitter", alcoholContent: 28.5, tasteProfile: "Bitter, herbaceous", aroma: "Herbs, citrus, bitter" }
    ]
  },
  {
    category: "Amaro",
    type: "Digestif Bitter",
    products: [
      { name: "Fernet-Branca", description: "Fernet", alcoholContent: 39.0, tasteProfile: "Bitter, herbal", aroma: "Bitter herbs, spice" }
    ]
  },

  // ==================== APERITIF WINE ====================
  {
    category: "Aperitif Wine",
    type: "Quinquina",
    products: [
      { name: "Lillet", description: "French Aperitif Wine", alcoholContent: 17.0, tasteProfile: "Sweet, herbaceous", aroma: "Herbs, citrus, floral" }
    ]
  },
  {
    category: "Aperitif Wine",
    type: "Americano",
    products: [
      { name: "Cocchi Americano", description: "Italian Aperitif", alcoholContent: 16.5, tasteProfile: "Herbal, bitter-sweet", aroma: "Herbs, citrus, vanilla" }
    ]
  },
  {
    category: "Aperitif Wine",
    type: "Aperitif Wine",
    products: []
  },

  // ==================== MEZCAL ====================
  {
    category: "Mezcal",
    type: "Espadín",
    products: [
      { name: "Del Maguey", description: "Oaxacan Mezcal", alcoholContent: 47.0, tasteProfile: "Smoky, agave-forward", aroma: "Smoke, agave, citrus" }
    ]
  },
  {
    category: "Mezcal",
    type: "Tobalá",
    products: [
      { name: "Montelobos", description: "Mezcal Tobalá", alcoholContent: 47.0, tasteProfile: "Smoky, fruity", aroma: "Smoke, fruit, herbs" }
    ]
  },
  {
    category: "Mezcal",
    type: "Ensamble",
    products: []
  },

  // ==================== SPARKLING WINE ====================
  {
    category: "Sparkling Wine",
    type: "Champagne",
    products: [
      { name: "Moët & Chandon", description: "Champagne", alcoholContent: 12.0, tasteProfile: "Crisp, fruity", aroma: "Apple, citrus, brioche" },
      { name: "Veuve Clicquot", description: "Champagne", alcoholContent: 12.5, tasteProfile: "Balanced, elegant", aroma: "Fruit, brioche, spice" },
      { name: "Dom Pérignon", description: "Champagne", alcoholContent: 12.5, tasteProfile: "Complex, refined", aroma: "Fruit, honey, spice" }
    ]
  },
  {
    category: "Sparkling Wine",
    type: "Prosecco",
    products: [
      { name: "La Marca", description: "Prosecco", alcoholContent: 11.5, tasteProfile: "Fruity, light", aroma: "Apple, pear, citrus" },
      { name: "Mionetto", description: "Prosecco", alcoholContent: 11.0, tasteProfile: "Fresh, fruity", aroma: "Green apple, citrus" },
      { name: "Martini Prosecco", description: "Prosecco", alcoholContent: 11.0, tasteProfile: "Light, refreshing", aroma: "Apple, citrus" }
    ]
  },
  {
    category: "Sparkling Wine",
    type: "Sekt",
    products: [
      { name: "Rotkäppchen", description: "German Sekt", alcoholContent: 11.0, tasteProfile: "Fruity, light", aroma: "Peach, apple, citrus" },
      { name: "Henkell", description: "German Sekt", alcoholContent: 11.5, tasteProfile: "Dry, balanced", aroma: "Citrus, apple" }
    ]
  },
  {
    category: "Sparkling Wine",
    type: "Cava",
    products: [
      { name: "Freixenet", description: "Spanish Cava", alcoholContent: 11.5, tasteProfile: "Dry, crisp", aroma: "Citrus, apple, brioche" },
      { name: "Codorníu", description: "Spanish Cava", alcoholContent: 12.0, tasteProfile: "Elegant, balanced", aroma: "Fruit, brioche, citrus" }
    ]
  },
  {
    category: "Sparkling Wine",
    type: "Crémant",
    products: [
      { name: "Lucien Albrecht", description: "Crémant", alcoholContent: 12.5, tasteProfile: "Dry, elegant", aroma: "Fruit, brioche, spice" }
    ]
  },

  // ==================== ABSINTHE ====================
  {
    category: "Absinthe",
    type: "Verte",
    products: [
      { name: "Pernod", description: "Green Absinthe", alcoholContent: 45.0, tasteProfile: "Herbal, anise-forward", aroma: "Anise, wormwood, herbs" },
      { name: "La Fée", description: "Green Absinthe", alcoholContent: 68.0, tasteProfile: "Bold, herbal", aroma: "Wormwood, anise, herbs" }
    ]
  },
  {
    category: "Absinthe",
    type: "Blanche",
    products: [
      { name: "Kübler", description: "Blanche Absinthe", alcoholContent: 35.0, tasteProfile: "Clear, herbal", aroma: "Anise, herbs, citrus" },
      { name: "La Clandestine", description: "Blanche Absinthe", alcoholContent: 48.0, tasteProfile: "Herbal, balanced", aroma: "Herbs, anise, citrus" }
    ]
  },
  {
    category: "Absinthe",
    type: "Bohemian",
    products: [
      { name: "Hill's", description: "Bohemian Absinthe", alcoholContent: 45.0, tasteProfile: "Strong, herbal", aroma: "Wormwood, anise, herbs" }
    ]
  },

  // ==================== JUICE ====================
  {
    category: "Juice",
    type: "Orange Juice",
    products: [
      { name: "Fresh Orange Juice", description: "Freshly squeezed orange juice", alcoholContent: 0.0, tasteProfile: "Sweet, citrus", aroma: "Orange, citrus" }
    ]
  },
  {
    category: "Juice",
    type: "Lemon Juice",
    products: [
      { name: "Fresh Lemon Juice", description: "Freshly squeezed lemon juice", alcoholContent: 0.0, tasteProfile: "Sour, acidic", aroma: "Lemon, citrus" }
    ]
  },
  {
    category: "Juice",
    type: "Lime Juice",
    products: [
      { name: "Fresh Lime Juice", description: "Freshly squeezed lime juice", alcoholContent: 0.0, tasteProfile: "Tart, acidic", aroma: "Lime, citrus" }
    ]
  },
  {
    category: "Juice",
    type: "Pineapple Juice",
    products: [
      { name: "Dole Pineapple Juice", description: "Pineapple juice", alcoholContent: 0.0, tasteProfile: "Sweet, fruity", aroma: "Pineapple, tropical" }
    ]
  },
  {
    category: "Juice",
    type: "Cranberry Juice",
    products: [
      { name: "Ocean Spray", description: "Cranberry juice", alcoholContent: 0.0, tasteProfile: "Tart, slightly sweet", aroma: "Cranberry, berry" }
    ]
  },

  // ==================== SOFT DRINK / SODA ====================
  {
    category: "Soft Drink",
    type: "Cola",
    products: [
      { name: "Coca-Cola", description: "Cola soft drink", alcoholContent: 0.0, tasteProfile: "Sweet, caramel", aroma: "Caramel, spice, vanilla" },
      { name: "Pepsi", description: "Cola soft drink", alcoholContent: 0.0, tasteProfile: "Sweet, citrus", aroma: "Citrus, caramel" }
    ]
  },
  {
    category: "Soft Drink",
    type: "Ginger Beer",
    products: [
      { name: "Fever-Tree Ginger Beer", description: "Premium ginger beer", alcoholContent: 0.0, tasteProfile: "Spicy, ginger", aroma: "Ginger, spice" }
    ]
  },
  {
    category: "Soft Drink",
    type: "Ginger Ale",
    products: [
      { name: "Schweppes Ginger Ale", description: "Ginger ale", alcoholContent: 0.0, tasteProfile: "Light, ginger", aroma: "Ginger, lemon" }
    ]
  },
  {
    category: "Soft Drink",
    type: "Tonic Water",
    products: [
      { name: "Fever-Tree Tonic", description: "Premium tonic water", alcoholContent: 0.0, tasteProfile: "Bitter, quinine", aroma: "Quinine, botanical" }
    ]
  },

  // ==================== SYRUP ====================
  {
    category: "Syrup",
    type: "Simple Syrup",
    products: [
      { name: "Simple Syrup", description: "Classic simple syrup", alcoholContent: 0.0, tasteProfile: "Sweet", aroma: "Sugar" }
    ]
  },
  {
    category: "Syrup",
    type: "Gum Syrup",
    products: [
      { name: "Gum Syrup", description: "Gum syrup for cocktails", alcoholContent: 0.0, tasteProfile: "Sweet, thick", aroma: "Sugar, gum arabic" }
    ]
  },

  // ==================== BITTERS ====================
  {
    category: "Bitters",
    type: "Aromatic Bitters",
    products: [
      { name: "Angostura Bitters", description: "Aromatic bitters", alcoholContent: 44.7, tasteProfile: "Bitter, spicy", aroma: "Spice, molasses, herbs" }
    ]
  },
  {
    category: "Bitters",
    type: "Orange Bitters",
    products: [
      { name: "Fee Brothers Orange Bitters", description: "Orange bitters", alcoholContent: 21.0, tasteProfile: "Bitter, citrus", aroma: "Orange, herbs" }
    ]
  }
];

async function seedBottles() {
  console.log("🍹 Starting bottle database seed...");

  try {
    // Delete all existing bottles to avoid duplicates
    await prisma.bottle.deleteMany({});
    console.log("✓ Cleared existing bottles");

    let createdCount = 0;

    for (const categoryData of bottleData) {
      for (const product of categoryData.products) {
        const bottle = await prisma.bottle.create({
          data: {
            name: product.name,
            category: categoryData.category,
            type: categoryData.type,
            productName: product.name,
            description: product.description,
            tasteProfile: product.tasteProfile,
            aroma: product.aroma,
            alcoholContent: product.alcoholContent,
            texture: product.description ? `Texture varies by ${categoryData.type}` : null,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
        createdCount++;
        console.log(`✓ ${createdCount}. Created: ${product.name} (${categoryData.category} - ${categoryData.type})`);
      }
    }

    console.log(`\n✅ Seed completed! Created ${createdCount} bottles.`);
  } catch (error) {
    console.error("❌ Error seeding bottles:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedBottles();
