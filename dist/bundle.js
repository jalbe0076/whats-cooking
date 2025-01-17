/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addDelete": () => (/* binding */ addDelete),
/* harmony export */   "retrieveInput": () => (/* binding */ retrieveInput),
/* harmony export */   "saveRecipe": () => (/* binding */ saveRecipe),
/* harmony export */   "selectRecipe": () => (/* binding */ selectRecipe),
/* harmony export */   "setData": () => (/* binding */ setData),
/* harmony export */   "updateUser": () => (/* binding */ updateUser)
/* harmony export */ });
/* harmony import */ var _recipes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _domUpdates__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
/* harmony import */ var _apiCalls__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(11);
// =====================================================================
// ======================  IMPORTS AND VARIABLES  ======================
// =====================================================================






let currentRecipe;
let recipeOfTheDay;
let user;
let featuredRecipes;
let usersData;
let ingredientsData;
let recipeData;

let searchInput = document.querySelector('#search-input');
let searchSaved = document.querySelector('#search-saved');
const currSavedRecipes = document.querySelector('#recipes-to-cook')
const searchBtn = document.querySelector('#search-btn');
const searchView = document.querySelector('#search-results-view')
const homeView = document.querySelector(".home-view")
const homeIcon = document.querySelector('#home-icon')
const savedView = document.querySelector('#saved-view')
const savedViewBtn = document.querySelector('#view-saved-btn')
const addToSaved = document.querySelector(".add-to-saved")
const dropdownCategories = document.querySelector('.dropdown-categories');
let featuredTitle = document.querySelector('.featured-title')
const savedDropdownCategories = document.querySelector('.saved-dropdown-categories');
let recipeResults = document.querySelectorAll('.recipe-box');
const allRecipesButton = document.querySelector('#all-recipes-btn');
const featured = document.querySelector('.featured')

// =====================================================================
// =========================  EVENT LISTENERS  =========================
// =====================================================================


window.addEventListener('load', function() {
  setData();
  (0,_apiCalls__WEBPACK_IMPORTED_MODULE_3__.getData)('recipes').then(result => {
    const tags = (0,_recipes__WEBPACK_IMPORTED_MODULE_0__.getAllTags)(result.recipes);
    (0,_domUpdates__WEBPACK_IMPORTED_MODULE_1__.populateTags)(tags, dropdownCategories);
    updateRecipeOfTheDay();
    updateUser();
    updateFeaturedRecipes();
    selectRecipe()
  });
});

homeIcon.addEventListener('click', () => {
	(0,_domUpdates__WEBPACK_IMPORTED_MODULE_1__.hideAllPages)()
	homeView.classList.remove('hidden')
})

homeView.addEventListener('click', function(e) {
  updateCurrentRecipe(e)
})

homeView.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    updateCurrentRecipe(e)
  }
})

searchBtn.addEventListener('click', () => {
  searchAllRecipes(recipeData)
})

searchInput.addEventListener('keydown', (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchAllRecipes(recipeData);
  }
});

savedViewBtn.addEventListener('click', () => {
  updateUser()
	;(0,_domUpdates__WEBPACK_IMPORTED_MODULE_1__.hideAllPages)()
	savedView.classList.remove('hidden')
	;(0,_domUpdates__WEBPACK_IMPORTED_MODULE_1__.viewSavedRecipes)(user, ingredientsData)
  if(user.recipesToCook.length){ populateSavedTags() }
})

allRecipesButton.addEventListener('click', function() {
  ;(0,_domUpdates__WEBPACK_IMPORTED_MODULE_1__.displayAllRecipes)(recipeData)
});

addToSaved.addEventListener('click', function() {
  saveRecipe()
})

dropdownCategories.addEventListener('click', (e) => {
  const tag = e.target.classList.value;
  const recipesList = (0,_recipes__WEBPACK_IMPORTED_MODULE_0__.filterRecipes)(recipeData, tag);
  searchAllRecipes(recipesList, tag);
});

savedDropdownCategories.addEventListener('click', (e) => {
  const tag = e.target.classList.value;
  const recipesList = (0,_recipes__WEBPACK_IMPORTED_MODULE_0__.filterRecipes)(user.recipesToCook, tag);
  searchAllRecipes(recipesList, tag);
});

searchSaved.addEventListener('keydown', (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
		currSavedRecipes.classList.add('hidden')
    searchSavedRecipes(user.recipesToCook);
  }
});

const selectRecipe = () => {
  recipeResults = document.querySelectorAll('.recipe-box')
	recipeResults.forEach(recipe => {
    recipe.addEventListener('click', (e) => {
      updateCurrentRecipe(e)        
		})
    recipe.addEventListener('keydown', (e) => {
      if(e.key === "Enter") {
        updateCurrentRecipe(e)      
      }  
		})
	})    
}

const addDelete = (deleteBtn) => {
	deleteBtn.forEach(btn => {
		btn.addEventListener('click', (e) => {
			deletefromSaved(e)
		})
	})
}

// =====================================================================
// ============================  FUNCTIONS  ============================
// =====================================================================

const updateCurrentRecipe = (e) => {
  currentRecipe = (0,_recipes__WEBPACK_IMPORTED_MODULE_0__.getRecipeById)(recipeData, parseInt(e.target.id || e.target.parentNode.id || e.target.parentNode.parentNode.id))
  renderHeartColor()
  ;(0,_domUpdates__WEBPACK_IMPORTED_MODULE_1__.renderRecipeInfo)(currentRecipe, ingredientsData)
}

const updateUser = () => {
  if (!user) {
    user = (0,_recipes__WEBPACK_IMPORTED_MODULE_0__.getRandomItem)(usersData)
    ;(0,_domUpdates__WEBPACK_IMPORTED_MODULE_1__.renderUser)(user)
  } else {
    const searchById = user.id;
    user = usersData[searchById - 1];
    user.recipesToCook = (0,_recipes__WEBPACK_IMPORTED_MODULE_0__.getUserRecipes)(user, recipeData)
  }
}

const updateRecipeOfTheDay = () => {
  recipeOfTheDay = (0,_recipes__WEBPACK_IMPORTED_MODULE_0__.getRandomItem)(recipeData)
  ;(0,_domUpdates__WEBPACK_IMPORTED_MODULE_1__.renderRecipeOfTheDay)(recipeOfTheDay)
}

const updateFeaturedRecipes = () => {
  featuredRecipes = []
  const tag = (0,_recipes__WEBPACK_IMPORTED_MODULE_0__.getRandomItem)((0,_recipes__WEBPACK_IMPORTED_MODULE_0__.getAllTags)(recipeData))
  const taggedRecipes = (0,_recipes__WEBPACK_IMPORTED_MODULE_0__.filterRecipes)(recipeData, tag)
  featuredRecipes = taggedRecipes.slice(0,4)

  if(featuredRecipes.length < 4) {
    updateFeaturedRecipes()
  } else {
    const capitalTag = tag.split(' ').map(substring => substring[0].toUpperCase() + substring.slice(1)).join(' ')
    featuredTitle.innerText = `Featured Category: ${capitalTag}`
    ;(0,_domUpdates__WEBPACK_IMPORTED_MODULE_1__.renderRecipes)(featuredRecipes, featured) 
  }
}

