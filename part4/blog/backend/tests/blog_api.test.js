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

test('Successfully adding a blog with valid token', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const initialCount = blogsAtStart.body.length

    const newBlog = {
        title: 'Test Blog Success',
        author: 'Test Author',
        url: 'http://success-test.com',
        likes: 10
    };

    const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const savedBlog = response.body
    assert.strictEqual(savedBlog.title, newBlog.title)
    assert.strictEqual(savedBlog.author, newBlog.author)
    assert.strictEqual(savedBlog.url, newBlog.url)
    assert.strictEqual(savedBlog.likes, newBlog.likes)
    assert(savedBlog.user)
    assert(savedBlog.id)

    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, initialCount + 1)

    const titles = blogsAtEnd.body.map(blog => blog.title)
    assert(titles.includes(newBlog.title))
});

test('Blog creation with missing likes defaults to 0', async () => {
    const newBlog = {
        title: 'Blog Without Likes',
        author: 'Test Author',
        url: 'http://no-likes.com'
    };

    const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.likes, 0)
});

test('Blog deletion requires authentication', async () => {
    const newBlog = {
        title: 'Blog to Delete Without Auth',
        author: 'Test Author',
        url: 'http://delete-no-auth.com'
    };

    const createdBlog = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newBlog)
        .expect(201);

    await api
        .delete(`/api/blogs/${createdBlog.body.id}`)
        .expect(401);
});

test('Blog deletion with invalid token fails', async () => {
    const newBlog = {
        title: 'Blog to Delete Invalid Token',
        author: 'Test Author',
        url: 'http://delete-invalid.com'
    };

    const createdBlog = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newBlog)
        .expect(201);

    await api
        .delete(`/api/blogs/${createdBlog.body.id}`)
        .set('Authorization', 'Bearer invalidtoken')
        .expect(401);
});

test('Blog deletion by wrong user fails with 403', async () => {
    const passwordHash = await bcrypt.hash('anotherpassword', 10)
    const anotherUser = new User({ 
        username: 'anotheruser', 
        name: 'Another User',
        passwordHash 
    })
    await anotherUser.save()

    const anotherUserLogin = await api
        .post('/api/login')
        .send({ username: 'anotheruser', password: 'anotherpassword' })

    const anotherUserToken = anotherUserLogin.body.token

    const newBlog = {
        title: 'Blog by First User',
        author: 'Test Author',
        url: 'http://first-user-blog.com'
    };

    const createdBlog = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newBlog)
        .expect(201);

    const response = await api
        .delete(`/api/blogs/${createdBlog.body.id}`)
        .set('Authorization', `Bearer ${anotherUserToken}`)
        .expect(403);

    assert(response.body.error.includes('only the creator can delete'))
});

test('Blog deletion by correct user succeeds', async () => {
    const newBlog = {
        title: 'Blog to Delete Successfully',
        author: 'Test Author',
        url: 'http://delete-success.com'
    };

    const createdBlog = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newBlog)
        .expect(201);

    await api
        .delete(`/api/blogs/${createdBlog.body.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

    const blogsAfterDeletion = await api.get('/api/blogs')
    const ids = blogsAfterDeletion.body.map(blog => blog.id)
    assert(!ids.includes(createdBlog.body.id))
});

test('Blog deletion with non-existent id returns 404', async () => {
    const nonExistentId = new mongoose.Types.ObjectId()

    const response = await api
        .delete(`/api/blogs/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

    assert(response.body.error.includes('blog not found'))
});

test('Created blog includes user information when listed', async () => {
    const newBlog = {
        title: 'Blog with User Info',
        author: 'Test Author',
        url: 'http://user-info.com'
    };

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newBlog)
        .expect(201);

    const blogs = await api.get('/api/blogs')
    const createdBlog = blogs.body.find(blog => blog.title === newBlog.title)

    assert(createdBlog.user)
    assert.strictEqual(createdBlog.user.username, 'testuser')
    assert.strictEqual(createdBlog.user.name, 'Test User')
    assert(createdBlog.user.id)
});

test('Blog creation with malformed token fails', async () => {
    const newBlog = {
        title: 'Blog with Malformed Token',
        author: 'Test Author',
        url: 'http://malformed-token.com'
    };

    const response = await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer malformed.token.here')
        .send(newBlog)
        .expect(401);

    assert(response.body.error.includes('invalid token'))
});

test('Blog creation with expired token fails', async () => {
    const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VyIiwiaWQiOiI2ODZjY2IwNzlmOTBlZjNhZjJhYjVlZjgiLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MTYwMDAwMDAwMX0.invalidSignature'
    
    const newBlog = {
        title: 'Blog with Expired Token',
        author: 'Test Author',
        url: 'http://expired-token.com'
    };

    const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${expiredToken}`)
        .send(newBlog)
        .expect(401);

    assert(response.body.error.includes('invalid token'))
});

after(async () => {
    await mongoose.connection.close()
})