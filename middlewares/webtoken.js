require('dotenv').config()
const jwt = require('jsonwebtoken')

const validationToken = (req, res, next) => {
  try {
    const { authorization } = req.headers
    if (authorization) {
      jwt.verify(
        authorization.replace('Bearer ', ''),
        process.env.JWT_KEY,
        (err, decoded) => {
          if (err) {
            throw { code: 401, message: 'Token error, please try again' }
          }
          next()
        }
      )
    } else {
      throw { code: 401, message: 'No token provided' }
    }
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    })
  }
}

module.exports = { validationToken }