const searchAllRecipes = (recipes, search) => {
  ;(0,_domUpdates__WEBPACK_IMPORTED_MODULE_1__.hideAllPages)()
  searchView.classList.remove('hidden')
	const retrieved = retrieveInput() || search;
	searchForRecipes(recipes, retrieved, 'all')
}

const searchForRecipes = (recipes, retrieved, container) => {
  const foundRecipes = (0,_recipes__WEBPACK_IMPORTED_MODULE_0__.filterRecipes)(recipes, retrieved)

  if (foundRecipes === 'Sorry, no matching results!'){
    (0,_domUpdates__WEBPACK_IMPORTED_MODULE_1__.renderResults)(retrieved, [], container)
    return
  }

  (0,_domUpdates__WEBPACK_IMPORTED_MODULE_1__.renderResults)(retrieved, foundRecipes, container)
}

const searchSavedRecipes = (recipes) => {
	const retrieved = retrieveSavedInput()
	searchForRecipes(recipes, retrieved, 'saved')
}

const retrieveInput = () => {
  searchInput = document.getElementById('search-input');
  return searchInput.value;
}

const retrieveSavedInput = () => {
	searchSaved = document.getElementById('search-saved')
	return searchSaved.value
}

const saveRecipe = () => {
  const recipeToCook = { "userID": user.id, "recipeID": currentRecipe.id };
  updateUser();

  if (!user.recipesToCook.some(recipe => recipe.id === currentRecipe.id)) {
    (0,_apiCalls__WEBPACK_IMPORTED_MODULE_3__.postData)(recipeToCook)
    addToSaved.style.color= 'red';
  } else {
    (0,_apiCalls__WEBPACK_IMPORTED_MODULE_3__.deleteData)(recipeToCook)
    addToSaved.style.color= 'grey';
  }
}

const renderHeartColor = () => {
  updateUser();
  return user.recipesToCook.includes(currentRecipe) ? addToSaved.style.color= 'red' : addToSaved.style.color= 'gray'
}

const deletefromSaved = (e) => {
	const selectedRecipeID = parseInt(e.target.id)
  const recipeToDelete = { "userID": user.id, "recipeID": selectedRecipeID };
  (0,_apiCalls__WEBPACK_IMPORTED_MODULE_3__.deleteData)(recipeToDelete);
  addToSaved.style.color= 'grey';
	const updatedSavedRecipes = user.recipesToCook.filter(recipe => recipe.id !== selectedRecipeID)
	user.recipesToCook = updatedSavedRecipes
	;(0,_domUpdates__WEBPACK_IMPORTED_MODULE_1__.viewSavedRecipes)(user, ingredientsData)
  if(user.recipesToCook.length){ populateSavedTags() }
}

const setData = () => {
  ;(0,_apiCalls__WEBPACK_IMPORTED_MODULE_3__.getAllData)().then(data => {
    usersData = data[0].users;
    ingredientsData = data[1].ingredients;
    recipeData = data[2].recipes;
  });
};

const populateSavedTags= () => {
  const savedTags = (0,_recipes__WEBPACK_IMPORTED_MODULE_0__.getAllTags)(user.recipesToCook);
  (0,_domUpdates__WEBPACK_IMPORTED_MODULE_1__.populateTags)(savedTags, savedDropdownCategories);   
}




/***/ }),
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "alphabetizeData": () => (/* binding */ alphabetizeData),
/* harmony export */   "calculateGroceryCost": () => (/* binding */ calculateGroceryCost),
/* harmony export */   "calculateRecipeCost": () => (/* binding */ calculateRecipeCost),
/* harmony export */   "filterRecipes": () => (/* binding */ filterRecipes),
/* harmony export */   "getAllTags": () => (/* binding */ getAllTags),
/* harmony export */   "getGroceryIngredients": () => (/* binding */ getGroceryIngredients),
/* harmony export */   "getIngredients": () => (/* binding */ getIngredients),
/* harmony export */   "getItems": () => (/* binding */ getItems),
/* harmony export */   "getRandomItem": () => (/* binding */ getRandomItem),
/* harmony export */   "getRecipeById": () => (/* binding */ getRecipeById),
/* harmony export */   "getRecipeInstructions": () => (/* binding */ getRecipeInstructions),
/* harmony export */   "getUserRecipes": () => (/* binding */ getUserRecipes)
/* harmony export */ });
const getRecipeById = (recipes, id) => {
  if(!recipes) { return 'Cannot find recipe'; }

  const recipe = recipes.find(recipe => recipe.id === id);
  if(!recipe) { return 'Cannot find recipe'; }

  return recipe;
};

const getRecipeInstructions = (recipe) => {
  return recipe.instructions.reduce((instructions, instruction) => {
    instructions.push(`${instruction.number}. ${instruction.instruction}`);
    return instructions;
  }, []);
};

const filterRecipes = (data, filterTerm) => {
  if(!filterTerm) {
    return 'Sorry, no matching results!'
  }

  const filteredRecipes = data.filter((recipe) => {
     return (recipe.tags.includes(filterTerm.toLowerCase()) || recipe.name.toLowerCase().includes(filterTerm.toLowerCase()))
  })

  if(!filteredRecipes.length) {
    return 'Sorry, no matching results!'
  }

  return filteredRecipes
}

const getRandomItem = (data) => {
  if(!data) {
    return `data not found`;
  }

  const indexPosition = Math.floor(Math.random() * data.length);

  return data[indexPosition];
};


const getIngredients = (currentRecipe, allIngredients) => {
  if(!allIngredients.length){
    return 'Sorry, no ingredients given!';
  }

  return currentRecipe.ingredients.reduce((ingredients, ingredient) => {
    let foundIngredient = allIngredients.find(item => ingredient.id === item.id);
    ingredients.push(foundIngredient);
    return ingredients;
  },[]);
};

const getGroceryIngredients = (recipesToCook, ingredientsData) => {
  if(!recipesToCook.length) {
    return 'Please save some recipes!'
  }
  return  recipesToCook.reduce((grocList, recipe) => {
    const ingredientsPerRecipe = getIngredients(recipe, ingredientsData)
    ingredientsPerRecipe.forEach( (ingredient, i) => {
      if(!grocList[ingredient.name]) {
        grocList[ingredient.name] = {}
        grocList[ingredient.name].amount = 0
        grocList[ingredient.name].unit = recipe.ingredients[i].quantity.unit
        grocList[ingredient.name].estimatedCostInCents = ingredient.estimatedCostInCents
      } 
      grocList[ingredient.name].amount += recipe.ingredients[i].quantity.amount
    })
    return grocList
  }, {})
}

const getItems = (list, key) => {
  if(!list.length){
    return 'Sorry, no list given!'
  }

  let allValues = [];
  list.forEach(item => allValues.push(item[key]))

  return allValues;
}

