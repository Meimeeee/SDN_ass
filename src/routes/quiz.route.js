const { Router } = require("express")
const QuizService = require("../services/quiz.service")
const QuestionService = require("../services/question.service")

const router = Router()

const normalizeQuestions = (questions) => {
    if (!questions) {
        return []
    }

    return Array.isArray(questions) ? questions : [questions]
}

const buildQuizData = (body) => ({
    title: body.title,
    description: body.description,
    questions: normalizeQuestions(body.questions)
})

router.get("/", async (req, res, next) => {
    try {
        const quizzes = await QuizService.getAllQuizzes()
        return res.renderWithLayout("quizzes/list", { quizzes })
    } catch (err) {
        return next(err)
    }
})

router.get("/create", async (req, res, next) => {
    try {
        const questions = await QuestionService.getAllQuestions()
        return res.renderWithLayout("quizzes/create", { questions })
    } catch (err) {
        return next(err)
    }
})

router.get("/:id/edit", async (req, res, next) => {
    try {
        const [quiz, questions] = await Promise.all([
            QuizService.getQuizWithQuestions(req.params.id),
            QuestionService.getAllQuestions()
        ])

        if (!quiz) {
            return res.status(404).send("Quiz not found")
        }

        return res.renderWithLayout("quizzes/edit", { quiz, questions })
    } catch (err) {
        return next(err)
    }
})

router.get("/:id", async (req, res, next) => {
    try {
        const quiz = await QuizService.getQuizWithQuestions(req.params.id)

        if (!quiz) {
            return res.status(404).send("Quiz not found")
        }

        return res.renderWithLayout("quizzes/detail", { quiz })
    } catch (err) {
        return next(err)
    }
})

router.post("/", async (req, res, next) => {
    try {
        const quiz = await QuizService.createQuiz(buildQuizData(req.body))
        return res.redirect(`/quizzes/${quiz._id}`)
    } catch (err) {
        return next(err)
    }
})

router.put("/:id", async (req, res, next) => {
    try {
        const quiz = await QuizService.updateQuiz(req.params.id, buildQuizData(req.body))

        if (!quiz) {
            return res.status(404).send("Quiz not found")
        }

        return res.redirect(`/quizzes/${quiz._id}`)
    } catch (err) {
        return next(err)
    }
})

router.delete("/:id", async (req, res, next) => {
    try {
        await QuizService.deleteQuiz(req.params.id)
        return res.redirect("/quizzes")
    } catch (err) {
        return next(err)
    }
})

module.exports = router
