//NOTE: Your DOM manipulation will occur in this file

import { getIngredients, getIngredientNames, getRecipeInstructions } from "./recipes"

//Here are 2 example functions just to demonstrate one way you can export/import between the two js files. You'll want to delete these once you get your own code going.
// function exampleFunction1(person) {
//   console.log(`oh hi there ${person}`)
// }

// function exampleFunction2(person) {
//   console.log(`bye now ${person}`)
// }

const recipeName = document.querySelector(".recipe-name")
const recipeIngredientList = document.querySelector(".recipe-ingredients")
const instructions = document.querySelector(".instructions-section") 

const displayRecipeInfo = (recipe, data) => {
  recipeName.innerText = recipe.name
  const ingredients = getIngredients(recipe, data)
  const amounts = recipe.ingredients.map(ingredient => {
    return ingredient.quantity.amount
  })
  const units = recipe.ingredients.map(ingredient => {
    return ingredient.quantity.unit
  })
  const ingredientDisplays = ingredients.map((ingredient, i) => {
    return `${amounts[i]} ${units[i]} ${ingredient.name}`
  })
  recipeIngredientList.innerText = ingredientDisplays.join('\n')
  instructions.innerText = getRecipeInstructions(recipe).join('\n')
}

export {
  displayRecipeInfo
  // exampleFunction1,
  // exampleFunction2,
}