const router = require('express').Router()
const db = require('../db') // import dari file ./db.js
const {
  recipesValidation,
  sortTitleValidation,
  sortDateValidation,
  updateRecipesValidation,
  deleteRecipesValidation,
} = require('../middlewares/validation') //import from middlewarres/validation.js

// CREATE RECIPES
router.post('/add', recipesValidation, async (req, res) => {
  try {
    // const getid = await db`SELECT * FROM users WHERE id = ${id}`;
    const { username, title, ingredients, picture, video } = req.body

    const addToDb = await db`
      INSERT INTO recipes (username, title, ingredients, picture, video)
      VALUES (${username}, ${title}, ${ingredients}, ${picture}, ${video})
    `

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
})

// GET RECIPES
router.get('/get', async (req, res) => {
  try {
    const { search } = req.query

    if (search) {
      const getSelectedRecipes =
        await db`SELECT * FROM recipes WHERE title LIKE ${'%' + search + '%'}`

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
      const getAllRecipes = await db`SELECT * FROM recipes`

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
})

// SORT RECIPES BY TITLE (ascending or descending)
router.get('/sort/title', sortTitleValidation, async (req, res) => {
  try {
    // const { sort } = req.params
    const { sort, limit, page } = req.query

    if (sort === 'descending') {
      if (limit || page) {
        const getRecipesSortDescending =
          await db`SELECT * FROM recipes ORDER BY title DESC LIMIT ${limit} OFFSET ${
            page ? limit * (page - 1) : 0
          }`

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
        const getRecipesSortDescending =
          await db`SELECT * FROM recipes ORDER BY title DESC`

        res.status(200).json({
          status: true,
          count: getRecipesSortDescending.length,
          message:
            'Recipes berhasil di urutkan berdasarakan title secara descending',
          data: getRecipesSortDescending,
        })
      }
    } else if (limit || page) {
      const getRecipesSortAscending =
        await db`SELECT * FROM recipes ORDER BY title ASC LIMIT ${limit} OFFSET ${
          page ? limit * (page - 1) : 0
        }`

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
      const getRecipesSortAscending =
        await db`SELECT * FROM recipes ORDER BY title ASC`

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
})

// SORT RECIPES BY DATE (ascending or descending)
router.get('/sort/date', sortDateValidation, async (req, res) => {
  try {
    const { sort, limit, page } = req.query

    if (sort === 'descending') {
      if (limit || page) {
        const getRecipesSortDescending =
          await db`SELECT * FROM recipes ORDER BY date DESC LIMIT ${limit} OFFSET ${
            page ? limit * (page - 1) : 0
          }`

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
        const getRecipesSortDescending =
          await db`SELECT * FROM recipes ORDER BY date DESC`

        res.status(200).json({
          status: true,
          count: getRecipesSortDescending.length,
          message:
            'Recipes berhasil di urutkan berdasarkan tanggal upload terbaru',
          data: getRecipesSortDescending,
        })
      }
    } else if (limit || page) {
      const getRecipesSortAscending =
        await db`SELECT * FROM recipes ORDER BY date ASC LIMIT ${limit} OFFSET ${
          page ? limit * (page - 1) : 0
        }`

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
      const getRecipesSortAscending =
        await db`SELECT * FROM recipes ORDER BY date ASC`

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
})

// UPDATE
router.patch('/edit/:id', updateRecipesValidation, async (req, res) => {
  try {
    const { id } = req.params
    const { title, ingredients, picture, video } = req.body

    const getRecipes = await db`SELECT * FROM recipes WHERE id = ${id}`

    if (getRecipes) {
      await db`
        UPDATE recipes SET
        "title" = ${title || getRecipes[0]?.title},
        "ingredients" = ${ingredients || getRecipes[0]?.ingredients},
        "picture" = ${picture || getRecipes[0]?.picture}, 
        "video" = ${video || getRecipes[0]?.video}
      WHERE "id" = ${id};
      `
    }

    res.json({
      status: true,
      message: 'Resep Berhasil di ubah',
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    })
  }
})

// DELETE
router.delete('/delete', deleteRecipesValidation, async (req, res) => {
  try {
    const { id } = req.query

    await db`DELETE FROM "public"."recipes" WHERE "id" = ${id}`

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
})

module.exports = router // export to food_recipes.js
