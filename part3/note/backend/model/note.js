// const config = require('./utils/config')
const mongoose = require('mongoose')

// mongoose.set('strictQuery', false)

// const password = process.env.MONGODB_PASSWORD
// const cluster = process.env.MONGODB_CLUSTER
// const db = process.env.MONGODB_DB
// const url =
//   `mongodb+srv://fullstack:${password}@${cluster}.uibsh.mongodb.net/${db}?retryWrites=true&w=majority`
// mongoose.set('strictQuery',false)
// // mongoose.connect(config.MONGODB_URI)
// mongoose.connect(url)
//     .then(result => {
//         console.log('connected to MongoDB')
//     })
//     .catch((error) => {
//         console.log('error connecting to MongoDB:', error.message)
//     })

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Note', noteSchema)