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
    name: {
        type: String,
        minLength: 3,
        validate: {
            validator: function(v) {
                return /^[a-zA-Z]+$/.test(v);
            //   return /\d{3}-\d{3}-\d{4}/.test(v);
            },
            message: props => `${props.value} is not a valid name!`
        },
        required: true
    },
    number: {
        type:String,
        minLength: 8,
        validate: {
            validator: function(v) {
                return /^\d{2,3}-\d{6,8}$/.test(v)
            },
            message: props => `${props.value} is not a valid name!`
        },
    }
})

personsSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('person', personsSchema)