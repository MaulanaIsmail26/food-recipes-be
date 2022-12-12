const router = require('express').Router()
const db = require('../db') // import dari file ./db.js
const {
  signUpValidation,
  updateValidation,
  changePwValidation,
  deleteUserValidation,
} = require('../middlewares/validation') //import from middlewarres/validation.js

// CREAT (SIGN UP)
router.post('/add', signUpValidation, async (req, res) => {
  try {
    const { name, email, phone, password } = req.body

    const checkDuplicateName =
      await db`SELECT name FROM users WHERE name = ${name}`
    const checkDuplicateEmail =
      await db`SELECT email FROM users WHERE email = ${email}`

    if (checkDuplicateName.length > 0) {
      throw { code: 400, message: 'Name sudah digunakna' }
    } else if (checkDuplicateEmail.length > 0) {
      throw { code: 400, message: 'Email sudah digunakna' }
    }

    const addToDb = await db`
      INSERT INTO users (name, email, password, phone)
      VALUES (${name}, ${email}, ${password}, ${phone})
    `

    res.json({
      status: true,
      message: 'User Berhasil di tambah',
    })
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    })
  }
})

// GET USERS
router.get('/get', async (req, res) => {
  try {
    const { id, limit, page } = req.query

    if (id) {
      const getSelectedUser = await db`SELECT * FROM users WHERE id = ${id}`

      res.status(200).json({
        status: true,
        message: 'Data berhasil di ambil',
        data: getSelectedUser,
      })
    } else if (limit || page) {
      const getAllUser = await db`SELECT * FROM users LIMIT ${limit} OFFSET ${
        page ? limit * (page - 1) : 0
      }` // PAGINATION

      if (getAllUser.length > 0) {
        res.status(200).json({
          status: true,
          message: 'Data berhasil di ambil',
          count: getAllUser.length,
          page: parseInt(page),
          limit: parseInt(limit),
          data: getAllUser,
        })
      } else {
        res.status(200).json({
          status: true,
          message: 'Data habis',
        })
      }
    } else {
      const getAllUser = await db`SELECT * FROM users`

      res.status(200).json({
        status: true,
        message: 'Data berhasil di ambil',
        count: getAllUser.length,
        data: getAllUser,
      })
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'data gagal di ambil',
      data: [],
    })
  }
})

// UPDATE (CHANGE USERS DATA)
router.patch('/edit/:id', updateValidation, async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, phone, photo } = req.body

    const getUser = await db`SELECT * FROM users WHERE id = ${id}`

    if (getUser) {
      await db`
        UPDATE users SET
        "name" = ${name || getUser[0]?.name},
        "email" = ${email || getUser[0]?.email},
        "phone" = ${phone || getUser[0]?.phone}, 
        "photo" = ${photo || getUser[0]?.photo} 
      WHERE "id" = ${id};
      `
    }

    res.json({
      status: true,
      message: 'Data Berhasil di ubah',
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    })
  }
})

// CHANGE USER PASSWORD
router.patch('/edit/password/:id', changePwValidation, async (req, res) => {
  try {
    const { id } = req.params
    const { password } = req.body

    const getUser = await db`SELECT * FROM users WHERE id = ${id}`

    if (getUser) {
      await db`
        UPDATE users SET
        "password" = ${password}
      WHERE "id" = ${id};
      `
    }

    res.json({
      status: true,
      message: 'Password Berhasil di ubah',
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    })
  }
})

// DELETE USERS
router.delete('/delete', deleteUserValidation, async (req, res) => {
  try {
    const { id } = req.query

    await db`DELETE FROM "public"."users" WHERE "id" = ${id}`

    res.json({
      status: true,
      message: 'User Berhasil di hapus',
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    })
  }
})

module.exports = router // export to food_recipes.js
