const recipe = require('../models/recipes')
const { v4: uuidv4 } = require('uuid')
const path = require('path')
const helper = require('../helper')
require('dotenv').config()
const { connect } = require('../middlewares/redis')
const { cloudinary } = require('../helper')

// create recipes
const creatRecipe = async (req, res) => {
  try {
    const { username, title, ingredients, picture, video } = req.body

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let file = req.files.picture
    // let fileName = `${uuidv4()}-${file.name}`
    // let uploadPath = `${path.dirname(require.main.filename)}/public/picture_recipes/${fileName}`
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
            throw 'Upload picture failed'
          }
          // Store hash in your password DB.
          const addToDb = await recipe.creatRecipe({
            username,
            title,
            ingredients,
            picture: result.url,
            video,
          })

          res.json({
            status: true,
            message: 'Recipe add successfully',
            data: addToDb,
            // path: uploadPath,
          })
        }
      )
    } else {
      throw 'picture upload failed, only accept picture format'
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    })
  }
}

// Get recipe
const getRecipes = async (req, res) => {
  try {
    const { search } = req.query

    if (search) {
      const getSelectedRecipes = await recipe.searchRecipe({ search })

      connect.set('url', req.originalUrl, 'ex', 10) // string only
      connect.set('data', JSON.stringify(getSelectedRecipes), 'ex', 10) // use redis (simpan data kedalam redis)
      connect.set('is_all_recipes', null, 'ex', 10)

      if (getSelectedRecipes.length > 0) {
        res.status(200).json({
          status: true,
          message: 'Resep berhasil di ambil',
          data: getSelectedRecipes,
        })
      } else {
        res.status(200).json({
          status: true,
          message: 'Hasil pencarian tidak ada',
        })
      }
    } else {
      const getAllRecipes = await recipe.getAllRecipes()

      connect.set('url', req.originalUrl, 'ex', 10) // string only
      connect.set('data', JSON.stringify(getAllRecipes), 'ex', 10) // use redis (simpan data kedalam redis)
      connect.set('count', getAllRecipes?.length, 'ex', 10)
      connect.set('is_all_recipes', 'true', 'ex', 10)

      res.status(200).json({
        status: true,
        message: 'Resep berhasil di ambil',
        count: getAllRecipes?.length,
        data: getAllRecipes,
      })
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Resep gagal di ambil',
      data: [],
    })
  }
}

// Sort recipe by title
const sortRecipeTitle = async (req, res) => {
  try {
    // const { sort } = req.params
    const { sort, limit, page } = req.query

    if (sort === 'descending') {
      if (limit || page) {
        const getRecipesSortDescending = await recipe.getRecipedbyDesc({
          limit,
          page,
        })

        connect.set('url', req.originalUrl, 'ex', 10) // string only
        connect.set('data', JSON.stringify(getRecipesSortDescending), 'ex', 10) // use redis (simpan data kedalam redis)
        connect.set('count', getRecipesSortDescending?.length, 'ex', 10)
        connect.set('page', page, 'ex', 10)
        connect.set('limit', limit, 'ex', 10)
        connect.set('is_paginate1', 'true', 'ex', 10)

        if (getRecipesSortDescending.length > 0) {
          res.status(200).json({
            status: true,
            page: parseInt(page),
            limit: parseInt(limit),
            count: getRecipesSortDescending?.length,
            message:
              'Recipes berhasil di urutkan berdasarakan title secara descending',
            data: getRecipesSortDescending,
          })
        } else {
          res.status(200).json({
            status: true,
            page: parseInt(page),
            message: 'Recipes habis',
          })
        }
      } else {
        const getRecipesSortDescending = await recipe.sortRecipedbyDesc()

        connect.set('url', req.originalUrl, 'ex', 10) // string only
        connect.set('data', JSON.stringify(getRecipesSortDescending), 'ex', 10) // use redis (simpan data kedalam redis)
        connect.set('count', getRecipesSortDescending?.length, 'ex', 10)
        connect.set('is_all_recipes', 'true', 'ex', 10)

        res.status(200).json({
          status: true,
          count: getRecipesSortDescending?.length,
          message:
            'Recipes berhasil di urutkan berdasarakan title secara descending',
          data: getRecipesSortDescending,
        })
      }
    } else if (limit || page) {
      const getRecipesSortAscending = await recipe.getRecipedbyAsc({
        limit,
        page,
      })

      connect.set('url', req.originalUrl, 'ex', 10) // string only
      connect.set('data', JSON.stringify(getRecipesSortAscending), 'ex', 10) // use redis (simpan data kedalam redis)
      connect.set('count', getRecipesSortAscending?.length, 'ex', 10)
      connect.set('page', page, 'ex', 10)
      connect.set('limit', limit, 'ex', 10)
      connect.set('is_paginate2', 'true', 'ex', 10)

      if (getRecipesSortAscending.length > 0) {
        res.status(200).json({
          status: true,
          page: parseInt(page),
          limit: parseInt(limit),
          count: getRecipesSortAscending.length,
          message:
            'Recipes berhasil di urutkan berdasarakan title secara ascending',
          data: getRecipesSortAscending,
        })
      } else {
        res.status(200).json({
          status: true,
          page: parseInt(page),
          message: 'Recipes habis',
        })
      }
    } else {
      const getRecipesSortAscending = await recipe.sortRecipedbyAsc()

      connect.set('url', req.originalUrl, 'ex', 10) // string only
      connect.set('data', JSON.stringify(getRecipesSortAscending), 'ex', 10) // use redis (simpan data kedalam redis)
      connect.set('count', getRecipesSortAscending?.length, 'ex', 10)
      connect.set('is_all_recipes', null, 'ex', 10)

      res.status(200).json({
        status: true,
        count: getRecipesSortAscending.length,
        message:
          'Recipes berhasil di urutkan berdasarakan title secara ascending',
        data: getRecipesSortAscending,
      })
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    })
  }
}

