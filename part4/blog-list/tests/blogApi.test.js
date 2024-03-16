const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const blogHelper = require('./blogTestHelper')
const Blog = require('../models/blog')

const api = supertest(app)

describe('when there already are some blogs saved', () => {
  beforeEach(async () => {
    await blogHelper.deleteAllBlogs()

    for (let blog of blogHelper.initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
  })

  describe('blog retrieval', () => {
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('there are two blogs', async () => {
      const response = await api.get('/api/blogs')

      assert.strictEqual(response.body.length, 2)
    })

    test('blog model id matches _id', async () => {
      const newBlog = new Blog({
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
      })

      await newBlog.save()

      const response = await api.get('/api/blogs')
      const blog = response.body[2]

      assert.strictEqual(blog.id, newBlog._id.toString())
    })
  })

  describe('blog creation', () => {
    test('a blog can be created, is returned and total blog count is increased by one', async () => {
      const newBlog = {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
      }

      const createdBlogResponse = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const createdBlog = createdBlogResponse.body
      const blogsInDb = await blogHelper.getDbBlogs()
      assert.deepStrictEqual(createdBlog, blogsInDb[2])

      const allBlogsResponse = await api.get('/api/blogs')
      assert.strictEqual(allBlogsResponse.body.length, blogHelper.initialBlogs.length + 1)
    })

    test('a blog with 0 likes is created if no likes property is passed', async () => {
      const newBlog = {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      }

      const createdBlogResponse = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const createdBlog = createdBlogResponse.body
      assert.strictEqual(createdBlog.likes, 0)
    })

    test('a blog with missing url is not created and server responds with 400', async () => {
      const newBlog = {
        title: 'First class tests',
        author: 'Robert C. Martin',
      }

      const createdBlogResponse = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(createdBlogResponse.body.error, 'url missing')
    })

    test('a blog with missing title is not created and server responds with 400', async () => {
      const newBlog = {
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      }

      const createdBlogResponse = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(createdBlogResponse.body.error, 'title missing')
    })
  })

  describe('blog deletion', () => {
    test('existing blog can be deleted and total blog count is reduced by 1', async () => {
      const existingBlogs = await blogHelper.getDbBlogs()

      await api
        .delete(`/api/blogs/${existingBlogs[0].id}`)
        .expect(204)

      const allBlogsResponse = await api.get('/api/blogs')
      assert.strictEqual(allBlogsResponse.body.length, blogHelper.initialBlogs.length - 1)
    })

    test('204 response is returned and no actual blogs are deleted if a non-existing blog is deleted', async () => {
      const nonExistingId = await blogHelper.getNonExistingId()

      await api
        .delete(`/api/blogs/${nonExistingId}`)
        .expect(204)

      const allBlogsResponse = await api.get('/api/blogs')
      assert.strictEqual(allBlogsResponse.body.length, blogHelper.initialBlogs.length)
    })
  })

  describe('blog updating', () => {
    test('blog likes are updated but other properties stay the same', async () => {
      const existingBlogs = await blogHelper.getDbBlogs()
      const existingBlog = existingBlogs[0]

      const updatedBlogResponse = await api
        .put(`/api/blogs/${existingBlog.id}`)
        .send({
          title: 'React patterns',
          author: 'Michael Chan',
          url: 'https://reactpatterns.com/',
          likes: existingBlog.likes + 1,
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const updatedBlog = updatedBlogResponse.body
      assert.strictEqual(updatedBlog.likes, existingBlog.likes + 1)
      assert.strictEqual(updatedBlog.title, existingBlog.title)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})