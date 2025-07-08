const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByLabel('Username')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()
  })

  test('user can login with valid credentials', async ({ page }) => {
    await page.getByLabel('Username').fill('testuser')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Login' }).click()

    await expect(page.getByText('testuser logged-in')).toBeVisible()
    await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    await expect(page.getByText('create new blog')).toBeVisible()
  })
})