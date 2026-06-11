// import
const express = require("express")
const QuizController = require("./controllers/quiz.controller")
const QuestionController = require("./controllers/question.controller")
const UserController = require("./controllers/user.controller")
const passport = require("passport")

// create express
const main = express()

// config

main.use(express.json())
main.use(express.urlencoded({ extended: true }))

main.use(passport.initialize());

main.use("/quizzes", QuizController)
main.use("/questions", QuestionController)
main.use("/users", UserController)

main.get("/", (req, res) => {
    res.json({
        message: "Quiz API is running",
        endpoints: {
            quizzes: "/quizzes",
            questions: "/questions",
            users: "/users",
        },
    })
})

main.use((err, req, res, next) => {
    const statusCode = err.status || 500
    return res.status(statusCode).json({ error: err.message })
})

module.exports = main

