const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]
const url =
  `mongodb+srv://fullstack:${password}@fullstack.uibsh.mongodb.net/phonebook?retryWrites=true&w=majority&appName=fullstack`
mongoose.set('strictQuery',false)

mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
  name: String,
  phonenumber: Number,
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

const phonebook = new Phonebook({
  name: name,
  phonenumber: number,
})

phonebook.save().then(result => {
  console.log('note saved!')
  console.log(`added ${name} number ${number} to phonebook`);
//   mongoose.connection.close()
})

console.log('phonebook:')
Phonebook.find({}).then(result => {
    result.forEach(note => {
      console.log(note.name, note.phonenumber)
    })
    mongoose.connection.close()
  })