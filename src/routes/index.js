const { Router } = require("express")
const quizRoutes = require("./quiz.route")
const questionRoutes = require("./question.route")

const router = Router()

router.get("/", (req, res) => {
    res.status(200).json({ status: "ok" })
})

router.use("/quizzes", quizRoutes)
router.use("/questions", questionRoutes)

module.exports = router
