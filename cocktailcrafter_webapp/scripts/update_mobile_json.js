const fs = require('fs');
const path = require('path');

const FILE_PATH = '/Users/edi/Documents/Edis Techlab/Projekte/05_CocktailCrafter/cocktailcrafter_webapp/cocktailcrafter-mobile/constants/CocktailData.json';

try {
    const data = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));

    if (data.recipes) {
        data.recipes = data.recipes.map(recipe => {
            if (recipe.pictureUrl) {
                recipe.pictureUrl = recipe.pictureUrl.replace(/ /g, '_');
            }
            return recipe;
        });

        fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
        console.log('✅ Updated CocktailData.json with underscore paths.');
    } else {
        console.log('⚠️  No recipes found in JSON.');
    }
} catch (err) {
    console.error('❌ Error updating JSON:', err.message);
}
