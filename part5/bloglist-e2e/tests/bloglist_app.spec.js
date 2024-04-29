const { test, expect, beforeEach, describe } = require('@playwright/test')
const helper = require('./helper')

describe('Blog app', () => {
  const testUser = {
    "username": "e2e",
    "name": "John Tester",
    "password": "e2epassword"
  }

  beforeEach(async ({ page, request }) => {
    // Prepare app
    await request.post('/api/e2e/reset')
    await request.post('/api/users', { data: testUser })
    await page.goto('/')
  })

  test('login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await helper.loginWith(page, 'e2e', 'e2epassword')
      await expect(page.getByText('John Tester logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await helper.loginWith(page, 'invalidusername', 'invalidpassword')
      await helper.expectNotification(page, 'Invalid username or password')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await helper.loginWith(page, 'e2e', 'e2epassword')
    })
  
    test('a new blog can be created', async ({ page }) => {
      await helper.createNewBlog(page, 'Blog #1', 'John Author', 'http://blog1.test')
      await helper.expectNotification(page, 'a new blog "Blog #1" by John Author added')
      await expect(page.getByText('Blog #1 John Author')).toBeVisible()
    })
  })  
})