const main = require("./main")
const Env = require("./utils/env")
const connectDB = require("./config/db")


async function server() {
    // Connect to MongoDB
    await connectDB()

    // Start the server
    main.listen(Env.PORT, "0.0.0.0", () => {
        console.log(`Server is running on port ${Env.PORT}`)
    })
}

server()
