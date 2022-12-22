require('dotenv').config()
const Redis = require('ioredis')

const connect = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASS,
})

const useRedis = async (req, res, next) => {
  try {
    const is_paginate = await connect.get('is_paginate')
    const is_id = await connect.get('is_id')
    const data = await connect.get('data')
    const count = await connect.get('count')
    const page = await connect.get('page')
    const limit = await connect.get('limit')
    const url = await connect.get('url')
    const urlMatch = url === req.originalUrl

    if (urlMatch && data) {
      if (is_paginate) {
        res.status(200).json({
          status: true,
          redis: true,
          message: 'Data berhasil di ambil',
          count: parseInt(count),
          page: parseInt(page),
          limit: parseInt(limit),
          data: JSON.parse(data),
        })
      } else if (is_id) {
        res.status(200).json({
          status: true,
          redis: true,
          message: 'Data berhasil di ambil',
          data: JSON.parse(data),
        })
      } else {
        res.status(200).json({
          status: true,
          redis: true,
          message: 'Data berhasil di ambil',
          count: parseInt(count),
          data: JSON.parse(data),
        })
      }
    } else {
      next()
    }
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    })
  }
}

const RedisGetRecipe = async (req, res, next) => {
  try {
    const is_all_recipes = await connect.get('is_all_recipes')
    const data = await connect.get('data')
    const count = await connect.get('count')
    const url = await connect.get('url')
    const urlMatch = url === req.originalUrl

    if (urlMatch && data) {
      if (is_all_recipes) {
        res.status(200).json({
          status: true,
          redis: true,
          message: 'Resep berhasil di ambil',
          count: parseInt(count),
          data: JSON.parse(data),
        })
      } else {
        res.status(200).json({
          status: true,
          redis: true,
          message: 'Resep berhasil di ambil',
          data: JSON.parse(data),
        })
      }
    } else {
      next()
    }
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    })
  }
}

const RedisRecipesSortTitle = async (req, res, next) => {
  try {
    const is_paginate1 = await connect.get('is_paginate1')
    const is_all_recipes = await connect.get('is_all_recipes')
    const is_paginate2 = await connect.get('is_paginate2')
    const data = await connect.get('data')
    const count = await connect.get('count')
    const page = await connect.get('page')
    const limit = await connect.get('limit')
    const url = await connect.get('url')
    const urlMatch = url === req.originalUrl

    if (urlMatch && data) {
      if (is_paginate1) {
        res.status(200).json({
          status: true,
          redis: true,
          page: parseInt(page),
          limit: parseInt(limit),
          count: parseInt(count),
          message:
            'Recipes berhasil di urutkan berdasarakan title secara descending',
          data: JSON.parse(data),
        })
      } else if (is_all_recipes) {
        res.status(200).json({
          status: true,
          redis: true,
          message:
            'Recipes berhasil di urutkan berdasarakan title secara descending',
          count: parseInt(count),
          data: JSON.parse(data),
        })
      } else if (is_paginate2) {
        res.status(200).json({
          status: true,
          redis: true,
          page: parseInt(page),
          limit: parseInt(limit),
          count: parseInt(count),
          message:
            'Recipes berhasil di urutkan berdasarakan title secara ascending',
          data: JSON.parse(data),
        })
      } else {
        res.status(200).json({
          status: true,
          redis: true,
          message:
            'Recipes berhasil di urutkan berdasarakan title secara ascending',
          count: parseInt(count),
          data: JSON.parse(data),
        })
      }
    } else {
      next()
    }
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    })
  }
}

module.exports = { useRedis, connect, RedisGetRecipe, RedisRecipesSortTitle }
