const blogsRouter = require('express').Router()
const Blog = require('../model/blog')
const { ObjectId } = require('mongoose').Types

blogsRouter.get('/', async (request, response) => {
    await Blog.find({}).then(blogs => {
        response.json(blogs)
    })
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

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
    })

    try {
        if (!blog.title || !blog.url || !blog.author) {
            return response.status(400).json({ error: 'title or url missing' })
        }
        const savedBlog = await blog.save();
        return response.status(201).json(savedBlog);

    } catch (exception) {
        next(exception)
    }
})

module.exports = blogsRouter