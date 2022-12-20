const router = require('express').Router()
const { validationLogin } = require('../middlewares/validation') //import from middlewarres/validation.js
const authController = require('../controllers/login')

// CHANGE USER PASSWORD
router.post('/login', validationLogin, authController.login)

module.exports = router // export to food_recipes.js
