const { Router } = require("express")
const QuizController = require("../controllers/quiz.controller")
const QuestionController = require("../controllers/question.controller")

const router = Router()

router.get("/", (req, res) => {
    res.status(200).json({ status: "ok" })
})


router.use("/quizzes", QuizController)
router.use("/questions", QuestionController)

module.exports = router
