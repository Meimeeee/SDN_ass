
require("dotenv/config")

const Env = {
    PORT: process.env.PORT || 3001,
    JWT_SECRET: process.env.JWT_SECRET || "hehe",
    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
    DB_URL: process.env.DB_URL
}

module.exports = Env
