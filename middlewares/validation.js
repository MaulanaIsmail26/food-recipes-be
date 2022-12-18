const { Validator, addCustomMessages, extend } = require('node-input-validator')
const db = require('../db') // import dari file ./db.js

//* USERS DATA
// Sign Up
const signUpValidation = (req, res, next) => {
  addCustomMessages({
    'name.required': 'Name is required',
    'name.minLength': 'Name must be more than 5 letters ',
    'name.maxLength': 'Maximum name must be less than 35 letters',
    'email.required': 'Email is required',
    'email.minLength': 'Email must be more than 3 letters',
    'email.maxLength': 'Maximum email must be less than 50 letters',
    'email.email': 'Email must contain a valid email',
    'phone.required': 'Phone number is required',
    'phone.minLength': 'Phone number must be more than 6 number',
    'phone.maxLength': 'Maximum phone number must be less than 15 number',
    'phone.phoneNumber': 'Phone number must be a valid number',
    'password.required': 'Password is required',
    'password.minLength': 'password must be more than 8 letters',
  })

  const rules = new Validator(req.body, {
    name: 'required|minLength:5|maxLength:35',
    email: 'required|minLength:3|maxLength:50|email',
    phone: 'required|minLength:6|maxLength:15|phoneNumber',
    password: 'required|minLength:8|alphaNumeric',
  })

  rules.check().then(function (success) {
    if (success) {
      next()
    } else {
      res.status(500).json({
        status: false,
        message: rules.errors,
      })
    }
  })
}

// Get Users
const GetUserValidation = (req, res, next) => {
  extend('checkId', async ({ value }) => {
    const getId = await db`SELECT id FROM users WHERE id = ${value}`
    if (getId.length > 0) {
      return true
    }
    return false
  })

  const rules = new Validator(req.query, {
    id: 'checkId',
  })

  rules.check().then(function (success) {
    if (success) {
      next()
    } else {
      res.status(400).json({
        status: true,
        message: `User dengan id tersebut tidak ada`,
      })
    }
  })
}

// Update Users
const updateValidation = (req, res, next) => {
  // extend('pijar', ({ value }) => {
  //   if (value != 'pijar') {
  //     return false
  //   }
  //   return true
  // })

  addCustomMessages({
    'name.minLength': 'Name must be more than 5 letters ',
    'name.maxLength': 'Maximum name must be less than 35 letters',
    'email.minLength': 'Email must be more than 3 letters',
    'email.maxLength': 'Maximum email must be less than 50 letters',
    'email.email': 'Email must contain a valid email',
    'phone.minLength': 'Phone number must be more than 6 number',
    'phone.maxLength': 'Maximum phone number must be less than 15 number',
    'phone.phoneNumber': 'Phone number must be a valid number',
    'photo.url': 'Must contain a valid URL',
  })

  const rules = new Validator(req.body, {
    name: 'minLength:5|maxLength:35',
    email: 'minLength:3|maxLength:50|email',
    phone: 'minLength:6|maxLength:15|phoneNumber',
    photo: 'url',
  })

  rules.check().then(function (success) {
    if (success) {
      next()
    } else {
      res.status(500).json({
        status: false,
        message: rules.errors,
      })
    }
  })
}

// Change Password Users
const changePwValidation = (req, res, next) => {
  addCustomMessages({
    'password.required': 'Password is required',
    'password.minLength': 'password must be more than 8 letters',
  })

  const rules = new Validator(req.body, {
    password: 'required|minLength:8|alphaNumeric',
  })

  rules.check().then(function (success) {
    if (success) {
      next()
    } else {
      res.status(500).json({
        status: false,
        message: rules.errors,
      })
    }
  })
}

// Delete Users
const deleteUserValidation = (req, res, next) => {
  extend('checkId', async ({ value }) => {
    const getId = await db`SELECT id FROM users WHERE id = ${value}`
    if (getId.length > 0) {
      return true
    }
    return false
  })

  addCustomMessages({
    'id.required': 'id is required',
    'id.checkId': 'id doesnt exist',
  })

  const rules = new Validator(req.query, {
    id: 'required|checkId',
  })

  rules.check().then(function (success) {
    if (success) {
      next()
    } else {
      res.status(500).json({
        status: false,
        message: rules.errors,
      })
    }
  })
}

