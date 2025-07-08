const mongoose = require('mongoose')
const config = require('../utils/config')
const { insertDummyData } = require('../utils/dummyData')

const seedDatabase = async () => {
    try {
        console.log('Connecting to database...')
        await mongoose.connect(config.MONGODB_URI)
        console.log('Connected to MongoDB')

        console.log('Inserting dummy data...')
        await insertDummyData()
        
        console.log('Database seeded successfully!')
        
    } catch (error) {
        console.error('Error seeding database:', error)
    } finally {
        await mongoose.connection.close()
        console.log('Database connection closed')
    }
}

seedDatabase()