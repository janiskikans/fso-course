const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const { requestLogger, errorHandler } = require('./utils/middleware')
require('express-async-errors')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')

mongoose.set('strictQuery', false)
logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())

if (process.env.NODE_ENV !== 'test') {
  app.use(requestLogger())
}

// Routers
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

app.use(errorHandler)

module.exports = app