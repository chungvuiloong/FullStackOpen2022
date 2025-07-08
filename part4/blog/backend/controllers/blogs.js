const blogsRouter = require('express').Router()
const Blog = require('../model/blog')
const User = require('../model/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')
const { ObjectId } = require('mongoose').Types

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

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
    try {
        const user = request.user

        const blog = await Blog.findById(request.params.id)
        
        if (!blog) {
            return response.status(404).json({ error: 'blog not found' })
        }

        if (blog.user.toString() !== user._id.toString()) {
            return response.status(403).json({ error: 'only the creator can delete this blog' })
        }

        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } catch (error) {
        next(error)
    }
})

blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {
    const body = request.body

    try {
        const user = request.user

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