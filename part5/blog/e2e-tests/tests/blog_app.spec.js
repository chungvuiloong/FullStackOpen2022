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

    const anotherUser = {
      name: 'Another User',
      username: 'anotheruser',
      password: 'password123'
    }
    await request.post('http://localhost:3003/api/users', {
      data: anotherUser
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

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByLabel('Username').fill('testuser')
      await page.getByLabel('Password').fill('password123')
      await page.getByRole('button', { name: 'Login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByText('create new blog').click()
      await page.getByLabel('title').fill('Test Blog Title')
      await page.getByLabel('author').fill('Test Author')
      await page.getByLabel('url').fill('http://testblog.com')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('A new blog "Test Blog Title" by Test Author added')).toBeVisible()
      await expect(page.getByText('Test Blog Title Test Author')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByText('create new blog').click()
      await page.getByLabel('title').fill('Likeable Blog')
      await page.getByLabel('author').fill('Blog Author')
      await page.getByLabel('url').fill('http://likeable.com')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByText('Likeable Blog Blog Author').getByRole('button', { name: 'view' }).click()
      await expect(page.getByText('likes 0')).toBeVisible()
      
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('user who added the blog can delete the blog', async ({ page }) => {
      await page.getByText('create new blog').click()
      await page.getByLabel('title').fill('Blog to Delete')
      await page.getByLabel('author').fill('Delete Author')
      await page.getByLabel('url').fill('http://delete.com')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByText('Blog to Delete Delete Author').getByRole('button', { name: 'view' }).click()
      
      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByText('Blog deleted')).toBeVisible()
      await expect(page.getByText('Blog to Delete Delete Author')).not.toBeVisible()
    })

    test('only the user who added the blog sees the delete button', async ({ page }) => {
      await page.getByText('create new blog').click()
      await page.getByLabel('title').fill('Blog by First User')
      await page.getByLabel('author').fill('First Author')
      await page.getByLabel('url').fill('http://firstuser.com')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByText('Blog by First User First Author').getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()

      await page.getByRole('button', { name: 'logout' }).click()

      await page.getByLabel('Username').fill('anotheruser')
      await page.getByLabel('Password').fill('password123')
      await page.getByRole('button', { name: 'Login' }).click()

      await page.getByText('Blog by First User First Author').getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('blogs are arranged in order according to likes', async ({ page }) => {
      await page.getByText('create new blog').click()
      await page.getByLabel('title').fill('First Blog')
      await page.getByLabel('author').fill('Author')
      await page.getByLabel('url').fill('http://first.com')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByText('create new blog').click()
      await page.getByLabel('title').fill('Second Blog')
      await page.getByLabel('author').fill('Author')
      await page.getByLabel('url').fill('http://second.com')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByText('create new blog').click()
      await page.getByLabel('title').fill('Third Blog')
      await page.getByLabel('author').fill('Author')
      await page.getByLabel('url').fill('http://third.com')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByText('Second Blog Author').getByRole('button', { name: 'view' }).click()
      await page.getByText('Second Blog Author').locator('..').getByRole('button', { name: 'like' }).click()
      await page.getByText('Second Blog Author').locator('..').getByRole('button', { name: 'like' }).click()

      await page.getByText('Third Blog Author').getByRole('button', { name: 'view' }).click()
      await page.getByText('Third Blog Author').locator('..').getByRole('button', { name: 'like' }).click()

      const blogs = await page.locator('.blog').all()
      await expect(blogs[0]).toContainText('Second Blog')
      await expect(blogs[1]).toContainText('Third Blog')
      await expect(blogs[2]).toContainText('First Blog')
    })
  })
})