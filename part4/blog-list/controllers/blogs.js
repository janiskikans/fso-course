const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
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

  const user = request.authUser
  const blog = new Blog({ ...request.body, user: user.id })
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', verifyToken, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(204).json()
  }

  if (request.authUser._id.toString() !== blog.user.toString()) {
    return response.status(403).json({ error: 'Forbidden' })
  }

  const deletedBlog = await Blog.findByIdAndDelete(request.params.id)

  response.status(204).json(deletedBlog)
})

blogsRouter.put('/:id', verifyToken, async (request, response) => {
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

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404)
  }

  if (request.authUser._id.toString() !== blog.user.toString()) {
    return response.status(403).json({ error: 'Forbidden' })
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title: body.title, author: body.author, url: body.url, likes: body.likes ?? 0 },
    { new: true, runValidators: true, context: 'query' }
  )

  return response.json(updatedBlog)
})

module.exports = blogsRouter