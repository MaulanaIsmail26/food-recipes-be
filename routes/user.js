const router = require('express').Router()
const {
  signUpValidation,
  GetUserValidation,
  updateValidation,
  changePwValidation,
  deleteUserValidation,
} = require('../middlewares/validation') //import from middlewarres/validation.js
const { validationToken } = require('../middlewares/webtoken')
const userController = require('../controllers/users')

// CREAT (SIGN UP)
router.post('/add', signUpValidation, userController.postUsers)

// GET USERS
router.get('/get', validationToken, GetUserValidation, userController.getUsers)

// UPDATE (CHANGE USERS DATA)
router.patch(
  '/edit/:id',
  validationToken,
  updateValidation,
  userController.updateUsers
)

// CHANGE USER PASSWORD
router.patch(
  '/edit/password/:id',
  validationToken,
  changePwValidation,
  userController.changePassword
)

// DELETE USERS
router.delete(
  '/delete',
  validationToken,
  deleteUserValidation,
  userController.deleteUsers
)

module.exports = router // export to food_recipes.js
