const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { verifyToken } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', verifyToken, async (request, response) => {
  const body = request.body
  if (!body.url) {
    return response.status(400).json({ error: 'url missing' })
  }

  if (!body.author) {
    return response.status(400).json({ error: 'author missing' })
  }

  if (!body.title) {
    return response.status(400).json({ error: 'title missing' })
  }

  const user = await User.findById(request.authUserId)

  const blog = new Blog({ ...request.body, user: user.id })
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const deletedBlog = await Blog.findByIdAndDelete(request.params.id)

  response.status(204).json(deletedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  if (!body.url) {
    return response.status(400).json({ error: 'url missing' })
  }

  if (!body.author) {
    return response.status(400).json({ error: 'author missing' })
  }

  if (!body.title) {
    return response.status(400).json({ error: 'title missing' })
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title: body.title, author: body.author, url: body.url, likes: body.likes ?? 0 },
    { new: true, runValidators: true, context: 'query' }
  )

  return response.json(updatedBlog)
})

module.exports = blogsRouter