const calculateGroceryCost = (groceryList) => {
  if(!Object.keys(groceryList).length){
    return 'Error: no grocery list :('
  }
  
  const ingredients = Object.values(groceryList)
  const groceryCost = ingredients.reduce((totalCost, stats) => {
    totalCost += stats.estimatedCostInCents * stats.amount
    return totalCost
  }, 0) 
  return `$${(groceryCost / 100).toFixed(2)}`
}

const calculateRecipeCost = (ingredients, recipe) => {
  if(!ingredients.length){
    return 'Error: no ingredients :('
  }

  return ingredients.reduce((totalCost, ingredient) => {
    let ingredientQuantity = recipe.ingredients.find(recipe => recipe.id === ingredient.id) 
    totalCost += (ingredient.estimatedCostInCents * ingredientQuantity.quantity.amount)
    return totalCost
  }, 0);
};

const getAllTags = (recipes) => {
  if(!recipes) return `Error`;

  const availableTags = [];
  const tags = getItems(recipes, 'tags');

  tags.flat().forEach(tag => {
    if(!availableTags.includes(tag)) {
      availableTags.push(tag);
    }
  });
  
  return availableTags.sort();
};

const alphabetizeData = (data) => {
  data.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();

    if (nameA < nameB) {
      return -1;
    } else if (nameA > nameB) {
      return 1;
    } else {
      return 0;
    }
  });

  return data;
}

const getUserRecipes = (user, recipes) => {
  return user.recipesToCook.map(element => {
    if( typeof element !== 'object') {
      return recipes.find(recipe => recipe.id === element)
    } else {
      return recipes.find(recipe => recipe.id === element.id)
    }
  })
}



/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "displayAllRecipes": () => (/* binding */ displayAllRecipes),
/* harmony export */   "hideAllPages": () => (/* binding */ hideAllPages),
/* harmony export */   "populateTags": () => (/* binding */ populateTags),
/* harmony export */   "renderRecipeInfo": () => (/* binding */ renderRecipeInfo),
/* harmony export */   "renderRecipeOfTheDay": () => (/* binding */ renderRecipeOfTheDay),
/* harmony export */   "renderRecipes": () => (/* binding */ renderRecipes),
/* harmony export */   "renderResults": () => (/* binding */ renderResults),
/* harmony export */   "renderUser": () => (/* binding */ renderUser),
/* harmony export */   "showSearchResults": () => (/* binding */ showSearchResults),
/* harmony export */   "viewSavedRecipes": () => (/* binding */ viewSavedRecipes)
/* harmony export */ });
/* harmony import */ var _recipes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _scripts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(0);
// =====================================================================
// ======================  IMPORTS AND VARIABLES  ======================
// =====================================================================




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
const savedDropdownCategories = document.querySelector('.saved-dropdown-categories');
const dropdownPosition = document.querySelectorAll('.category-position');
const groceryListArticle = document.querySelector('.grocery-list');
const groceryCostArticle = document.querySelector('.grocery-cost');
const groceryListCostAside = document.querySelector('.grocery-list-and-cost')

// =====================================================================
// ============================  FUNCTIONS  ============================
// =====================================================================

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
  const recipeDataAlpha = (0,_recipes__WEBPACK_IMPORTED_MODULE_0__.alphabetizeData)(formattedRecipes)
  showSearchResults(userValue, recipeDataAlpha, currentHeader, currentRecipeResults)
}

const showSearchResults = (userValue, searchResults, currentHeader, currentRecipeResults) => {
  if (!userValue){
    currentHeader.innerHTML += `<h2>Please enter a valid search!</h2>`
  } else if (!searchResults.length) {
    currentHeader.innerHTML += `<h2>Sorry, no results for "${userValue}"!</h2>`
  } else {
    currentHeader.innerHTML += `<h2>Showing results for "${userValue}"...</h2>`
    renderRecipes(searchResults, currentRecipeResults)
    ;(0,_scripts__WEBPACK_IMPORTED_MODULE_1__.selectRecipe)()
  }
}

const displayAllRecipes = (recipeData) => {
  hideAllPages();
  allRecipesView.classList.remove("hidden")
  allRecipesSection.innerHTML = ''
  const recipeDataAlpha = (0,_recipes__WEBPACK_IMPORTED_MODULE_0__.alphabetizeData)(recipeData)
  renderRecipes(recipeDataAlpha, allRecipesSection)
  ;(0,_scripts__WEBPACK_IMPORTED_MODULE_1__.selectRecipe)();
}

const renderRecipeInfo = (recipe, data) => {
  recipeName.innerText = recipe.name
  const ingredients = (0,_recipes__WEBPACK_IMPORTED_MODULE_0__.getIngredients)(recipe, data)
  const amounts = recipe.ingredients.map(ingredient => {
    return ingredient.quantity.amount
  })
  const units = recipe.ingredients.map(ingredient => {
    return ingredient.quantity.unit
  })
  const ingredientDisplays = ingredients.map((ingredient, i) => {
    return `${amounts[i].toFixed(2)} ${units[i]} ${ingredient.name}`
  })

  recipeIngredientList.innerText = `Ingredients: \n ${ingredientDisplays.join('\n')}`
  instructions.innerText = `Instructions: \n ${(0,_recipes__WEBPACK_IMPORTED_MODULE_0__.getRecipeInstructions)(recipe).join('\n')}`
  recipeCost.innerText = `Total Cost: $${((0,_recipes__WEBPACK_IMPORTED_MODULE_0__.calculateRecipeCost)(ingredients, recipe) / 100).toFixed(2)}`
  hideAllPages()
  recipeView.classList.remove("hidden")
  recipeImage.src = `${recipe.image}`
  recipeImage.alt = `${recipe.name}`
}

const renderRecipeOfTheDay = (recipe) => {
  homeBanner.innerHTML = 
      `<img class="recipe-of-the-day" alt="" src=${recipe.image}>
      <figcaption>
        <h2>Recipe of the Day: ${recipe.name}</h2>
      </figcaption>`
  homeBanner.id = `${recipe.id}`
}

const viewSavedRecipes = (user, ingredientsData) => {
  recipesToCook.classList.remove('hidden')
  searchHeader[0].innerHTML = '';
  recipeBoxes[0].innerHTML = '';
  recipesToCook.innerHTML = '';
  savedDropdownCategories.innerHTML = '';

  if (!user.recipesToCook.length){
    recipesToCook.innerHTML = `<p>Save a recipe to view it here!</p>`
    dropdownPosition[1].classList.add('hidden')
    groceryListCostAside.classList.add('hidden')
    return
  }
  dropdownPosition[1].classList.remove('hidden')
  groceryListCostAside.classList.remove('hidden')
  const groceryList = (0,_recipes__WEBPACK_IMPORTED_MODULE_0__.getGroceryIngredients)(user.recipesToCook, ingredientsData)
  const totalGrocCost = (0,_recipes__WEBPACK_IMPORTED_MODULE_0__.calculateGroceryCost)(groceryList)

  const recipeDataAlpha = (0,_recipes__WEBPACK_IMPORTED_MODULE_0__.alphabetizeData)(user.recipesToCook)
    recipeDataAlpha.forEach(recipe => {
      recipesToCook.innerHTML += 
      `<article class="whole-recipe-box">
        <nav class="delete-btn">
          <button type="button" id="${recipe.id}" class="delete" aria-label="Delete">✖️</button>
        </nav>
        <figure id="${recipe.id}" class="recipe-box" tabindex="0">
          <img src="${recipe.image}" alt="">
          <figcaption>${recipe.name}</figcaption>
        </figure>
      <article>`
  }) 

  let deleteBtn = document.querySelectorAll('.delete-btn')
  ;(0,_scripts__WEBPACK_IMPORTED_MODULE_1__.addDelete)(deleteBtn)
  ;(0,_scripts__WEBPACK_IMPORTED_MODULE_1__.selectRecipe)()
  let groceryIngredients = Object.keys(groceryList)
  displayGroceryList(groceryList, groceryIngredients)
  displayGroceryCost(totalGrocCost)
}

