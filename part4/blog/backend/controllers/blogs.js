const blogsRouter = require('express').Router()
const Blog = require('../model/blog')
const User = require('../model/user')
// const jwt = require('jsonwebtoken') // TODO: Revisit in exercise 4.19
const { ObjectId } = require('mongoose').Types

// TODO: Revisit in exercise 4.19 - Restore proper JWT authentication
// const getTokenFrom = request => {
//     const authorization = request.get('authorization')
//     if (authorization && authorization.startsWith('Bearer ')) {
//         return authorization.replace('Bearer ', '')
//     }
//     return null
// }

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.get('/:id', (request, response, next) => {
    Blog.findById(request.params.id)
        .then(blog => {
            if (blog) {
                response.json(blog)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

blogsRouter.delete('/:id', (request, response, next) => {
    Blog.deleteOne({"_id": new ObjectId(request.params.id)})
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

blogsRouter.post('/', async (request, response, next) => {
    const body = request.body

    try {
        const user = await User.findOne({ name: { $exists: true } }) || await User.findOne({})
        
        if (!user) {
            return response.status(400).json({ error: 'No users found in database' })
        }

        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes || 0,
            user: user._id
        })

        if (!blog.title || !blog.url) {
            return response.status(400).json({ error: 'title or url missing' })
        }
        
        const savedBlog = await blog.save();
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        return response.status(201).json(savedBlog);

    } catch (exception) {
        next(exception)
    }
})

blogsRouter.patch('/:id', async (request, response, next) => {
    const { id } = request.params;
    
    try {
        const blog = await Blog.findById(id);
        
        if (!blog) {
            return response.status(404).json({ error: 'Blog not found' });
        }
        blog.likes += 1;
        const updatedBlog = await blog.save();

        response.json(updatedBlog);
    } catch (error) {
        next(error);
    }
});

blogsRouter.put('/:id', async (request, response, next) => {
    const { id } = request.params;
    const { title, author, url, likes } = request.body;

    try {
        const blog = await Blog.findById(id);
        
        if (!blog) {
            return response.status(404).json({ error: 'Blog not found' });
        }

        blog.title = title || blog.title;
        blog.author = author || blog.author;
        blog.url = url || blog.url;
        blog.likes = likes !== undefined ? likes : blog.likes;
        const updatedBlog = await blog.save();
        response.json(updatedBlog);
    } catch (error) {
        next(error);
    }
});




module.exports = blogsRouter