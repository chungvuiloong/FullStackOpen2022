const express = require('express')
const app = express()

app.use(express.json())

let blogs = [
    {
        id: "1",
        title: "Learning HTML",
        author: "Jane Doe",
        url: "http://example.com/html",
        likes: 25
    },
    {
        id: "2",
        title: "Understanding JavaScript",
        author: "John Smith",
        url: "http://example.com/js",
        likes: 45
    },
    {
        id: "3",
        title: "HTTP Methods: GET vs POST",
        author: "Alice Johnson",
        url: "http://example.com/http-methods",
        likes: 60
    }
  ]
  
  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/blogs', (request, response) => {
    response.json(blogs)
  })
  
  app.get('/api/blogs/:id', (request, response) => {
    const id = request.params.id
    const blog = blogs.find(blog => blog.id === id)
      
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
  })

  app.delete('/api/blogs/:id', (request, response) => {
    const id = request.params.id
    blogs = blogs.filter(blog => blog.id !== id)
    response.status(204).end()
  })

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})