const displayGroceryList = (groceryList, groceryIngredients) => {
  const ingredients = groceryIngredients.map((ingredient) => {
    return `¤ ${ingredient}: ${groceryList[ingredient].amount} ${groceryList[ingredient].unit} \n ‣ $${((groceryList[ingredient].estimatedCostInCents * groceryList[ingredient].amount) / 100).toFixed(2)}`
    })
  groceryListArticle.innerText = `${ingredients.join('\n')}`
}

const displayGroceryCost = (totalGrocCost) => {
  groceryCostArticle.innerHTML = `Total Cost: ${totalGrocCost}`
}

const populateTags = (tags, category) => {
  category.innerHTML = '';
  tags.forEach(tag => {
    category.innerHTML += `<button class="${tag}" aria-label="filter for ${tag}">${tag}</button>`;
  });
};

const renderRecipes = (recipes, section) => {
  recipes.forEach(recipe => {
    section.innerHTML += `
    <figure id="${recipe.id}" class="recipe-box" tabindex="0" >
      <img src="${recipe.image}" alt="">
      <figcaption>${recipe.name}</figcaption>
    </figure>`
  })
}



/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),
/* 4 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),
/* 5 */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _images_search_png__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9);
/* harmony import */ var _images_chef_png__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(10);
// Imports





