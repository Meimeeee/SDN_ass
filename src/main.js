// import
const express = require("express")

// create express
const main = express()

// config
main.use(express.json)
main.use(express.urlencoded({ extended: true }))
main.get("/hello", (req, res) => {
    res.send("Hello world!!")
})

module.exports = main


