// import
const express = require("express")
const QuizController = require("./controllers/quizController")
const QuestionController = require("./controllers/questionController")

// create express
const main = express()

// config
main.use(express.json())
main.use(express.urlencoded({ extended: true }))
main.use("/quizzes", QuizController)
main.use("/questions", QuestionController)

main.get("/", (req, res) => {
    res.json({
        message: "Quiz API is running",
        endpoints: {
            quizzes: "/quizzes",
            questions: "/questions",
        },
    })
})

main.get("/hello", (req, res) => {
    res.send("Hello world!!")
})

module.exports = main

