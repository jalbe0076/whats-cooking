import { getRecipeById, getRandomRecipe, filterRecipes, getItems } from './recipes'
import { displayRecipeInfo, displayRecipeOfTheDay, renderResults, hideAllPages, displayAllRecipes } from './domUpdates'
import './styles.css'
import recipeData from './data/recipes'
import ingredientsData from './data/ingredients'
import apiCalls from './apiCalls'

let currentRecipe;
let recipeOfTheDay;
let searchInput = document.querySelector('#search-input');
const searchBtn = document.querySelector('#search-btn');
const searchView = document.querySelector('#search-results-view')
const homeBanner = document.querySelector(".home-banner")
const homeView = document.querySelector(".home-view")
const homeIcon = document.querySelector('#home-icon')
let recipeResults = document.querySelectorAll('.recipe-box')
const allRecipesButton = document.querySelector('#all-recipes-btn')


window.addEventListener('load', function() {
  updateRecipeOfTheDay()
})

homeIcon.addEventListener('click', () => {
	hideAllPages()
	homeView.classList.remove('hidden')
})

homeBanner.addEventListener('click', function(e) {
  updateCurrentRecipe(e)
})

searchBtn.addEventListener('click', () => {
  searchRecipes(recipeData)
})

searchInput.addEventListener('keydown', (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
      searchRecipes(recipeData);
  }
});

allRecipesButton.addEventListener('click', function() {
  displayAllRecipes(recipeData)
});

const selectRecipe = () => {
	recipeResults = document.querySelectorAll('.recipe-box')
	recipeResults.forEach(recipe => {
		recipe.addEventListener('click', (e) => {
			updateCurrentRecipe(e)        
		})
	})    
}

const updateCurrentRecipe = (e) => {
  currentRecipe = getRecipeById(recipeData, parseInt(e.target.id || e.target.parentNode.id || e.target.parentNode.parentNode.id))
  displayRecipeInfo(currentRecipe, ingredientsData)
}

const updateRecipeOfTheDay = () => {
  recipeOfTheDay = getRandomRecipe(recipeData)
  displayRecipeOfTheDay(recipeOfTheDay)
}

const searchRecipes = (recipes) => {
  hideAllPages()
  searchView.classList.remove('hidden')
  const retrieved = retrieveInput()
  const foundRecipes = filterRecipes(recipes, retrieved)
  if (foundRecipes === 'Sorry, no matching results!'){
    renderResults(retrieved)
    return
  }
	const recipeIDs = getItems(foundRecipes, 'id')
  const recipeNames = getItems(foundRecipes, 'name')
  const recipeImages = getItems(foundRecipes, 'image')
  renderResults(retrieved, recipeNames, recipeImages, recipeIDs)
}

const retrieveInput = () => {
  searchInput = document.getElementById('search-input');
  return searchInput.value
}

export {
	searchRecipes,
	retrieveInput,
	selectRecipe
  }

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
// import './images/turing-logo.png'
// import ingredientsData from './data/ingredients.js'

// Example of one way to import functions from the domUpdates file. You will delete these examples.
// import {exampleFunction1, exampleFunction2} from './domUpdates.js'

// exampleFunction1('heather')
// exampleFunction2('heather')

// console.log(ingredientsData)
