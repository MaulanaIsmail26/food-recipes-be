const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const xss = require('xss-clean')
const router = require('./routes/user')
const fileUpload = require('express-fileupload')
const path = require('path')
const port = 8080

const userRoutes = require('./routes/user') // import from routes/user.js
const authRoutes = require('./routes/auth')
const recipeRoutes = require('./routes/recipe') // import from routes/recipe.js

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/x-www-form-urlencoded
app.use(bodyParser.json())

// use helmet
app.use(helmet())

// use xss clean
app.use(xss())

// cors for everyone
app.use(cors())

// const allowedOrigins = ['http://example1.com', 'http://localhost:3000/']
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // (like mobile apps or curl requests)
//       if (!origin) return callback(null, true)
//       if (allowedOrigins.indexOf(origin) === -1) {
//         const msg =
//           'The CORS policy for this site does not' +
//           'allow access from the specified Origin.'
//         return callback(new Error(msg), false)
//       }
//       return callback(null, true)
//     },
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//   })
// )

//* UPLOAD PHOTO
// File Upload image
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
  })
)

//akses public
app.use('/images', express.static(path.join(__dirname, 'public')))

//* USERS ACCOUNT DATA
app.use('/users', userRoutes)

//* LOGIN
app.use('/auth', authRoutes)

//* RECIPES DATA
app.use('/recipes', recipeRoutes)

//* RECIPES DATA
app.get('/', (req, res) => {
  res.json({
    status: true,
    message: "App Running Well",
  })
})

// // COMMENT DATA
// // CREATE COMMENTS
// app.post('/comment/add/:userid?', async (req, res) => {
//   try {
//     const { username, comment } = req.body

//     const addToDb = await db`
//       INSERT INTO comments (username, comment)
//       VALUES (${username}, ${comment})
//     `

//     res.json({
//       status: true,
//       message: 'comment berhasil di tambah',
//       data: addToDb,
//     })
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: error?.message ?? error,
//       data: [],
//     })
//   }
// })

// // GET USERS
// app.get('/comment/:id?', async (req, res) => {
//   try {
//     const { id } = req.params

//     if (id) {
//       const getSelectedComment =
//         await db`SELECT * FROM comments WHERE id = ${id}`

//       res.status(200).json({
//         status: true,
//         message: 'Data berhasil di ambil',
//         data: getSelectedComment,
//       })
//     } else {
//       const getAllComment = await db`SELECT * FROM commentS`

//       res.status(200).json({
//         status: true,
//         message: 'Data berhasil di ambil',
//         data: getAllComment,
//       })
//     }
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: 'data gagal di ambil',
//       data: [],
//     })
//   }
// })

// // CHANGE COMMENTS
// app.patch('/comment/edit/:id', async (req, res) => {
//   try {
//     const { id } = req.params
//     const { comment } = req.body

//     const getComment = await db`SELECT * FROM comments WHERE id = ${id}`

//     if (getComment) {
//       await db`
//         UPDATE comments SET
//         "comment" = ${comment || getComment[0]?.comment}
//       WHERE "id" = ${id};
//       `
//     }

//     res.json({
//       status: true,
//       message: 'Comment Berhasil di ubah',
//     })
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: error?.message ?? error,
//       data: [],
//     })
//   }
// })

// // DELETE
// app.delete('/comment/delete/:id', async (req, res) => {
//   try {
//     const { id } = req.params

//     await db`DELETE FROM "public"."comments" WHERE "id" = ${id}`

//     res.json({
//       status: true,
//       message: 'comment Berhasil di hapus',
//     })
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: error?.message ?? error,
//       data: [],
//     })
//   }
// })
// //* COMMENTS DATA END

// //* VIDEO RECIPES DATA
// // CREATE COMMENTS
// app.post('/video/add', async (req, res) => {
//   try {
//     const { video } = req.body

//     const addToDb = await db`
//       INSERT INTO video_recipes (video)
//       VALUES (${video})
//     `

//     res.json({
//       status: true,
//       message: 'video berhasil di tambah',
//       data: addToDb,
//     })
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: error?.message ?? error,
//       data: [],
//     })
//   }
// })

// // GET VIDEOS
// app.get('/video/:id?', async (req, res) => {
//   try {
//     const { id } = req.params

//     if (id) {
//       const getSelectedVideo =
//         await db`SELECT * FROM video_recipes WHERE id = ${id}`

//       res.status(200).json({
//         status: true,
//         message: 'Data berhasil di ambil',
//         data: getSelectedVideo,
//       })
//     } else {
//       const getAllVideo = await db`SELECT * FROM video_recipes`

//       res.status(200).json({
//         status: true,
//         message: 'Data berhasil di ambil',
//         data: getAllVideo,
//       })
//     }
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: 'data gagal di ambil',
//       data: [],
//     })
//   }
// })

// // CHANGE VIDEOS
// app.patch('/video/edit/:id', async (req, res) => {
//   try {
//     const { id } = req.params
//     const { video } = req.body

//     const getVideo = await db`SELECT * FROM video_recipes WHERE id = ${id}`

//     if (getVideo) {
//       await db`
//         UPDATE video_recipes SET
//         "video" = ${video || getVideo[0]?.video}
//       WHERE "id" = ${id};
//       `
//     }

//     res.json({
//       status: true,
//       message: 'Video Berhasil di ubah',
//     })
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: error?.message ?? error,
//       data: [],
//     })
//   }
// })

// // DELETE
// app.delete('/video/delete/:id', async (req, res) => {
//   try {
//     const { id } = req.params

//     await db`DELETE FROM "public"."video_recipes" WHERE "id" = ${id}`

//     res.json({
//       status: true,
//       message: 'video recipes Berhasil di hapus',
//     })
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: error?.message ?? error,
//       data: [],
//     })
//   }
// })
// //* VIDEO RECIPES DATA END

// menjalankan express pada port variable diatas
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
