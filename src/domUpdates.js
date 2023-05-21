import { getIngredients, getRecipeInstructions, calculateRecipeCost, getItems, alphabetizeData } from "./recipes"
import { selectRecipe, addDelete } from "./scripts"

const recipeName = document.querySelector(".recipe-name")
const recipeIngredientList = document.querySelector(".recipe-ingredients")
const instructions = document.querySelector(".instructions-section") 
const recipeCost = document.querySelector(".recipe-cost")
const recipeView = document.querySelector(".recipe-view")
const homeBanner = document.querySelector(".home-banner")
const recipeImage = document.querySelector(".recipe-image")
const searchHeader = document.querySelectorAll('.recipe-results-header')
const recipeBoxes = document.querySelectorAll('.recipe-results')
const allPages = document.querySelectorAll('.page')
let recipesToCook = document.querySelector('#recipes-to-cook')
const userInitials = document.querySelector('.initials')
let searchInput = document.querySelector('#search-input');
let searchSaved = document.querySelector('#search-saved');
const allRecipesView = document.querySelector('#all-recipes-view');
const allRecipesSection = document.querySelector('#all-recipes');
// const dropdownCategories = document.querySelector('.dropdown-categories');
// const savedDropDownCategories = document.querySelector('.saved-dropdown-categories');

const hideAllPages = () => {
  allPages.forEach(page => page.classList.add('hidden'))
}

const renderUser = (user) => {
  const firstLast = user.name.split(" ")
  const initials = firstLast.reduce((initials, substring) => {
    return initials.concat(substring[0])
  }, '')
  userInitials.innerText = initials
}

const renderResults = (userValue, formattedRecipes, container) => {
  const currentHeader = (container === 'saved') ? searchHeader[0] : searchHeader[1]
  const currentRecipeResults = (container === 'saved') ? recipeBoxes[0] : recipeBoxes[1]
  currentHeader.innerHTML = '';
  currentRecipeResults.innerHTML = '';
  searchInput.value = '';
  searchSaved.value = '';
  const recipeDataAlpha = alphabetizeData(formattedRecipes)
  showSearchResults(userValue, recipeDataAlpha, currentHeader, currentRecipeResults)
}

const showSearchResults = (userValue, searchResults, currentHeader, currentRecipeResults) => {
  console.log(searchResults)
  if (!userValue){
    currentHeader.innerHTML += `<h1>Please enter a valid search!</h1>`
  } else if (!searchResults.length) {
    currentHeader.innerHTML += `<h1>Sorry, no results for "${userValue}"!</h1>`
  } else {
    currentHeader.innerHTML += `<h1>Showing results for "${userValue}"...</h1>`
    searchResults.forEach((recipe) => {
      currentRecipeResults.innerHTML += `
      <figure id="${recipe.id}" class="recipe-box">
        <img src="${recipe.image}" alt="image of ${recipe.name}">
        <figcaption>${recipe.name}</figcaption>
      </figure>`
    })
    selectRecipe()
  }
}

const displayAllRecipes = (recipeData) => {
  hideAllPages();
  allRecipesView.classList.remove("hidden")
  allRecipesSection.innerHTML = ''
  const recipeDataAlpha = alphabetizeData(recipeData)
  const recipeIds = getItems(recipeDataAlpha, 'id')
  const recipeNames = getItems(recipeDataAlpha, 'name')
  const recipeImages = getItems(recipeDataAlpha, 'image')
  recipeData.forEach((_, i) => {
    allRecipesSection.innerHTML += `
      <figure id="${recipeIds[i]}" class="recipe-box">
      <img src="${recipeImages[i]}" alt="image of ${recipeNames[i]}">
      <figcaption>${recipeNames[i]}</figcaption>
      </figure>`
    });
  selectRecipe();
}

const renderRecipeInfo = (recipe, data) => {
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
  recipeIngredientList.innerText = `Ingredients: \n ${ingredientDisplays.join('\n')}`
  instructions.innerText = `Instructions: \n ${getRecipeInstructions(recipe).join('\n')}`
  recipeCost.innerText = `Total Cost: $${(calculateRecipeCost(ingredients, recipe) / 100).toFixed(2)}`
  hideAllPages()
  recipeView.classList.remove("hidden")
  recipeImage.src = `${recipe.image}`
  recipeImage.alt = `${recipe.name}`
}

const renderRecipeOfTheDay = (recipe) => {
  homeBanner.innerHTML = 
      `<img class="recipe-of-the-day" alt=${recipe.name} src=${recipe.image}>
      <figcaption>
        <h1>${recipe.name}</h1>
      </figcaption>`
  homeBanner.id = `${recipe.id}`
}

const viewSavedRecipes = (user) => {
  recipesToCook.classList.remove('hidden')
  searchHeader[0].innerHTML = '';
  recipeBoxes[0].innerHTML = '';
  recipesToCook.innerHTML = '';
  if (!user.recipesToCook.length){
    recipesToCook.innerHTML = `<p>Save a recipe to view it here!</p>`
    return
  }
  const recipeDataAlpha = alphabetizeData(user.recipesToCook)
  recipeDataAlpha.forEach(recipe => {
    recipesToCook.innerHTML += `<article class="whole-recipe-box">
      <nav class="delete-btn">
        <button id="${recipe.id}" class="delete">✖️</button>
      </nav>
      <figure id="${recipe.id}" class="recipe-box">
        <img src="${recipe.image}" alt="image of ${recipe.name}">
        <figcaption>${recipe.name}</figcaption>
      </figure>
    <article>`
  }) 
  let deleteBtn = document.querySelectorAll('.delete-btn')
  addDelete(deleteBtn)
  selectRecipe()
}

const populateTags = (tags, category) => {
  category.innerHTML = '';
  // if(!tags.length) {
  //   category.innerHTML = '<p>No saved recipes yet!</p>';
  // }
  tags.forEach(tag => {
    category.innerHTML += `<p class="${tag}">${tag}</p>`;
  });
};

export {
  showSearchResults,
  renderResults,
  viewSavedRecipes,
  renderRecipeInfo,
  renderRecipeOfTheDay,
  renderUser,
  populateTags,
  hideAllPages,
  displayAllRecipes
}