//* RECIPES DATA
// Create Recipes
const recipesValidation = (req, res, next) => {
  // extend('pijar', ({ value }) => {
  //   if (value != 'pijar') {
  //     return false
  //   }
  //   return true
  // })

  addCustomMessages({
    'username.required': 'username is required',
    'username.minLength': 'username must be more than 5 letters ',
    'username.maxLength': 'Maximum username must be less than 35 letters',
    'title.required': 'title is required',
    'title.minLength': 'title must be more than 3 letters',
    'title.maxLength': 'Maximum title must be less than 70 letters',
    'ingredients.required': 'ingredients is required',
    'ingredients.minLength': 'ingredients must be more than 3 number',
    // 'picture.required': 'picture is required',
    'video.required': 'video is required',
    'video.url': 'Must contain a valid URL',
  })

  const rules = new Validator(req.body, {
    username: 'required|minLength:5|maxLength:35',
    title: 'required|minLength:3|maxLength:70',
    ingredients: 'required|minLength:3',
    // picture: 'required',
    video: 'required|url',
  })

  rules.check().then(function (success) {
    if (success) {
      next()
    } else {
      res.status(500).json({
        status: false,
        message: rules.errors,
      })
    }
  })
}

// Sort Title Recipes
const sortTitleValidation = (req, res, next) => {
  extend('descending', ({ value }) => {
    if (value != 'descending') {
      return false
    }
    return true
  })

  addCustomMessages({
    'sort.descending': 'Input should be descending',
    limit: 'Limit must be a number',
    page: 'page must be a number',
  })

  const rules = new Validator(req.query, {
    sort: 'descending',
    limit: 'numeric',
    page: 'numeric',
  })

  rules.check().then(function (success) {
    if (success) {
      next()
    } else {
      res.status(500).json({
        status: false,
        message: rules.errors,
      })
    }
  })
}

// Sort Date Recipes
const sortDateValidation = (req, res, next) => {
  extend('descending', ({ value }) => {
    if (value != 'descending') {
      return false
    }
    return true
  })

  addCustomMessages({
    'sort.descending': 'Input should be descending',
    limit: 'Limit must be a number',
    page: 'page must be a number',
  })

  const rules = new Validator(req.query, {
    sort: 'descending',
    limit: 'numeric',
    page: 'numeric',
  })

  rules.check().then(function (success) {
    if (success) {
      next()
    } else {
      res.status(500).json({
        status: false,
        message: rules.errors,
      })
    }
  })
}

// Update Recipes
const updateRecipesValidation = (req, res, next) => {
  // extend('pijar', ({ value }) => {
  //   if (value != 'pijar') {
  //     return false
  //   }
  //   return true
  // })

  addCustomMessages({
    'title.minLength': 'title must be more than 3 letters',
    'title.maxLength': 'Maximum title must be less than 70 letters',
    'ingredients.minLength': 'ingredients must be more than 3 number',
    // 'picture.url': 'Must contain a valid URL',
    'video.url': 'Must contain a valid URL',
  })

  const rules = new Validator(req.body, {
    title: 'minLength:3|maxLength:70',
    ingredients: 'minLength:3',
    // picture: 'url',
    video: 'url',
  })

  rules.check().then(function (success) {
    if (success) {
      next()
    } else {
      res.status(500).json({
        status: false,
        message: rules.errors,
      })
    }
  })
}

// Delete Recipes
const deleteRecipesValidation = (req, res, next) => {
  extend('checkId', async ({ value }) => {
    const getId = await db`SELECT * FROM recipes WHERE id = ${value}`
    if (getId.length > 0) {
      return true
    }
    return false
  })

  addCustomMessages({
    'id.required': 'id is required',
    'id.checkId': 'id doesnt exist',
  })

  const rules = new Validator(req.query, {
    id: 'required|checkId',
  })

  rules.check().then(function (success) {
    if (success) {
      next()
    } else {
      res.status(500).json({
        status: false,
        message: rules.errors,
      })
    }
  })
}

module.exports = {
  signUpValidation,
  GetUserValidation,
  updateValidation,
  changePwValidation,
  deleteUserValidation,
  recipesValidation,
  sortTitleValidation,
  sortDateValidation,
  updateRecipesValidation,
  deleteRecipesValidation,
} // export to routes/user.js
