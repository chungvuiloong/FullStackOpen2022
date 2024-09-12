const mongoose = require('mongoose')
require('dotenv').config()

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]
const cluster = process.env.MONGODB_CLUSTER
const db = process.env.MONGODB_DB

const url =
  `mongodb+srv://fullstack:${password}@${cluster}.uibsh.mongodb.net/${db}?retryWrites=true&w=majority`
console.log('connecting to', url)
mongoose.set('strictQuery',false)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personsSchema = new mongoose.Schema({
  name: String,
  phonenumber: Number,
})

const Persons = mongoose.model('person', personsSchema)

personsSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

const person = new Persons({
  name: name,
  phonenumber: number,
})

person.save().then(result => {
  console.log('note saved!')
  console.log(`added ${name} number ${number} to phonebook`);
//   mongoose.connection.close()
})

console.log('phonebook:')
Persons.find({}).then(result => {
    result.forEach(person => {
    //   console.log(note.name, note.phonenumber)
      console.log(person)
    })
    mongoose.connection.close()
  })