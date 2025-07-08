const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    
    const user = {
      name: 'Test User',
      username: 'testuser',
      password: 'password123'
    }
    await request.post('http://localhost:3003/api/users', {
      data: user
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByLabel('Username')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByLabel('Username').fill('testuser')
      await page.getByLabel('Password').fill('password123')
      await page.getByRole('button', { name: 'Login' }).click()

      await expect(page.getByText('testuser logged-in')).toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
      await expect(page.getByText('create new blog')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('Username').fill('wronguser')
      await page.getByLabel('Password').fill('wrongpassword')
      await page.getByRole('button', { name: 'Login' }).click()

      await expect(page.getByText('Wrong username or password')).toBeVisible()
      await expect(page.getByText('Log in to application')).toBeVisible()
    })
  })
})