const { expect } = require('@playwright/test')

const loginWith = async (page, username, password) => {
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const expectNotification = async (page, notificationText) => {
  const notificationDiv = page.getByTestId('app-notification')
  await expect(notificationDiv).toContainText(notificationText)
}

const createNewBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.getByRole('textbox', { name: 'Title' }).fill(title)
  await page.getByRole('textbox', { name: 'Author' }).fill(author)
  await page.getByRole('textbox', { name: 'Url' }).fill(url)
  await page.getByRole('button', { name: 'create' }).click()
}

export { loginWith, expectNotification, createNewBlog }