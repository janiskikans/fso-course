const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const blogHelper = require('./helpers/blogTestHelper')
const userHelper = require('./helpers/userTestHelper')
const Blog = require('../models/blog')

const api = supertest(app)

describe('when there already are some blogs saved', () => {
  beforeEach(async () => {
    await blogHelper.deleteAllBlogs()
    await userHelper.deleteAllUsers()

    const user = await userHelper.createUser()

    for (let blog of blogHelper.initialBlogs) {
      let blogObject = new Blog({ ...blog, user: user.id })
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

      const user = await userHelper.createUser('johndoetest2')
      const token = userHelper.getToken(user)

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set({ 'Authorization': `Bearer ${token}` })
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const allBlogsResponse = await api.get('/api/blogs')
      assert.strictEqual(allBlogsResponse.body.length, blogHelper.initialBlogs.length + 1)
    })

    test('a blog with 0 likes is created if no likes property is passed', async () => {
      const newBlog = {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      }

      const user = await userHelper.createUser('johndoetest2')
      const token = userHelper.getToken(user)

      const createdBlogResponse = await api
        .post('/api/blogs')
        .set({ 'Authorization': `Bearer ${token}` })
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

      const user = await userHelper.createUser('johndoetest2')
      const token = userHelper.getToken(user)

      const createdBlogResponse = await api
        .post('/api/blogs')
        .set({ 'Authorization': `Bearer ${token}` })
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

      const user = await userHelper.createUser('johndoetest2')
      const token = userHelper.getToken(user)

      const createdBlogResponse = await api
        .post('/api/blogs')
        .set({ 'Authorization': `Bearer ${token}` })
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(createdBlogResponse.body.error, 'title missing')
    })

    test('401 status is returned if no Bearer token is passed', async () => {
      const newBlog = {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
      }

      const createResponse = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(createResponse.body.error, 'token invalid')
    })
  })

  describe('blog deletion', () => {
    test('existing blog can be deleted and total blog count is reduced by 1', async () => {
      const user = await userHelper.createUser('johndoetest2')
      const token = userHelper.getToken(user)
      const userBlog = await blogHelper.createBlog(user.id)

      await api
        .delete(`/api/blogs/${userBlog._id.toString()}`)
        .set({ 'Authorization': `Bearer ${token}` })
        .expect(204)

      const allBlogsResponse = await api.get('/api/blogs')

      // In the end blog count should stay the same as blog was added and deleted
      assert.strictEqual(allBlogsResponse.body.length, blogHelper.initialBlogs.length)
    })

    test('204 response is returned and no actual blogs are deleted if a non-existing blog is deleted', async () => {
      const nonExistingId = await blogHelper.getNonExistingId()

      const user = await userHelper.createUser('johndoetest2')
      const token = userHelper.getToken(user)

      await api
        .delete(`/api/blogs/${nonExistingId}`)
        .set({ 'Authorization': `Bearer ${token}` })
        .expect(204)

      const allBlogsResponse = await api.get('/api/blogs')

      assert.strictEqual(allBlogsResponse.body.length, blogHelper.initialBlogs.length)
    })

    test('403 response is returned if another user blog is being deleted', async () => {
      const ownerUser = await userHelper.createUser('johndoetest2')
      const userBlog = await blogHelper.createBlog(ownerUser.id)

      const otherUser = await userHelper.createUser('johndoetest3')
      const token = userHelper.getToken(otherUser)

      const deleteResponse = await api
        .delete(`/api/blogs/${userBlog._id.toString()}`)
        .set({ 'Authorization': `Bearer ${token}` })
        .expect(403)

      assert.strictEqual(deleteResponse.body.error, 'Forbidden')
    })
  })

  describe('blog updating', () => {
    test('blog likes are updated but other properties stay the same', async () => {
      const user = await userHelper.createUser('johndoetest2')
      const token = userHelper.getToken(user)
      const userBlog = await blogHelper.createBlog(user.id)

      const updatedBlogResponse = await api
        .put(`/api/blogs/${userBlog.id}`)
        .set({ 'Authorization': `Bearer ${token}` })
        .send({
          title: userBlog.title,
          author: userBlog.author,
          url: userBlog.url,
          likes: userBlog.likes + 1,
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const updatedBlog = updatedBlogResponse.body
      assert.strictEqual(updatedBlog.likes, userBlog.likes + 1)
      assert.strictEqual(updatedBlog.title, userBlog.title)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})