const recipe = require('../models/recipes')

// create recipes
const creatRecipe = async (req, res) => {
  try {
    const { username, title, ingredients, picture, video } = req.body

    const addToDb = await recipe.creatRecipe({
      username,
      title,
      ingredients,
      picture,
      video,
    })

    res.json({
      status: true,
      message: 'Recipes berhasil di tambah',
      data: addToDb,
    })
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

      res.status(200).json({
        status: true,
        message: 'Resep berhasil di ambil',
        count: getAllRecipes.length,
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

        if (getRecipesSortDescending.length > 0) {
          res.status(200).json({
            status: true,
            page: parseInt(page),
            limit: parseInt(limit),
            count: getRecipesSortDescending.length,
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

        res.status(200).json({
          status: true,
          count: getRecipesSortDescending.length,
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
      await recipe.updateRecipes({ id, title, ingredients, picture, video })
    }

    res.json({
      status: true,
      message: 'Resep Berhasil di ubah',
    })
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