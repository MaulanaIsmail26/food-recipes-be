const router = require('express').Router()
const {
  recipesValidation,
  sortTitleValidation,
  sortDateValidation,
  updateRecipesValidation,
  deleteRecipesValidation,
} = require('../middlewares/validation') //import from middlewarres/validation.js
const { validationToken } = require('../middlewares/webtoken')
const recipesController = require('../controllers/recipes')

// CREATE RECIPES
router.post(
  '/add',
  validationToken,
  recipesValidation,
  recipesController.creatRecipe
)

// GET RECIPES
router.get('/get', recipesController.getRecipes)

// SORT RECIPES BY TITLE (ascending or descending) 
router.get(
  '/sort/title',
  sortTitleValidation,
  recipesController.sortRecipeTitle
)

// SORT RECIPES BY DATE (ascending or descending)
router.get('/sort/date', sortDateValidation, recipesController.sortRecipesDate)

// UPDATE
router.patch(
  '/edit/:id',
  validationToken,
  updateRecipesValidation,
  recipesController.updateRecipes
)

// DELETE
router.delete(
  '/delete',
  validationToken,
  deleteRecipesValidation,
  recipesController.deleteRecipes
)

module.exports = router // export to food_recipes.js
