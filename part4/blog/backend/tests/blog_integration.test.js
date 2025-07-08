const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const Blog = require('../model/blog')
const User = require('../model/user')

describe('Blog Integration Tests', () => {
    let user1Token = null
    let user2Token = null
    let user1Id = null
    let user2Id = null

    beforeEach(async () => {
        await User.deleteMany({})
        await Blog.deleteMany({})

        const passwordHash1 = await bcrypt.hash('password1', 10)
        const user1 = new User({ 
            username: 'user1', 
            name: 'User One',
            passwordHash: passwordHash1
        })
        const savedUser1 = await user1.save()
        user1Id = savedUser1._id

        const passwordHash2 = await bcrypt.hash('password2', 10)
        const user2 = new User({ 
            username: 'user2', 
            name: 'User Two',
            passwordHash: passwordHash2
        })
        const savedUser2 = await user2.save()
        user2Id = savedUser2._id

        const loginResponse1 = await api
            .post('/api/login')
            .send({ username: 'user1', password: 'password1' })
        user1Token = loginResponse1.body.token

        const loginResponse2 = await api
            .post('/api/login')
            .send({ username: 'user2', password: 'password2' })
        user2Token = loginResponse2.body.token
    })

    test('Multiple users can create blogs independently', async () => {
        const blog1 = {
            title: 'Blog by User 1',
            author: 'User One',
            url: 'http://user1-blog.com'
        }

        const blog2 = {
            title: 'Blog by User 2',
            author: 'User Two',
            url: 'http://user2-blog.com'
        }

        const response1 = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${user1Token}`)
            .send(blog1)
            .expect(201)

        const response2 = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${user2Token}`)
            .send(blog2)
            .expect(201)

        assert.strictEqual(response1.body.user, user1Id.toString())
        assert.strictEqual(response2.body.user, user2Id.toString())

        const allBlogs = await api.get('/api/blogs')
        assert.strictEqual(allBlogs.body.length, 2)
    })

    test('User can only delete their own blogs', async () => {
        const blog1 = {
            title: 'Blog by User 1 for Deletion Test',
            author: 'User One',
            url: 'http://user1-delete-test.com'
        }

        const blog2 = {
            title: 'Blog by User 2 for Deletion Test',
            author: 'User Two',
            url: 'http://user2-delete-test.com'
        }

        const createdBlog1 = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${user1Token}`)
            .send(blog1)
            .expect(201)

        const createdBlog2 = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${user2Token}`)
            .send(blog2)
            .expect(201)

        await api
            .delete(`/api/blogs/${createdBlog1.body.id}`)
            .set('Authorization', `Bearer ${user2Token}`)
            .expect(403)

        await api
            .delete(`/api/blogs/${createdBlog2.body.id}`)
            .set('Authorization', `Bearer ${user1Token}`)
            .expect(403)

        await api
            .delete(`/api/blogs/${createdBlog1.body.id}`)
            .set('Authorization', `Bearer ${user1Token}`)
            .expect(204)

        await api
            .delete(`/api/blogs/${createdBlog2.body.id}`)
            .set('Authorization', `Bearer ${user2Token}`)
            .expect(204)
    })

    test('Blog creation and listing preserves user relationships', async () => {
        const blogs = [
            { title: 'Tech Blog', author: 'User One', url: 'http://tech.com' },
            { title: 'Food Blog', author: 'User Two', url: 'http://food.com' },
            { title: 'Travel Blog', author: 'User One', url: 'http://travel.com' }
        ]

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${user1Token}`)
            .send(blogs[0])
            .expect(201)

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${user2Token}`)
            .send(blogs[1])
            .expect(201)

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${user1Token}`)
            .send(blogs[2])
            .expect(201)

        const allBlogs = await api.get('/api/blogs')
        
        const user1Blogs = allBlogs.body.filter(blog => blog.user.username === 'user1')
        const user2Blogs = allBlogs.body.filter(blog => blog.user.username === 'user2')

        assert.strictEqual(user1Blogs.length, 2)
        assert.strictEqual(user2Blogs.length, 1)

        user1Blogs.forEach(blog => {
            assert.strictEqual(blog.user.name, 'User One')
            assert.strictEqual(blog.user.id, user1Id.toString())
        })

        user2Blogs.forEach(blog => {
            assert.strictEqual(blog.user.name, 'User Two')
            assert.strictEqual(blog.user.id, user2Id.toString())
        })
    })

    test('Database operations are atomic for blog creation', async () => {
        const blog = {
            title: 'Atomic Test Blog',
            author: 'Test Author',
            url: 'http://atomic-test.com'
        }

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${user1Token}`)
            .send(blog)
            .expect(201)

        const blogFromDb = await Blog.findById(response.body.id)
        const userFromDb = await User.findById(user1Id)

        assert(blogFromDb)
        assert.strictEqual(blogFromDb.user.toString(), user1Id.toString())
        assert(userFromDb.blogs.includes(response.body.id))
    })

    test('Malformed blog data validation', async () => {
        const malformedBlogs = [
            { author: 'No Title', url: 'http://notitle.com' },
            { title: 'No URL', author: 'No URL Author' },
            { title: '', author: 'Empty Title', url: 'http://empty.com' },
            { title: 'No Author', url: 'http://noauthor.com', author: '' }
        ]

        for (const blog of malformedBlogs) {
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${user1Token}`)
                .send(blog)
                .expect(400)
        }
    })

    test('Blog updates maintain user ownership', async () => {
        const blog = {
            title: 'Original Title',
            author: 'Original Author',
            url: 'http://original.com',
            likes: 5
        }

        const createdBlog = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${user1Token}`)
            .send(blog)
            .expect(201)

        const updatedData = { likes: 15 }

        await api
            .put(`/api/blogs/${createdBlog.body.id}`)
            .send(updatedData)
            .expect(200)

        const updatedBlog = await api.get(`/api/blogs/${createdBlog.body.id}`)
        assert.strictEqual(updatedBlog.body.likes, 15)
        assert.strictEqual(updatedBlog.body.user.id, user1Id.toString())
    })

    test('Large number of blogs can be handled', async () => {
        const blogs = []
        for (let i = 0; i < 50; i++) {
            blogs.push({
                title: `Blog ${i}`,
                author: `Author ${i}`,
                url: `http://blog${i}.com`,
                likes: i
            })
        }

        const userTokens = [user1Token, user2Token]
        
        for (let i = 0; i < blogs.length; i++) {
            const token = userTokens[i % 2]
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(blogs[i])
                .expect(201)
        }

        const allBlogs = await api.get('/api/blogs')
        assert.strictEqual(allBlogs.body.length, 50)

        const user1BlogsCount = allBlogs.body.filter(blog => blog.user.username === 'user1').length
        const user2BlogsCount = allBlogs.body.filter(blog => blog.user.username === 'user2').length

        assert.strictEqual(user1BlogsCount, 25)
        assert.strictEqual(user2BlogsCount, 25)
    })

    test('Authentication header variations are handled correctly', async () => {
        const blog = {
            title: 'Auth Header Test',
            author: 'Test Author',
            url: 'http://auth-header.com'
        }

        await api
            .post('/api/blogs')
            .set('authorization', `Bearer ${user1Token}`)
            .send(blog)
            .expect(201)

        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${user1Token}`)
            .send(blog)
            .expect(401)

        await api
            .post('/api/blogs')
            .set('Authorization', `Token ${user1Token}`)
            .send(blog)
            .expect(401)

        await api
            .post('/api/blogs')
            .set('Authorization', user1Token)
            .send(blog)
            .expect(401)
    })
})

after(async () => {
    await mongoose.connection.close()
})