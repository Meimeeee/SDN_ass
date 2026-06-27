const mongoose = require("mongoose")
const Env = require("../utils/env")

const connectDB = async () => {
    const mongoURL = Env.DB_URL

    if (!mongoURL) {
        console.error("MongoDB connection failed: Missing DB_URL")
        process.exit(1)
    }

    try {
        console.log("Connecting to MongoDB")
        await mongoose.connect(mongoURL)
        console.log(`MongoDB connected`)
    } catch (e) {
        console.error(`MongoDB connection failed: ${e.message}`)
        process.exit(1)
    }
}
module.exports = connectDB
