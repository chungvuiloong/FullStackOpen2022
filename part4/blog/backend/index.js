const http = require('http')

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
  
const app = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(blogs))
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})