var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(_images_search_png__WEBPACK_IMPORTED_MODULE_3__["default"]);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(_images_chef_png__WEBPACK_IMPORTED_MODULE_4__["default"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "* {\n  font-family: \"Kalam\", cursive;\n}\n\nhtml, body {\n  min-height: 100vh;\n}\n\nbody {\n  background-color: #F8EDEB;\n  background-image: url(\"data:image/svg+xml,%3Csvg width='84' height='84' viewBox='0 0 84 84' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fec5bb' fill-opacity='0.49'%3E%3Cpath d='M84 23c-4.417 0-8-3.584-8-7.998V8h-7.002C64.58 8 61 4.42 61 0H23c0 4.417-3.584 8-7.998 8H8v7.002C8 19.42 4.42 23 0 23v38c4.417 0 8 3.584 8 7.998V76h7.002C19.42 76 23 79.58 23 84h38c0-4.417 3.584-8 7.998-8H76v-7.002C76 64.58 79.58 61 84 61V23zM59.05 83H43V66.95c5.054-.5 9-4.764 9-9.948V52h5.002c5.18 0 9.446-3.947 9.95-9H83v16.05c-5.054.5-9 4.764-9 9.948V74h-5.002c-5.18 0-9.446 3.947-9.95 9zm-34.1 0H41V66.95c-5.053-.502-9-4.768-9-9.948V52h-5.002c-5.184 0-9.447-3.946-9.95-9H1v16.05c5.053.502 9 4.768 9 9.948V74h5.002c5.184 0 9.447 3.946 9.95 9zm0-82H41v16.05c-5.054.5-9 4.764-9 9.948V32h-5.002c-5.18 0-9.446 3.947-9.95 9H1V24.95c5.054-.5 9-4.764 9-9.948V10h5.002c5.18 0 9.446-3.947 9.95-9zm34.1 0H43v16.05c5.053.502 9 4.768 9 9.948V32h5.002c5.184 0 9.447 3.946 9.95 9H83V24.95c-5.053-.502-9-4.768-9-9.948V10h-5.002c-5.184 0-9.447-3.946-9.95-9zM50 50v7.002C50 61.42 46.42 65 42 65c-4.417 0-8-3.584-8-7.998V50h-7.002C22.58 50 19 46.42 19 42c0-4.417 3.584-8 7.998-8H34v-7.002C34 22.58 37.58 19 42 19c4.417 0 8 3.584 8 7.998V34h7.002C61.42 34 65 37.58 65 42c0 4.417-3.584 8-7.998 8H50z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\");\n  margin: 0px;\n}\n\nh1, .main-title, h2, .initials {\n  font-family: \"Mogra\", cursive;\n  text-shadow: 1px 0px 1px #CCCCCC, 0px 1px 1px #EEEEEE, 2px 1px 1px #CCCCCC, 1px 2px 1px #EEEEEE, 3px 2px 1px #CCCCCC, 2px 3px 1px #EEEEEE, 4px 3px 1px #CCCCCC, 3px 4px 1px #EEEEEE, 5px 4px 1px #CCCCCC, 4px 5px 1px #EEEEEE, 6px 5px 1px #CCCCCC, 5px 6px 1px #EEEEEE, 7px 6px 1px #CCCCCC;\n  text-align: center;\n}\n\n.main-title {\n  font-size: 3rem;\n  margin-top: 5%;\n  color: #282828;\n}\n\nmain {\n  display: flex;\n  flex-direction: column;\n}\n\n/* NAV BAR */\n.nav-bar {\n  display: flex;\n  flex-direction: row-reverse;\n  justify-content: space-between;\n  text-align: center;\n}\n\n#user-search {\n  display: flex;\n  justify-content: flex-end;\n  align-items: center;\n  padding: 20px;\n}\n\n#search-input, #search-saved {\n  height: fit-content;\n  align-self: center;\n  border: none;\n  background: #FFD7BA;\n  border-radius: 15px;\n  width: 50%;\n  text-align: center;\n  padding: 5px;\n  box-shadow: 10px 10px 15px -4px rgba(0, 0, 0, 0.22);\n}\n\nfigure {\n  position: relative;\n  display: inline-block;\n  margin: 0;\n}\n\n#user {\n  width: 100px;\n  height: 100px;\n}\n\n#user-initials {\n  padding: 5%;\n  border: 8px solid #D8E2DC;\n  border-radius: 50%;\n  color: #444444;\n  background-color: #F8EDEB;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 42px;\n  margin: 2%;\n  box-shadow: 10px 10px 15px -4px rgba(0, 0, 0, 0.2);\n}\n\n.initials {\n  margin: 0;\n  font-size: 2.125rem;\n}\n\n#search-btn {\n  width: 80px;\n  height: 50px;\n  border: none;\n  padding: 0px;\n  margin-top: 15px;\n  margin-left: 15px;\n  background-color: #F8EDEB;\n  border-radius: 20px 20px 20px 0px;\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ");\n  background-size: contain;\n  background-repeat: no-repeat;\n}\n\n.nav-pages {\n  display: flex;\n  align-items: flex-end;\n  margin: 20px;\n}\n\n#home-icon {\n  width: 140px;\n  height: 140px;\n  margin: 10px 20px 10px 10px;\n  border-radius: 30px;\n  background-color: #FEC5BB;\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_1___ + ");\n  background-size: cover;\n  box-shadow: 10px 10px 15px -4px rgba(0, 0, 0, 0.22);\n}\n\n.nav-btn {\n  width: 180px;\n  height: 40px;\n  font-size: 20px;\n  border: none;\n  color: #282828;\n  background-color: #FEC5BB;\n  margin: 10px;\n  border-radius: 5px;\n  box-shadow: 10px 10px 15px -4px rgba(0, 0, 0, 0.22);\n}\n\n.nav-btn:hover, .nav-btn:focus, .dropdown-categories button:hover, .dropdown-categories button:focus, .delete:hover, .delete:focus, .saved-dropdown-categories button:hover, .saved-dropdown-categories button:focus {\n  cursor: pointer;\n  transform: scale(1.1);\n  transition: 0.2s ease;\n}\n\n.arrow {\n  width: 20px;\n  position: absolute;\n  bottom: 11px;\n  right: 8px;\n}\n\n#home-icon:hover, .home-banner:hover, #search-btn:hover, .recipe-box:hover {\n  cursor: pointer;\n  opacity: 80%;\n  transition: 0.2s ease;\n}\n\n#home-icon:hover, #home-icon:focus {\n  background-color: #f8bfb5;\n}\n\n.category-position {\n  position: relative;\n}\n\n#all-categories-dropdown, #all-categories-btn {\n  position: relative;\n}\n\n#all-categories-btn {\n  width: 200px;\n}\n\n.dropdown-categories, .saved-dropdown-categories {\n  position: absolute;\n  border-radius: 10px;\n  top: 3.5rem;\n  left: 10px;\n  background-color: rgb(254, 197, 187);\n  visibility: hidden;\n  opacity: 0;\n  transition: all 0.5s ease;\n  font-size: 1.3rem;\n  z-index: 1;\n  width: 125px;\n  margin: 10px 0;\n  padding: 10px 0 10px 25px;\n}\n\n.dropdown-categories:after,\n.saved-dropdown-categories:after {\n  position: absolute;\n  content: \"\";\n  width: 16px;\n  height: 16px;\n  bottom: 100%;\n  left: 50%;\n  margin-left: -8px;\n  transform: rotate(45deg);\n  margin-bottom: -8px;\n  background-color: rgb(254, 197, 187);\n}\n\n.dropdown-categories button,\n.saved-dropdown-categories button {\n  margin: 0;\n  padding: 0;\n  text-align: left;\n  display: block;\n  background-color: transparent;\n  border: none;\n  font-size: 1.2rem;\n}\n\n.category-position:hover .dropdown-categories,\n.category-position:focus-within .dropdown-categories,\n.category-position:hover .saved-dropdown-categories,\n.category-position:focus-within .saved-dropdown-categories {\n  visibility: visible;\n  opacity: 1;\n}\n\n/* HOME VIEW */\n.home-view {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\n.banner-container {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  position: relative;\n  height: 50dvh;\n  margin-top: 5px;\n  margin-bottom: 5px;\n}\n\n.home-banner {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n}\n\n.recipe-of-the-day {\n  height: 370px;\n  border-radius: 40px;\n  box-shadow: 10px 10px 15px -4px rgba(0, 0, 0, 0.25);\n}\n\n.featured {\n  display: flex;\n  justify-content: space-around;\n  width: 75%;\n}\n\n#featured-recipes {\n  width: 100vw;\n  height: auto;\n  border-top: 6px solid #FCD5CE;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  background-color: #d8e2dc;\n  background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='34' height='44' viewBox='0 0 34 44'%3E%3Cg fill='%23e8e8e4' fill-opacity='1'%3E%3Cpath fill-rule='evenodd' d='M1 6.2C.72 5.55.38 4.94 0 4.36v13.28c.38-.58.72-1.2 1-1.84A12.04 12.04 0 0 0 7.2 22 12.04 12.04 0 0 0 1 28.2c-.28-.65-.62-1.26-1-1.84v13.28c.38-.58.72-1.2 1-1.84A12.04 12.04 0 0 0 7.2 44h21.6a12.05 12.05 0 0 0 5.2-4.36V26.36A12.05 12.05 0 0 0 28.8 22a12.05 12.05 0 0 0 5.2-4.36V4.36A12.05 12.05 0 0 0 28.8 0H7.2A12.04 12.04 0 0 0 1 6.2zM17.36 23H12a10 10 0 1 0 0 20h5.36a11.99 11.99 0 0 1 0-20zm1.28-2H24a10 10 0 1 0 0-20h-5.36a11.99 11.99 0 0 1 0 20zM12 1a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-3.46-2a2 2 0 1 0-3.47 2 2 2 0 0 0 3.47-2zm0-4a2 2 0 1 0-3.47-2 2 2 0 0 0 3.47 2zM12 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3.46 2a2 2 0 1 0 3.47-2 2 2 0 0 0-3.47 2zm0 4a2 2 0 1 0 3.47 2 2 2 0 0 0-3.47-2zM24 43a10 10 0 1 0 0-20 10 10 0 0 0 0 20zm0-14a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3.46 2a2 2 0 1 0 3.47-2 2 2 0 0 0-3.47 2zm0 4a2 2 0 1 0 3.47 2 2 2 0 0 0-3.47-2zM24 37a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-3.46-2a2 2 0 1 0-3.47 2 2 2 0 0 0 3.47-2zm0-4a2 2 0 1 0-3.47-2 2 2 0 0 0 3.47 2z'/%3E%3C/g%3E%3C/svg%3E\");\n}\n\n/* SEARCH VIEW */\n#search-results-view, .recipe-results-header, #saved-view, .whole-recipe-box {\n  display: flex;\n  align-content: center;\n  flex-direction: column;\n  text-align: center;\n  align-items: center;\n}\n\n.recipe-results, #recipes-to-cook, #all-recipes {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-around;\n  flex-wrap: wrap;\n}\n\n.recipe-results, #recipes-to-cook, #all-recipes {\n  margin: 2% 13% 6% 13%;\n}\n\n#recipes-to-cook {\n  margin: 2% 23% 6% 13%;\n}\n\n.recipe-box {\n  position: relative;\n  display: inline-block;\n  margin: 10px;\n}\n\n.recipe-box > img {\n  border-radius: 10px;\n  height: 20vh;\n  width: fit-content;\n  box-shadow: 10px 10px 15px -4px rgba(0, 0, 0, 0.25);\n}\n\n.recipe-box > figcaption {\n  position: absolute;\n  bottom: 0;\n  background-color: rgba(255, 229, 217, 0.9019607843);\n  border-radius: 20px;\n  color: #282828;\n  padding: 10px 15px;\n  width: auto;\n  font-size: 14px;\n}\n\n/* RECIPE VIEW */\n.recipe-name {\n  align-self: center;\n  font-size: 2.25rem;\n}\n\n.recipe-view {\n  align-self: center;\n  width: 60%;\n  min-width: 1200px;\n  display: flex;\n  flex-direction: column;\n  padding: 2em;\n  margin: 2em;\n  border-radius: 1em;\n  background-color: #E8E8E4;\n}\n\n.add-to-saved {\n  align-self: end;\n  cursor: pointer;\n  font-size: 3em;\n  border: none;\n  height: 40px;\n  width: 40px;\n  color: gray;\n  background-color: #E8E8E4;\n}\n\n.recipe-info-row {\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 2em;\n}\n\n.info-box {\n  height: auto;\n  width: 48%;\n  border-radius: 1em;\n}\n\n.instructions-section {\n  margin-top: 4em;\n}\n\n/* RECIPES TO COOK / SAVED RECIPES VIEW */\n#saved-recipes-header {\n  display: flex;\n  text-align: center;\n  width: fit-content;\n}\n\n#search-saved {\n  width: 150px;\n  margin: 10px;\n}\n\n.delete {\n  background-color: rgba(254, 197, 187, 0.9411764706);\n  border: none;\n  border-radius: 45%;\n}\n\n.whole-recipe-box,\n.grocery-list-and-cost {\n  margin: 10px;\n  background-color: #D8E2DC;\n  border-radius: 20px;\n  padding: 5px 25px 20px;\n  box-shadow: 10px 10px 15px -4px rgba(0, 0, 0, 0.25);\n}\n\n.delete-btn {\n  align-self: flex-end;\n}\n\n#saved-view {\n  position: relative;\n}\n\n.grocery-list-and-cost {\n  text-align: center;\n  position: absolute;\n  top: 8vh;\n  right: 0;\n  width: 18vw;\n  height: auto;\n  max-height: 60vh;\n  overflow-y: auto;\n}\n\n.grocery-list {\n  text-align: left;\n}\n\n.hidden {\n  display: none !important;\n}\n\n@media (max-width: 1600px) {\n  .featured {\n    margin-bottom: 5%;\n  }\n}\n@media (max-width: 1300px) {\n  .featured {\n    flex-wrap: wrap;\n  }\n  #user-search {\n    flex-direction: column-reverse;\n    min-width: 230px;\n  }\n  #search-btn {\n    width: 50px;\n    height: 40px;\n  }\n  .recipe-view {\n    min-width: auto;\n  }\n}\n@media (max-width: 1180px) {\n  .nav-pages {\n    flex-direction: column;\n  }\n  #user-input {\n    width: 100%;\n  }\n}\n@media (max-width: 970px) {\n  .recipe-box > img {\n    height: 15vh;\n  }\n  #user-search {\n    min-width: 180px;\n  }\n}\n@media (max-width: 670px) {\n  .recipe-of-the-day {\n    width: 85vw;\n    height: auto;\n  }\n  #user-search {\n    min-width: 130px;\n  }\n  #saved-recipes-header {\n    flex-direction: column;\n  }\n}\n@media (max-width: 550px) {\n  .nav-bar {\n    flex-direction: column-reverse;\n  }\n  .main-title {\n    order: 1;\n  }\n  .nav-pages {\n    align-items: center;\n  }\n}", "",{"version":3,"sources":["webpack://./src/styles.css"],"names":[],"mappings":"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","sourcesContent":["* {\n  font-family: 'Kalam', cursive;\n}\n\nhtml, body {\n  min-height: 100vh;\n}\n\nbody {\n  background-color: #F8EDEB;\n  background-image: url(\"data:image/svg+xml,%3Csvg width='84' height='84' viewBox='0 0 84 84' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fec5bb' fill-opacity='0.49'%3E%3Cpath d='M84 23c-4.417 0-8-3.584-8-7.998V8h-7.002C64.58 8 61 4.42 61 0H23c0 4.417-3.584 8-7.998 8H8v7.002C8 19.42 4.42 23 0 23v38c4.417 0 8 3.584 8 7.998V76h7.002C19.42 76 23 79.58 23 84h38c0-4.417 3.584-8 7.998-8H76v-7.002C76 64.58 79.58 61 84 61V23zM59.05 83H43V66.95c5.054-.5 9-4.764 9-9.948V52h5.002c5.18 0 9.446-3.947 9.95-9H83v16.05c-5.054.5-9 4.764-9 9.948V74h-5.002c-5.18 0-9.446 3.947-9.95 9zm-34.1 0H41V66.95c-5.053-.502-9-4.768-9-9.948V52h-5.002c-5.184 0-9.447-3.946-9.95-9H1v16.05c5.053.502 9 4.768 9 9.948V74h5.002c5.184 0 9.447 3.946 9.95 9zm0-82H41v16.05c-5.054.5-9 4.764-9 9.948V32h-5.002c-5.18 0-9.446 3.947-9.95 9H1V24.95c5.054-.5 9-4.764 9-9.948V10h5.002c5.18 0 9.446-3.947 9.95-9zm34.1 0H43v16.05c5.053.502 9 4.768 9 9.948V32h5.002c5.184 0 9.447 3.946 9.95 9H83V24.95c-5.053-.502-9-4.768-9-9.948V10h-5.002c-5.184 0-9.447-3.946-9.95-9zM50 50v7.002C50 61.42 46.42 65 42 65c-4.417 0-8-3.584-8-7.998V50h-7.002C22.58 50 19 46.42 19 42c0-4.417 3.584-8 7.998-8H34v-7.002C34 22.58 37.58 19 42 19c4.417 0 8 3.584 8 7.998V34h7.002C61.42 34 65 37.58 65 42c0 4.417-3.584 8-7.998 8H50z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\");\n  margin: 0px;\n}\n\nh1, .main-title, h2, .initials {\n  font-family: 'Mogra', cursive;\n  text-shadow: 1px 0px 1px #CCCCCC, 0px 1px 1px #EEEEEE, 2px 1px 1px #CCCCCC, 1px 2px 1px #EEEEEE, 3px 2px 1px #CCCCCC, 2px 3px 1px #EEEEEE, 4px 3px 1px #CCCCCC, 3px 4px 1px #EEEEEE, 5px 4px 1px #CCCCCC, 4px 5px 1px #EEEEEE, 6px 5px 1px #CCCCCC, 5px 6px 1px #EEEEEE, 7px 6px 1px #CCCCCC;\n  text-align: center;\n}\n\n.main-title {\n  font-size: 3rem;\n  margin-top: 5%;\n  color: #282828;\n}\n\nmain {\n  display: flex;\n  flex-direction: column;\n}\n\n/* NAV BAR */\n\n.nav-bar {\n  display: flex;\n  flex-direction: row-reverse;\n  justify-content: space-between;\n  text-align: center;\n}\n\n#user-search {\n  display: flex;\n  justify-content: flex-end;\n  align-items: center;\n  padding: 20px;\n}\n\n#search-input, #search-saved {\n  height: fit-content;\n  align-self: center;\n  border: none;\n  background: #FFD7BA;\n  border-radius: 15px;\n  width: 50%;\n  text-align: center;\n  padding: 5px;\n  box-shadow: 10px 10px 15px -4px rgba(0,0,0,0.22);\n}\n\nfigure {\n  position: relative;\n  display: inline-block;\n  margin: 0;\n}\n\n#user {\n  width: 100px;\n  height: 100px;\n}\n\n#user-initials {\n  padding: 5%;\n  border: 8px solid #D8E2DC;\n  border-radius: 50%;\n  color: #444444;\n  background-color: #F8EDEB;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 42px;\n  margin: 2%;\n  box-shadow: 10px 10px 15px -4px rgba(0,0,0,0.2);\n}\n\n.initials {\n  margin: 0;\n  font-size: 2.125rem;\n}\n\n#search-btn {\n  width: 80px;\n  height: 50px;\n  border: none;\n  padding: 0px;\n  margin-top: 15px;\n  margin-left: 15px;\n  background-color: #F8EDEB;\n  border-radius: 20px 20px 20px 0px;\n  background-image: url(images/search.png);\n  background-size: contain;\n  background-repeat: no-repeat;\n}\n\n.nav-pages {\n  display: flex;\n  align-items: flex-end;\n  margin: 20px;\n}\n\n#home-icon {\n  width: 140px;\n  height: 140px;\n  margin: 10px 20px 10px 10px;\n  border-radius: 30px;\n  background-color: #FEC5BB;\n  background-image: url('images/chef.png');\n  background-size: cover;\n  box-shadow: 10px 10px 15px -4px rgba(0,0,0,0.22);\n}\n\n.nav-btn {\n  width: 180px;\n  height: 40px;\n  font-size: 20px;\n  border: none;\n  color: #282828;\n  background-color: #FEC5BB;\n  margin: 10px;\n  border-radius: 5px;\n  box-shadow: 10px 10px 15px -4px rgba(0,0,0,0.22);\n}\n\n.nav-btn:hover, .nav-btn:focus, .dropdown-categories button:hover, .dropdown-categories button:focus, .delete:hover, .delete:focus, .saved-dropdown-categories button:hover, .saved-dropdown-categories button:focus {\n  cursor: pointer;\n  transform: scale(1.1);\n  transition: .2s ease;\n}\n\n.arrow {\n  width: 20px;\n  position: absolute;\n  bottom: 11px;\n  right: 8px;\n}\n\n#home-icon:hover, .home-banner:hover, #search-btn:hover, .recipe-box:hover {\n  cursor: pointer;\n  opacity: 80%;\n  transition: .2s ease;\n}\n\n#home-icon:hover, #home-icon:focus {\n  background-color: #f8bfb5;\n}\n\n.category-position {\n  position: relative;\n}\n\n#all-categories-dropdown, #all-categories-btn {\n  position: relative;\n}\n\n#all-categories-btn {\n  width: 200px;\n}\n\n.dropdown-categories, .saved-dropdown-categories {\n  position: absolute;\n  border-radius: 10px;\n  top: 3.5rem;\n  left: 10px;\n  background-color: rgb(254, 197, 187);\n  visibility: hidden;\n  opacity: 0;\n  transition: all 0.5s ease;\n  font-size: 1.3rem;\n  z-index: 1;\n  width: 125px;\n  margin: 10px 0;\n  padding: 10px 0 10px 25px;\n}\n\n.dropdown-categories:after,\n.saved-dropdown-categories:after \n {\n  position: absolute;\n  content: '';\n  width: 16px;\n  height: 16px; \n  bottom: 100%;\n  left: 50%;\n  margin-left: -8px;\n  transform: rotate(45deg);\n  margin-bottom: -8px;\n  background-color: rgb(254, 197, 187);\n}\n\n.dropdown-categories button,\n.saved-dropdown-categories button {\n  margin: 0;\n  padding: 0;\n  text-align: left;\n  display: block;\n  background-color: transparent;\n  border: none;\n  font-size: 1.2rem;\n}\n\n.category-position:hover .dropdown-categories,\n.category-position:focus-within .dropdown-categories,\n.category-position:hover .saved-dropdown-categories,\n.category-position:focus-within .saved-dropdown-categories {\n  visibility: visible;\n  opacity: 1;\n}\n\n/* HOME VIEW */\n\n.home-view {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\n.banner-container {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  position:relative;\n  height: 50dvh;\n  margin-top: 5px;\n  margin-bottom: 5px;\n}\n\n.home-banner {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n}\n\n.recipe-of-the-day {\n  height: 370px;\n  border-radius: 40px;\n  box-shadow: 10px 10px 15px -4px rgba(0,0,0,0.25);\n}\n\n.featured {\n  display: flex;\n  justify-content: space-around;\n  width: 75%;\n}\n\n#featured-recipes {\n  width: 100vw;\n  height: auto;\n  border-top: 6px solid #FCD5CE;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  background-color: #d8e2dc;\n  background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='34' height='44' viewBox='0 0 34 44'%3E%3Cg fill='%23e8e8e4' fill-opacity='1'%3E%3Cpath fill-rule='evenodd' d='M1 6.2C.72 5.55.38 4.94 0 4.36v13.28c.38-.58.72-1.2 1-1.84A12.04 12.04 0 0 0 7.2 22 12.04 12.04 0 0 0 1 28.2c-.28-.65-.62-1.26-1-1.84v13.28c.38-.58.72-1.2 1-1.84A12.04 12.04 0 0 0 7.2 44h21.6a12.05 12.05 0 0 0 5.2-4.36V26.36A12.05 12.05 0 0 0 28.8 22a12.05 12.05 0 0 0 5.2-4.36V4.36A12.05 12.05 0 0 0 28.8 0H7.2A12.04 12.04 0 0 0 1 6.2zM17.36 23H12a10 10 0 1 0 0 20h5.36a11.99 11.99 0 0 1 0-20zm1.28-2H24a10 10 0 1 0 0-20h-5.36a11.99 11.99 0 0 1 0 20zM12 1a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-3.46-2a2 2 0 1 0-3.47 2 2 2 0 0 0 3.47-2zm0-4a2 2 0 1 0-3.47-2 2 2 0 0 0 3.47 2zM12 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3.46 2a2 2 0 1 0 3.47-2 2 2 0 0 0-3.47 2zm0 4a2 2 0 1 0 3.47 2 2 2 0 0 0-3.47-2zM24 43a10 10 0 1 0 0-20 10 10 0 0 0 0 20zm0-14a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3.46 2a2 2 0 1 0 3.47-2 2 2 0 0 0-3.47 2zm0 4a2 2 0 1 0 3.47 2 2 2 0 0 0-3.47-2zM24 37a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-3.46-2a2 2 0 1 0-3.47 2 2 2 0 0 0 3.47-2zm0-4a2 2 0 1 0-3.47-2 2 2 0 0 0 3.47 2z'/%3E%3C/g%3E%3C/svg%3E\");\n}\n\n/* SEARCH VIEW */\n\n#search-results-view, .recipe-results-header, #saved-view, .whole-recipe-box {\n  display: flex;\n  align-content: center;\n  flex-direction: column;\n  text-align: center;\n  align-items: center;\n}\n\n.recipe-results, #recipes-to-cook, #all-recipes {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-around;\n  flex-wrap: wrap;\n}\n\n.recipe-results, #recipes-to-cook, #all-recipes {\n  margin: 2% 13% 6% 13%;\n}\n\n#recipes-to-cook {\n  margin: 2% 23% 6% 13%;\n}\n\n.recipe-box {\n  position: relative;\n  display: inline-block;\n  margin: 10px;\n}\n\n.recipe-box > img {\n  border-radius: 10px;\n  height: 20vh;\n  width: fit-content;\n  box-shadow: 10px 10px 15px -4px rgba(0,0,0,0.25);\n}\n\n.recipe-box > figcaption {\n  position: absolute;\n  bottom: 0;\n  background-color: #ffe5d9e6;\n  border-radius: 20px;\n  color: #282828;\n  padding: 10px 15px;\n  width: auto;\n  font-size: 14px;\n}\n\n/* RECIPE VIEW */\n\n.recipe-name {\n  align-self: center;\n  font-size: 2.25rem;\n}\n\n.recipe-view {\n  align-self: center;\n  width: 60%;\n  min-width: 1200px;\n  display: flex;\n  flex-direction: column;\n  padding: 2em;\n  margin: 2em;\n  border-radius: 1em;\n  background-color: #E8E8E4;\n}\n\n.add-to-saved {\n align-self: end;\n cursor: pointer;\n font-size: 3em;\n border: none;\n height: 40px;\n width: 40px;\n color: gray;\n background-color: #E8E8E4;\n}\n\n.recipe-info-row {\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 2em;\n}\n\n.info-box {\n  height: auto;\n  width: 48%;\n  border-radius: 1em;\n}\n\n.instructions-section {\n  margin-top: 4em;\n}\n\n/* RECIPES TO COOK / SAVED RECIPES VIEW */\n\n#saved-recipes-header {\n  display: flex;\n  text-align: center;\n  width: fit-content;\n}\n\n#search-saved {\n  width: 150px;\n  margin: 10px;\n}\n\n.delete {\n  background-color: #fec5bbf0;\n  border: none;\n  border-radius: 45%;\n}\n\n.whole-recipe-box,\n.grocery-list-and-cost {\n  margin: 10px;\n  background-color: #D8E2DC;\n  border-radius: 20px;\n  padding: 5px 25px 20px;\n  box-shadow: 10px 10px 15px -4px rgba(0,0,0,0.25);\n}\n\n.delete-btn {\n  align-self: flex-end;\n}\n\n#saved-view {\n  position: relative;\n}\n\n.grocery-list-and-cost {\n  text-align: center;\n  position: absolute;\n  top: 8vh;\n  right: 0;\n  width: 18vw;\n  height: auto;\n  max-height: 60vh;\n  overflow-y: auto;\n}\n\n.grocery-list {\n  text-align: left;\n}\n\n.hidden {\n  display: none !important;\n}\n\n@media (max-width: 1600px) {\n  .featured {\n    margin-bottom: 5%;\n  }\n}\n\n@media (max-width: 1300px){\n  .featured {\n    flex-wrap: wrap;\n  }\n  #user-search {\n    flex-direction: column-reverse;\n    min-width: 230px;\n  }\n  #search-btn {\n    width: 50px;\n    height: 40px;\n  }\n  .recipe-view {\n    min-width:auto;\n  }\n}\n\n@media (max-width: 1180px){\n  .nav-pages {\n    flex-direction: column;\n  }\n  #user-input {\n    width: 100%;\n  }\n}\n\n@media (max-width: 970px) {\n  .recipe-box > img {\n    height: 15vh;\n  }\n  #user-search {\n    min-width: 180px;\n  }\n}\n\n@media(max-width: 670px) {\n  .recipe-of-the-day {\n    width: 85vw;\n    height: auto;\n  }\n  #user-search {\n    min-width: 130px;\n  }\n  #saved-recipes-header {\n    flex-direction: column;\n  }\n}\n\n@media(max-width: 550px) {\n  .nav-bar {\n    flex-direction: column-reverse;\n  }\n  .main-title {\n    order: 1;\n  }\n  .nav-pages {\n    align-items: center;\n  }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 6 */
/***/ ((module) => {



function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

module.exports = function cssWithMappingToString(item) {
  var _item = _slicedToArray(item, 4),
      content = _item[1],
      cssMapping = _item[3];

  if (!cssMapping) {
    return content;
  }

  if (typeof btoa === "function") {
    // eslint-disable-next-line no-undef
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),
/* 7 */
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),
/* 8 */
/***/ ((module) => {



module.exports = function (url, options) {
  if (!options) {
    // eslint-disable-next-line no-param-reassign
    options = {};
  } // eslint-disable-next-line no-underscore-dangle, no-param-reassign


  url = url && url.__esModule ? url.default : url;

  if (typeof url !== "string") {
    return url;
  } // If url is already wrapped in quotes, remove them


  if (/^['"].*['"]$/.test(url)) {
    // eslint-disable-next-line no-param-reassign
    url = url.slice(1, -1);
  }

  if (options.hash) {
    // eslint-disable-next-line no-param-reassign
    url += options.hash;
  } // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls


  if (/["'() \t\n]/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }

  return url;
};

/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/search.png");

/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/chef.png");

/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "deleteData": () => (/* binding */ deleteData),
/* harmony export */   "getAllData": () => (/* binding */ getAllData),
/* harmony export */   "getData": () => (/* binding */ getData),
/* harmony export */   "postData": () => (/* binding */ postData)
/* harmony export */ });
/* harmony import */ var _scripts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
// =====================================================================
// =========================  FETCH REQUESTS  ==========================
// =====================================================================


const getData = (data) => {
  return fetch(`https://whats-cooking-api.vercel.app/api/v1/${data}`)
      .then(response => response.json())
      .catch(error => console.log("ERROR", error));
};

const postData = (data) => {
  fetch('https://whats-cooking-api.vercel.app/api/v1/usersRecipes', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => response.json())
    .then(resolve => (0,_scripts__WEBPACK_IMPORTED_MODULE_0__.setData)())
    .catch(err => console.log("ERROR", err));
};

const deleteData = (data) => {
  fetch('https://whats-cooking-api.vercel.app/api/v1/usersRecipes', {
    method: 'DELETE',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => response.json())
    .then(resolve => (0,_scripts__WEBPACK_IMPORTED_MODULE_0__.setData)())
    .catch(err => console.log("ERROR", err));
};

const getAllData = () => {
  return Promise.all([ getData('users'), getData('ingredients'), getData('recipes') ]);
};





/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundle.js.map