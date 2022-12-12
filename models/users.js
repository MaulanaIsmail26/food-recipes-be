const db = require('../db') // import dari file ./db.js

//* GET USERS
// Get Users by id
const getUserId = async (params) => {
  const { id } = params
  return await db`SELECT * FROM users WHERE id = ${id}`
}

// Get Users with pagination
const getUserPagination = async (params) => {
  const { limit, page } = params
  return await db`SELECT * FROM users LIMIT ${limit} OFFSET ${
    page ? limit * (page - 1) : 0
  }`
}

// Get All Users
const getAllUser = async () => {
  return await db`SELECT * FROM users`
}

//* CREAT (SIGN UP USERS) 
// Check Duplicate Name
const checkName = async (params) => {
  const { name } = params
  return await db`SELECT name FROM users WHERE name = ${name}`
}

// Check Duplicate Email
const checkEmail = async (params) => {
  const { email } = params
  return await db`SELECT email FROM users WHERE email = ${email}`
}

// Creat users
const creatUsers = async (params) => {
  const { name, email, password, phone } = params
  return await db`
      INSERT INTO users (name, email, password, phone)
      VALUES (${name}, ${email}, ${password}, ${phone})
    `
}

//* UPDATE (CHANGE USERS DATA)
// Check Id Users
const checkId = async (params) => {
  const { id } = params
  return await db`SELECT id FROM users WHERE id = ${id}`
}

// Get Users by id
const GetUsersById = async (params) => {
  const { id } = params
  return await db`SELECT * FROM users WHERE id = ${id}`
}

// Update Users
const updateUsers = async (params) => {
  const { id, name, email, phone, photo } = params
  return await db`
        UPDATE users SET
        "name" = ${name},
        "email" = ${email},
        "phone" = ${phone}, 
        "photo" = ${photo} 
      WHERE "id" = ${id};
      `
}

//* CHANGE USER PASSWORD
// Check Id Users
const checkIdUsers = async (params) => {
  const { id } = params
  return await db`SELECT id FROM users WHERE id = ${id}`
}

// Get Users by id
const GetUsersEdit = async (params) => {
  const { id } = params
  return await db`SELECT * FROM users WHERE id = ${id}`
}

// Change Users Password
const changePassword = async (params) => {
  const { id, password } = params
  return await db`
        UPDATE users SET
        "password" = ${password}
      WHERE "id" = ${id};
      `
}

//* DELETE USERS
// Get users by id for deleted
const GetUsersDelete = async (params) => {
  const { id } = params
  return await db`DELETE FROM "public"."users" WHERE "id" = ${id}`
}

module.exports = {
  getUserId,
  getUserPagination,
  getAllUser,
  checkName,
  checkEmail,
  creatUsers,
  checkId,
  GetUsersById,
  updateUsers,
  checkIdUsers,
  GetUsersEdit,
  changePassword,
  GetUsersDelete,
}
