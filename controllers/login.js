require('dotenv').config()
const bcrypt = require('bcrypt')
const users = require('../models/users')
const jwt = require('jsonwebtoken')

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const checkEmail = await users.checkEmail({ email })

    // Check Email
    if (checkEmail.length === 0) {
      throw 'login failed, E-mail unregistered'
    }

    bcrypt.compare(password, checkEmail[0].password, (err, result) => {
      try {
        if (err) {
          throw { code: 500, message: 'there is an error on the server' }
        }

        const token = jwt.sign(
          {
            id: checkEmail[0]?.id,
            name: checkEmail[0]?.name,
            email: checkEmail[0]?.email,
            iat: new Date().getTime()
          },
          process.env.JWT_KEY
        )

        if (result) {
          res.status(200).json({
            status: true,
            message: 'login successful',
            data: {
              token,
              profile: checkEmail[0]
            }
          })
        } else {
          throw { code: 400, message: 'login failed, wrong password' }
        }
      } catch (error) {
        res.status(error?.code ?? 500).json({
          status: false,
          message: error?.message ?? error,
          data: [],
        })
      }
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    })
  }
}

module.exports = { login }
