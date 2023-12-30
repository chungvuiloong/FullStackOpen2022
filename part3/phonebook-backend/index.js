const express = require('express')
const app = express()

let notes = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, res) => {
    res.send('<h1>Phonebook backend</h1>')
  })

app.get('/info', (req, res) => {
    const numOfPeople = notes.length
    const date = new Date().toString()
    res.send(`<p>Phonebook has info of ${numOfPeople} people. <br/>${date}</p>`)
})

app.get('/api/persons', (req, res) => {
    res.json(notes)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})