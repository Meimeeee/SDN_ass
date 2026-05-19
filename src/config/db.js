const mongoose = require("mongoose")
const Env = require("../utils/env")



const connectDB = async () => {

    const mongoURL = `mongodb://${Env.DB_HOST}:${Env.DB_PORT}/${Env.DB_NAME}`

    try {
        console.log(`Connecting to ${mongoURL}`)
        await mongoose.connect(mongoURL)
        console.log(`MongoDB connected`)
    } catch (e) {
        console.error(`MongoDB connection failed: ${e.message}`)
        process.exit(1)
    }
}

module.exports = connectDB