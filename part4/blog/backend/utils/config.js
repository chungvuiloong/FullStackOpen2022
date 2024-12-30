require('dotenv').config()

const PORT = process.env.PORT
const password = process.env.MONGODB_PASSWORD
const cluster = process.env.MONGODB_CLUSTER
const db = process.env.MONGODB_DB
const MONGODB_URI = process.env.NODE_ENV === 'test' ?  `mongodb+srv://fullstack:${password}@${cluster}.uibsh.mongodb.net/${db}?retryWrites=true&w=majority` :
  `mongodb+srv://fullstack:${password}@${cluster}.uibsh.mongodb.net/${db}?retryWrites=true&w=majority`
// const MONGODB_URI = `mongodb+srv://fullstack:${password}@${cluster}.uibsh.mongodb.net/${db}?retryWrites=true&w=majority`

module.exports = {
    MONGODB_URI,
    PORT,
    password,
    cluster,
    db
}