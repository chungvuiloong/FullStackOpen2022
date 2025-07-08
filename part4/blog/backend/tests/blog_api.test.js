const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const Blog = require('../model/blog')
const User = require('../model/user')

let authToken = null

beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    const passwordHash = await bcrypt.hash('testpassword', 10)
    const user = new User({ 
        username: 'testuser', 
        name: 'Test User',
        passwordHash 
    })
    await user.save()

    const loginResponse = await api
        .post('/api/login')
        .send({ username: 'testuser', password: 'testpassword' })

    authToken = loginResponse.body.token
})

test('Blogs return as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

test('Blogs return as json and have id property', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);

    response.body.forEach((blog) => {
        assert(Object.keys(blog).includes('id'))
    })
})

//   test('A blog post created successfully', async () => { 
//     // Write a test that verifies that making an HTTP POST request to the /api/blogs URL successfully creates a new blog post. At the very least, verify that the total number of blogs in the system is increased by one. You can also verify that the content of the blog post is saved correctly to the database.

//     const newBlog = {
//         title: 'Meow Test Blog',
//         author: 'Test Author',
//         url: 'http://test.com',
//     }

//     const previousReponse = await api.get('/api/blogs')
//     const previousTotalBlogs =  previousReponse.body.length;

//     await api
//         .post(`/api/blogs/`)
//         .send(newBlog)
//         .expect(201)
//         .expect('Content-Type', /application\/json/);

//     const checkNewResponse = await api.get('/api/blogs')
//     const newTotalBlogs = await checkNewResponse.body.length
//     const lastBlog = await checkNewResponse.body[newTotalBlogs - 1]

//     assert.strictEqual(newTotalBlogs, previousTotalBlogs + 1) 
//     assert.strictEqual(newBlog.title, lastBlog.title);
//     assert.strictEqual(newBlog.author, lastBlog.author);
//     assert.strictEqual(newBlog.url, lastBlog.url);
//   })

test('Check for missing "likes" property', async () => {
    const response = await api.get('/api/blogs')
        .expect(200)

    response.body.forEach(async (blog) => {
        const updatedBlog = {
            title: blog.title,
            author: blog.author,
            url: blog.url,
            likes: blog.likes || 0
        }

        if (!blog['likes']) {
            assert.strictEqual(updatedBlog.likes, 0);
            const updateResponse = await api.put('/api/blogs').send(updatedBlog)
            return updateResponse
        }
    })
  })

test('Creating new blogs & verify missing title or url properties', async () => {
    const newBlog = {
        author: 'Test Author',
    }

    const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newBlog)
        .expect(400);
    return response
})

test('Deleting a single blog post', async () => {
    const deleteBlog = {
        title: 'Blog to be deleted',
        author: 'Author',
        url: 'http://delete.com',
    }

    const createdBlogResponse = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send(deleteBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const createdBlog = createdBlogResponse.body
    await api
        .delete(`/api/blogs/${createdBlog.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204)

    const responseAfterDeletion = await api.get('/api/blogs')
    const blogIds = responseAfterDeletion.body.map(blog => blog.id)
    assert(!blogIds.includes(createdBlog.id))
})

test('Updating likes of a blog post', async () => {
    const blogToUpdate = {
        title: 'Blog to update likes',
        author: 'Author',
        url: 'http://update-likes.com',
        likes: 5,
    };

    const createdBlogResponse = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send(blogToUpdate)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const createdBlog = createdBlogResponse.body;

    const updatedLikes = createdBlog.likes + 1;
    const updatedBlogData = { likes: updatedLikes };

    await api
        .put(`/api/blogs/${createdBlog.id}`)
        .send(updatedBlogData)
        .expect(200)
        .expect('Content-Type', /application\/json/);

    const responseAfterUpdate = await api.get(`/api/blogs/${createdBlog.id}`);
    const updatedBlog = responseAfterUpdate.body;

    assert.strictEqual(updatedBlog.likes, updatedLikes);
});

test('Adding a blog fails with 401 Unauthorized if token is not provided', async () => {
    const newBlog = {
        title: 'Test Blog Without Token',
        author: 'Test Author',
        url: 'http://test-without-token.com',
    };

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/);

    assert(response.body.error.includes('token missing'));
});

test('Adding a blog fails with 401 Unauthorized if token is invalid', async () => {
    const newBlog = {
        title: 'Test Blog With Invalid Token',
        author: 'Test Author',
        url: 'http://test-invalid-token.com',
    };

    const response = await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer invalidtoken')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/);

    assert(response.body.error.includes('invalid token'));
});

after(async () => {
    await mongoose.connection.close()
})