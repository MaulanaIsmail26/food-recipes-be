const router = require('express').Router()
const {
  signUpValidation,
  GetUserValidation,
  updateValidation,
  changePwValidation,
  deleteUserValidation,
} = require('../middlewares/validation') //import from middlewarres/validation.js
const users = require('../models/users')
const userController = require('../controllers/users')

// CREAT (SIGN UP)
router.post('/add', signUpValidation, userController.postUsers)

// GET USERS
router.get('/get', GetUserValidation, userController.getUsers)

// UPDATE (CHANGE USERS DATA) 
router.patch('/edit/:id', updateValidation, userController.updateUsers)

// CHANGE USER PASSWORD
router.patch(
  '/edit/password/:id',
  changePwValidation,
  userController.changePassword
)

// DELETE USERS
router.delete('/delete', deleteUserValidation, userController.deleteUsers)

module.exports = router // export to food_recipes.js