// Sort recipes by date
const sortRecipesDate = async (req, res) => {
  try {
    const { sort, limit, page } = req.query

    if (sort === 'descending') {
      if (limit || page) {
        const getRecipesSortDescending = await recipe.sortDescDate({
          limit,
          page,
        })

        if (getRecipesSortDescending.length > 0) {
          res.status(200).json({
            status: true,
            page: parseInt(page),
            limit: parseInt(limit),
            count: getRecipesSortDescending.length,
            message:
              'Recipes berhasil di urutkan berdasarkan tanggal upload terbaru',
            data: getRecipesSortDescending,
          })
        } else {
          res.status(200).json({
            status: true,
            page: parseInt(page),
            message: 'Recipes habis',
          })
        }
      } else {
        const getRecipesSortDescending = await recipe.getDescDate()

        res.status(200).json({
          status: true,
          count: getRecipesSortDescending.length,
          message:
            'Recipes berhasil di urutkan berdasarkan tanggal upload terbaru',
          data: getRecipesSortDescending,
        })
      }
    } else if (limit || page) {
      const getRecipesSortAscending = await recipe.sortAscDate({ limit, page })

      if (getRecipesSortAscending.length > 0) {
        res.status(200).json({
          status: true,
          page: parseInt(page),
          limit: parseInt(limit),
          count: getRecipesSortAscending.length,
          message:
            'Recipes berhasil di urutkan berdasarkan tanggal upload terlama',
          data: getRecipesSortAscending,
        })
      } else {
        res.status(200).json({
          status: true,
          page: parseInt(page),
          message: 'Recipes habis',
        })
      }
    } else {
      const getRecipesSortAscending = await recipe.geetAscDate()

      res.status(200).json({
        status: true,
        count: getRecipesSortAscending.length,
        message:
          'Recipes berhasil di urutkan berdasarkan tanggal upload terlama',
        data: getRecipesSortAscending,
      })
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    })
  }
}

// Update recipes
const updateRecipes = async (req, res) => {
  try {
    const { id } = req.params
    const { title, ingredients, picture, video } = req.body

    const checkIdUser = await recipe.checkIdRecipes({ id })

    if (checkIdUser.length != 1) {
      throw { code: 400, message: `User dengan Id ${id} tidak ada` }
    }

    const getRecipes = await recipe.getRecipesById({ id })

    if (getRecipes) {
      // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
      let file = req.files.picture
      // let fileName = `${uuidv4()}-${file.name}`
      // let uploadPath = `${path.dirname(
      //   require.main.filename
      // )}/public/picture_recipes/${fileName}`
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
              throw 'Upload picture failed'
            }

          // Store hash in your password DB.
          await recipe.updateRecipes({
            id,
            title,
            ingredients,
            picture: result.url,
            video,
          })

          res.json({
            status: true,
            message: 'Resep Berhasil di ubah',
            // path: uploadPath,
          })
          }
        )
      } else {
        throw 'picture upload failed, only accept picture format'
      }
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
    })
  }
}

// Delete recipe
const deleteRecipes = async (req, res) => {
  try {
    const { id } = req.query

    await recipe.deleteRecipes({ id })

    res.json({
      status: true,
      message: 'Resep Berhasil di hapus',
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
  creatRecipe,
  getRecipes,
  sortRecipeTitle,
  sortRecipesDate,
  updateRecipes,
  deleteRecipes,
}
