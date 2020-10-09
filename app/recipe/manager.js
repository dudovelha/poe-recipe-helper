const fs = require('fs');
const itemDB = require('../item/itemDB');

const recipes = JSON.parse(fs.readFileSync(`${__dirname}/recipes.json`));

class Recipe {
  static getRecipeNames() {
    return Object.keys(recipes);
  }

  static buildRecipe(recipeName) {
    itemDB.getItem();
  }
}

module.exports = Recipe;
