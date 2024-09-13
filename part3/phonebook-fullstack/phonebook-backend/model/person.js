const mongoose = require('mongoose')
require('dotenv').config()
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

personsSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('person', personsSchema)