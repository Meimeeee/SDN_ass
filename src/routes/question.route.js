const { Router } = require("express")
const QuestionService = require("../services/question.service")

const router = Router()

const splitList = (value) => {
    if (Array.isArray(value)) {
        return value.flatMap(splitList)
    }
    if (!value) {
        return []
    }

    return String(value)
        .split(/\r?\n|,/)
        .map((item) => item.trim())
        .filter(Boolean)
}

const buildQuestionData = (body) => ({
    text: body.text,
    options: splitList(body.options),
    keyword: splitList(body.keyword),
    correctAnswerIndex: Number(body.correctAnswerIndex)
})

router.get("/", async (req, res, next) => {
    try {
        const questions = await QuestionService.getAllQuestions()
        return res.renderWithLayout("questions/list", { questions })
    } catch (err) {
        return next(err)
    }
})

router.get("/create", (req, res, next) => {
    return res.renderWithLayout("questions/create")
})

router.get("/:id/edit", async (req, res, next) => {
    try {
        const question = await QuestionService.getQuestionById(req.params.id)

        if (!question) {
            return res.status(404).send("Question not found")
        }

        return res.renderWithLayout("questions/edit", { question })
    } catch (err) {
        return next(err)
    }
})

router.get("/:id", async (req, res, next) => {
    try {
        const question = await QuestionService.getQuestionById(req.params.id)

        if (!question) {
            return res.status(404).send("Question not found")
        }

        return res.renderWithLayout("questions/detail", { question })
    } catch (err) {
        return next(err)
    }
})

router.post("/", async (req, res, next) => {
    try {
        const question = await QuestionService.createQuestion(buildQuestionData(req.body))
        return res.redirect(`/questions/${question._id}`)
    } catch (err) {
        return next(err)
    }
})

router.put("/:id", async (req, res, next) => {
    try {
        const question = await QuestionService.updateQuestion(
            req.params.id,
            buildQuestionData(req.body)
        )

        if (!question) {
            return res.status(404).send("Question not found")
        }

        return res.redirect(`/questions/${question._id}`)
    } catch (err) {
        return next(err)
    }
})

router.delete("/:id", async (req, res, next) => {
    try {
        await QuestionService.deleteQuestion(req.params.id)
        return res.redirect("/questions")
    } catch (err) {
        return next(err)
    }
})

module.exports = router
