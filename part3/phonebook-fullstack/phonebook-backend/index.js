const express = require('express')
const app = express()
const cors = require('cors')
var morgan = require('morgan')

const mongoose = require('mongoose')
require('dotenv').config()

// const name = process.argv[3]
// const number = process.argv[4]
const password = process.env.MONGODB_PASSWORD
const cluster = process.env.MONGODB_CLUSTER
const db = process.env.MONGODB_DB
const url =
  `mongodb+srv://fullstack:${password}@${cluster}.uibsh.mongodb.net/${db}?retryWrites=true&w=majority`
mongoose.set('strictQuery',false)
mongoose.connect(url)

const personsSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Persons = mongoose.model('person', personsSchema)

const person = new Persons({
    name: String,
    number: String
})

personsSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

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

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :body'));

app.get('/', (request, res) => {
    res.send('<h1>Phonebook backend</h1>')
  })

// app.get('/info', (req, res) => {
//     const numOfPeople = Persons.length
//     const date = new Date().toString()
//     res.send(`<p>Phonebook has info of ${numOfPeople} people. <br/>${date}</p>`)
// })

app.get('/info', (req, res) => {
    Persons.countDocuments({})
      .then(count => {
        const date = new Date().toString();
        res.send(`<p>Phonebook has info of ${count} people. <br/>${date}</p>`);
      })
      .catch(error => res.status(500).json({ error: 'Something went wrong' }));
  });
  

app.get('/api/persons', (req, res) => {
    Persons.find({})
        .then(person => {
        res.json(person);
        })
        .catch(error => res.status(500).json({ error: 'Failed to fetch persons' }));
})

app.get('/api/persons/:id', (req, res) => {
    Persons.findById(req.params.id)
        .then(person => {
        if (person) {
            res.json(person);
        } else {
            res.status(404).end()
        }
        })
        .catch(error => next(error))
})

// app.delete('/api/persons/:id', (req, res) => {
//     const id = Number(req.params.id)
//     persons = Persons.filter(p => 
//         p.id !== id 
//     )
//     response.status(204).end()
// })

app.post('/api/persons/', (req, res)=>{
    const { name, number } = req.body
 
    const person = new Persons({
        name: name,
        number: number,
      })

    person.save().then(result => {
        console.log('note saved!')
        console.log(`added ${name} number ${number} to phonebook`);
      })

    function detectSameName (inputName) {
        const person = persons.find(p =>  
            p.name.toLocaleLowerCase() === inputName.toLocaleLowerCase() 
        )
        if (person) {
            return true
        } else {
            return false
        }
    }

    if (!name || !number) {
        return res.status(400).json({ 
            error: 'content missing' 
        })
    }

    if (detectSameName(name)) {
        return res.status(400).json({ 
            error: 'name must be unique'
        })
    }

    persons = [...persons, person]
    res.status(201).json(`${name} has been added to the phonebook`);
})

// const unknownEndpoint = (request, response) => {
//     response.status(404).send({ error: 'unknown endpoint' })
//   }  

// app.use(unknownEndpoint)

// const errorHandler = (error, request, response, next) => {
//     console.error(error.message)
  
//     if (error.name === 'CastError') {
//       return response.status(400).send({ error: 'malformatted id' })
//     } 
  
//     next(error)
//   }
  
//   app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
