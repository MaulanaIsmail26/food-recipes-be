const db = require('../db') // import dari file ./db.js

//* CREAT RECIPES
// creat recipe
const creatRecipe = async (params) => {
  const { username, title, ingredients, picture, video } = params
  return await db`
      INSERT INTO recipes (username, title, ingredients, picture, video)
      VALUES (${username}, ${title}, ${ingredients}, ${picture}, ${video})
    `
}

//* GET RECIPES
// search recipe by name
const searchRecipe = async (params) => {
  const { search } = params
  return await db`SELECT * FROM recipes WHERE title LIKE ${'%' + search + '%'}`
}

// Get All recipes
const getAllRecipes = async () => {
  return await db`SELECT * FROM recipes`
}

//* SORT RECIPES BY TITLE (ascending or descending) 
// sort title descending and pagination
const getRecipedbyDesc = async (params) => {
  const { limit, page } = params
  return await db`SELECT * FROM recipes ORDER BY title DESC LIMIT ${limit} OFFSET ${
    page ? limit * (page - 1) : 0
  }`
}

// sort title descending
const sortRecipedbyDesc = async () => {
  return await db`SELECT * FROM recipes ORDER BY title DESC`
}

// sort title ascending and pagination
const getRecipedbyAsc = async (params) => {
  const { limit, page } = params
  return await db`SELECT * FROM recipes ORDER BY title ASC LIMIT ${limit} OFFSET ${
    page ? limit * (page - 1) : 0
  }`
}

// sort title ascending
const sortRecipedbyAsc = async () => {
  return await db`SELECT * FROM recipes ORDER BY title ASC`
}

//* SORT RECIPES BY DATE (ascending or descending)
// sort date descending and pagination
const sortDescDate = async (params) => {
  const { limit, page } = params
  return await db`SELECT * FROM recipes ORDER BY date DESC LIMIT ${limit} OFFSET ${
    page ? limit * (page - 1) : 0
  }`
}

// sort title descending
const getDescDate = async () => {
  return await db`SELECT * FROM recipes ORDER BY date DESC`
}

// sort title ascending and pagination
const sortAscDate = async (params) => {
  const { limit, page } = params
  return await db`SELECT * FROM recipes ORDER BY date ASC LIMIT ${limit} OFFSET ${
    page ? limit * (page - 1) : 0
  }`
}

// sort title ascending
const geetAscDate = async () => {
  return await db`SELECT * FROM recipes ORDER BY date ASC`
}

//* UPDATE RECIPES
// check recipes id
const checkIdRecipes = async (params) => {
  const { id } = params
  return await db`SELECT id FROM recipes WHERE id = ${id}`
}

// get recipes
const getRecipesById = async (params) => {
  const { id } = params
  return await db`SELECT * FROM recipes WHERE id = ${id}`
}

// Uodate recipes
const updateRecipes = async (params) => {
  const { id, title, ingredients, picture, video } = params
  return await db`
        UPDATE recipes SET
        "title" = ${title},
        "ingredients" = ${ingredients},
        "picture" = ${picture}, 
        "video" = ${video}
      WHERE "id" = ${id};
      `
}

const deleteRecipes = async (params) => {
  const { id } = params
  return await db`DELETE FROM "public"."recipes" WHERE "id" = ${id}`
}

module.exports = {
  creatRecipe,
  searchRecipe,
  getAllRecipes,
  getRecipedbyDesc,
  sortRecipedbyDesc,
  getRecipedbyAsc,
  sortRecipedbyAsc,
  sortDescDate,
  getDescDate,
  sortAscDate,
  geetAscDate,
  checkIdRecipes,
  getRecipesById,
  updateRecipes,
  deleteRecipes,
}
