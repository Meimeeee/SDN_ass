
require("dotenv/config")

const Env = {
    LISTEN_PORT: process.env.LISTEN_PORT,

    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_NAME: process.env.DB_NAME,
}

module.exports = Env