const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
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

  const blog = new Blog(request.body)
  const result = await blog.save()

  response.status(201).json(result)
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