const User = require('../models/user')
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const app = require('../app')
const userHelper = require('./helpers/userTestHelper')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')

const api = supertest(app)

describe('when there is already 1 user in the database', () => {
  beforeEach(async () => {
    await userHelper.deleteAllUsers()

    const passwordHash = await bcrypt.hash('secretpass', 10)
    const user = new User({ username: 'johndoetest', name: 'John Doe Test', password: passwordHash })

    await user.save()
  })

  describe('user retrieval', () => {
    test('all users are returned', async () => {
      const usersResponse = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const usersInDb = await userHelper.getDbUsers()

      assert.strictEqual(usersResponse.body.length, usersInDb.length)
    })
  })

  describe('new user creation', () => {
    test('user with valid data is created and returned as json', async () => {
      const newUserData = {
        username: 'johndoetest2',
        name: 'John Doe Test2',
        password: 'nicepass'
      }

      const createUserResponse = await api
        .post('/api/users')
        .send(newUserData)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersInDb = await userHelper.getDbUsers()
      assert.strictEqual(usersInDb.length, 2)

      const createdUser = createUserResponse.body
      assert.strictEqual(createdUser.name, newUserData.name)
      assert.strictEqual(createdUser.username, newUserData.username)
      assert.strictEqual(createdUser.password, undefined)
    })

    test('user with no username cannot be created and status 400 is returned', async () => {
      const newUserData = {
        name: 'John Doe Test2',
        password: 'nicepass'
      }

      const createUserResponse = await api
        .post('/api/users')
        .send(newUserData)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(createUserResponse.body.error, 'User validation failed: username: Path `username` is required.')
    })

    test('user with username less than 3 characters cannot be created and status 400 is returned', async () => {
      const newUserData = {
        username: 'jo',
        name: 'John Doe Test2',
        password: 'nicepass'
      }

      const createUserResponse = await api
        .post('/api/users')
        .send(newUserData)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(createUserResponse.body.error, 'User validation failed: username: Path `username` (`jo`) is shorter than the minimum allowed length (3).')
    })

    test('user with no password cannot be created and status 400 is returned', async () => {
      const newUserData = {
        username: 'johndoetest2',
        name: 'John Doe Test2',
      }

      const createUserResponse = await api
        .post('/api/users')
        .send(newUserData)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(createUserResponse.body.error, 'password must be at least 3 characters long')
    })

    test('user with password less than 3 characters cannot be created and status 400 is returned', async () => {
      const newUserData = {
        username: 'johndoetest2',
        name: 'John Doe Test2',
        password: 'pa'
      }

      const createUserResponse = await api
        .post('/api/users')
        .send(newUserData)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(createUserResponse.body.error, 'password must be at least 3 characters long')
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})