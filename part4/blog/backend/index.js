const express = require('express')
const app = express()
app.use(express.json())
const cors = require('cors')

app.use(cors())
app.use(express.static('dist'))

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }
  

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

  app.post('/api/blogs', (request, response) => {
    const { title, author, url, likes  }  = request.body

    if (!request.body) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    } 

    const blog = {
        id: 4,
        title: title,
        author: author,
        url: url,
        likes: likes
    }

    response.json(blog)
  })

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

app.use(requestLogger)
const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})