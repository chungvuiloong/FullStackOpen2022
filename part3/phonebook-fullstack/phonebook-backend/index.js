const express = require('express')
const app = express()
const cors = require('cors')
var morgan = require('morgan')
const Persons = require('./model/person')

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

app.get('/api/persons/:id', (req, res, next) => {
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

app.delete('/api/persons/:id', (req, res, next) => {
    Persons.findByIdAndDelete(req.params.id)
        .then(result => {
        res.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons/', (req, res, next)=>{
    const { name, number } = req.body
 
    const person = new Persons({
        name: name,
        number: number,
      })

    person.save()
        .then(savedPerson => {
            res.json(savedPerson)
        })
        .catch(error => next(error))

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

app.put('/api/persons/:id', (req, res, next) => {
    const { name, number } = req.body
 
    const updatedPerson = {
        name: name,
        number: number,
      }
 
    Persons.findByIdAndUpdate(req.params.id, updatedPerson, { new: true, runValidators: true })
    .then(updatedPerson => {
        if (updatedPerson) {
            res.json(updatedPerson);
        } else {
            res.status(404).end();
        }
    })
      .catch(error => next(error))
  })
  

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }  

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message);
    console.error(error.name); 

    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
