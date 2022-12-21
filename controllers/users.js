const users = require('../models/users')
const { v4: uuidv4 } = require('uuid')
const path = require('path')
const helper = require('../helper')
require('dotenv').config()
const bcrypt = require('bcrypt')
const saltRounds = 10
const { connect } = require('../middlewares/redis')
const { cloudinary } = require('../helper')

// Create Users account
const postUsers = async (req, res) => {
  try {
    const { name, email, password, phone, photo } = req.body

    const checkDuplicateName = await users.checkName({ name })
    const checkDuplicateEmail = await users.checkEmail({ email })

    if (checkDuplicateName.length > 0) {
      throw { code: 400, message: 'Name is already in use' }
    } else if (checkDuplicateEmail.length > 0) {
      throw { code: 400, message: 'E-mail is already in use' }
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let file = req.files.photo
    // let fileName = `${uuidv4()}-${file.name}`
    // let uploadPath = `${path.dirname(
    //   require.main.filename
    // )}/public/users_profile/${fileName}`
    let mimeType = file.mimetype.split('/')[1]
    let allowFile = ['jpeg', 'jpg', 'png', 'webp']

    // validate size image
    if (file.size > 1048576) {
      throw 'File is too large, maximum 1 mb'
    }

    if (allowFile.find((item) => item === mimeType)) {
      cloudinary.v2.uploader.upload(
        file.tempFilePath,
        { public_id: uuidv4() },
        function (error, result) {
          if (error) {
            throw 'Upload photo failed'
          }

          bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
              throw 'Authentication process failed, please try again'
            }

            // Store hash in your password DB.
            const addToDb = await users.creatUsers({
              name,
              email,
              password: hash,
              phone,
              photo: result.url,
            })

            res.json({
              status: true,
              message: 'Register successful',
              data: addToDb,
              // path: uploadPath,
            })
          })
        }
      )
    } else {
      throw 'Photo upload failed, only accept photo format'
    }
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

      connect.set('url', req.originalUrl, 'ex', 10) // string only
      connect.set('data', JSON.stringify(getSelectedUser), 'ex', 10) // use redis (simpan data kedalam redis)
      connect.set('is_id', 'true', 'ex', 10)

      res.status(200).json({
        status: true,
        message: 'Data berhasil di ambil',
        data: getSelectedUser,
      })
    } else if (limit || page) {
      const getAllUser = await users.getUserPagination({ limit, page }) // PAGINATION

      connect.set('url', req.originalUrl, 'ex', 10) // string only
      connect.set('data', JSON.stringify(getAllUser), 'ex', 10) // use redis (simpan data kedalam redis)
      connect.set('count', getAllUser?.length, 'ex', 10)
      connect.set('page', page, 'ex', 10)
      connect.set('limit', limit, 'ex', 10)
      connect.set('is_paginate', 'true', 'ex', 10)

      if (getAllUser.length > 0) {
        res.status(200).json({
          status: true,
          message: 'Data berhasil di ambil',
          count: getAllUser?.length,
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

      connect.set('url', req.originalUrl, 'ex', 10) // string only
      connect.set('data', JSON.stringify(getAllUser), 'ex', 10) // use redis (simpan data kedalam redis)
      connect.set('count', getAllUser?.length, 'ex', 10)
      connect.set('is_paginate', null, 'ex', 10)

      res.status(200).json({
        status: true,
        message: 'Data berhasil di ambil',
        count: getAllUser?.length,
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
      // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
      let file = req.files.photo
      // let fileName = `${uuidv4()}-${file.name}`
      // let uploadPath = `${path.dirname(
      //   require.main.filename
      // )}/public/users_profile/${fileName}`
      let mimeType = file.mimetype.split('/')[1]
      let allowFile = ['jpeg', 'jpg', 'png', 'webp']

      // validate size image
      if (file.size > 1048576) {
        throw 'File is too large, maximum 1 mb'
      }

      if (allowFile.find((item) => item === mimeType)) {
        cloudinary.v2.uploader.upload(
          file.tempFilePath,
          { public_id: uuidv4() },
          async function (error, result) {
            if (error) {
              throw 'Upload photo failed'
            }
            
            // Store hash in your password DB.
              await users.updateUsers({
                id,
                name,
                email,
                phone,
                photo: result.url,
              })

            res.json({
              status: true,
              message: 'Data Successfully changed',
            })
          }
        )
      } else {
        throw 'Photo upload failed, only accept photo format'
      }
    }
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
