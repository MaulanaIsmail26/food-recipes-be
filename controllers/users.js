const users = require('../models/users')

// Create Users account
const postUsers = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body

    const checkDuplicateName = await users.checkName({ name })
    const checkDuplicateEmail = await users.checkEmail({ email })

    if (checkDuplicateName.length > 0) {
      throw { code: 400, message: 'Name sudah digunakan' }
    } else if (checkDuplicateEmail.length > 0) {
      throw { code: 400, message: 'Email sudah digunakan' }
    }

    await users.creatUsers({ name, email, password, phone })

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
}

// Get Users
const getUsers = async (req, res) => {
  try {
    const { id, limit, page } = req.query

    if (id) {
      const getSelectedUser = await users.getUserId({ id })

      res.status(200).json({
        status: true,
        message: 'Data berhasil di ambil',
        data: getSelectedUser,
      })
    } else if (limit || page) {
      const getAllUser = await users.getUserPagination({ limit, page }) // PAGINATION

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
      const getAllUser = await users.getAllUser()

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
}

// Update Users
const updateUsers = async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, phone, photo } = req.body

    const checkIdUser = await users.checkId({ id })

    if (checkIdUser.length != 1) {
      throw { code: 400, message: `User dengan Id ${id} tidak ada` }
    }

    const getUser = await users.getUserId({ id })

    if (getUser) {
      await users.updateUsers({ id, name, email, phone, photo })
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
}

// Change users password 
const changePassword = async (req, res) => {
  try {
    const { id } = req.params
    const { password } = req.body

    const checkIdUser = await users.checkIdUsers({ id })

    if (checkIdUser.length != 1) {
      throw { code: 400, message: `User dengan Id ${id} tidak ada` }
    }

    const getUser = await users.GetUsersEdit({ id })

    if (getUser) {
      await users.changePassword({ id, password })
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
}

// Delete users
const deleteUsers = async (req, res) => {
  try {
    const { id } = req.query

    await users.GetUsersDelete({ id })
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
}

module.exports = {
  postUsers,
  getUsers,
  updateUsers,
  changePassword,
  deleteUsers,
}
