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
const {
  RedisGetRecipe,
  RedisRecipesSortTitle,
} = require('../middlewares/redis')

// CREATE RECIPES
router.post(
  '/add',
  validationToken,
  recipesValidation,
  recipesController.creatRecipe
)

// GET RECIPES
router.get('/get', RedisGetRecipe, recipesController.getRecipes)

// router.get('/get/:id', RedisGetRecipe, recipesController.searchRecipeById)

// SORT RECIPES BY TITLE (ascending or descending)
router.get(
  '/sort/title',
  RedisRecipesSortTitle,
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
