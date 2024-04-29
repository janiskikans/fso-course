const e2eRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

e2eRouter.post('/reset', async (request, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = e2eRouter