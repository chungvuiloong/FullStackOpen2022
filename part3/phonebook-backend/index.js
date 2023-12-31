const express = require('express')
const app = express()
app.use(express.json())

let persons = [
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
    const numOfPeople = persons.length
    const date = new Date().toString()
    res.send(`<p>Phonebook has info of ${numOfPeople} people. <br/>${date}</p>`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => 
        p.id === id 
    )
    if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    res.json(note)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => 
        p.id !== id 
    )
    response.status(204).end()
})

app.post('/api/persons/', (req, res)=>{
    const randomId = function (max) {
        return Math.floor(Math.random() * max);
      }

    const person = req.body
    person.id = randomId(1000)

    persons = [...persons, person]
    res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})