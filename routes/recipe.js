const router = require('express').Router()
const {
  recipesValidation,
  sortTitleValidation,
  sortDateValidation,
  updateRecipesValidation,
  deleteRecipesValidation,
} = require('../middlewares/validation') //import from middlewarres/validation.js
const recipesController = require('../controllers/recipes')

// CREATE RECIPES
router.post('/add', recipesValidation, recipesController.creatRecipe)

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
router.patch('/edit/:id', updateRecipesValidation, recipesController.updateRecipes)

// DELETE
router.delete('/delete', deleteRecipesValidation, recipesController.deleteRecipes)

module.exports = router // export to food_recipes.js
