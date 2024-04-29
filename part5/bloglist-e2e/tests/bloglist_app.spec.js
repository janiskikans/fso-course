const { test, expect, beforeEach, describe } = require('@playwright/test')
const helper = require('./helper')

describe('Blog app', () => {
  const testUser = {
    'username': 'e2e',
    'name': 'John Tester',
    'password': 'e2epassword',
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
      await helper.createNewBlog(page)
      await helper.expectNotification(page, 'a new blog "Blog #1" by John Author added')
      await expect(page.getByText('Blog #1 John Author')).toBeVisible()
    })

    describe('and 1 blog exists', () => {
      beforeEach(async ({ page }) => {
        await helper.createNewBlog(page)
      })

      test('blog can be liked and like count increases', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText('likes 0')).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('blog can be deleted', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText('Blog #1 John Author')).toBeVisible()
        page.on('dialog', async dialog => {
          await dialog.accept()
        });
        await page.getByRole('button', { name: 'remove' }).click()
        await expect(page.getByText('Blog #1 John Author')).toBeHidden()
      })

      test('only user that created blog can see "remove" button', async ({ page, request }) => {
        // Second user
        await request.post('/api/users', {
          data: {
            'username': 'e2e-second',
            'name': 'John Tester Second',
            'password': 'e2epassword',
          }
        })

        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
        await page.getByRole('button', { name: 'logout' }).click()
        await helper.loginWith(page, 'e2e-second', 'e2epassword')
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'remove' })).toBeHidden()
      })
    })

    describe('and 2 blogs exist', () => {
      beforeEach(async ({ page }) => {
        await helper.createNewBlog(page)
        await helper.createNewBlog(page, 'Blog #2', 'Mary Author')
      })

      test('blog with the most likes is displayed first', async ({ page }) => {
        const firstBlog = await page.getByText('Blog #1 John Author')
        const firstBlogLocator = await firstBlog.locator('..')

        const secondBlog = await page.getByText('Blog #2 Mary Author')
        const secondBlogLocator = await secondBlog.locator('..')

        // Open details for both blogs and like the second one
        await firstBlogLocator.getByRole('button', { name: 'view' }).click()
        await secondBlogLocator.getByRole('button', { name: 'view' }).click()
        await secondBlogLocator.getByRole('button', { name: 'like' }).click()

        await expect(firstBlogLocator.getByText('likes 0')).toBeVisible()
        await expect(secondBlogLocator.getByText('likes 1')).toBeVisible()

        const blogs = await page.$$('.blog-title')
        expect(await blogs[0].textContent()).toEqual('Blog #2 Mary Author')
        expect(await blogs[1].textContent()).toEqual('Blog #1 John Author')
      })
    })
  })  
})