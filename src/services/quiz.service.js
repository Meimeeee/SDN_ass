const Quiz = require("../models/quiz.model")
const Question = require("../models/question.model")

const getAllQuizzes = async () => {
    return await Quiz.find()
}

const getQuizById = async (id) => {
    return await Quiz.findById(id)
}

const createQuiz = async (data) => {
    return await Quiz.create(data)
}

const updateQuiz = async (id, data) => {
    return await Quiz.findByIdAndUpdate(id, data, { new: true, runValidators: true })
}

const deleteQuiz = async (id) => {
    const quiz = await Quiz.findById(id)
    if (!quiz) return null

    const deleteQuestionsResult = await Question.deleteMany({
        _id: { $in: quiz.questions }
    })

    await Quiz.findByIdAndDelete(id)

    return {
        quiz,
        deletedQuestionsCount: deleteQuestionsResult.deletedCount
    }
}

const getQuizWithQuestions = async(id) => {
    return await Quiz.findById(id).populate("questions")
}

const getQuizForAttempt = async(id) => {
    return await Quiz.findById(id).populate({
        path: "questions",
        select: "-correctAnswerIndex",
    })
}

const submitQuizAttempt = async(id, answers = []) => {
    const quiz = await Quiz.findById(id).populate("questions")
    if (!quiz) return null

    const answerMap = new Map()
    answers.forEach((answer) => {
        if (answer && answer.questionId) {
            answerMap.set(String(answer.questionId), Number(answer.selectedAnswerIndex))
        }
    })

    const results = quiz.questions.map((question) => {
        const questionId = String(question._id)
        const hasAnswer = answerMap.has(questionId)
        const selectedAnswerIndex = hasAnswer ? answerMap.get(questionId) : null
        const isCorrect = hasAnswer && selectedAnswerIndex === question.correctAnswerIndex

        return {
            questionId,
            text: question.text,
            selectedAnswerIndex,
            correctAnswerIndex: question.correctAnswerIndex,
            isCorrect,
        }
    })

    const totalQuestions = quiz.questions.length
    const answeredCount = results.filter((result) => result.selectedAnswerIndex !== null).length
    const correctCount = results.filter((result) => result.isCorrect).length
    const scorePercent = totalQuestions === 0 ? 0 : Math.round((correctCount / totalQuestions) * 100)

    return {
        quizId: String(quiz._id),
        quizTitle: quiz.title,
        totalQuestions,
        answeredCount,
        correctCount,
        scorePercent,
        results,
    }
}

const addQuestionToQuiz = async(id, questionData, authorId) => {
    const quiz = await Quiz.findById(id)
    if(!quiz) return null

    const { author, ...data } = questionData
    const question = await Question.create({ ...data, author: authorId })
    quiz.questions.push(question._id)

    await quiz.save()
    return await Quiz.findById(id).populate("questions")
}


const addQuestionsToQuiz = async(id, questions, authorId) => {
    const quiz = await Quiz.findById(id)
    if(!quiz) return null

    const createQuestions = await Question.insertMany(
        questions.map(({ author, ...question }) => ({ ...question, author: authorId }))
    )
    const questionIds = createQuestions.map((q) => q._id)
    quiz.questions.push(...questionIds)
    await quiz.save()
    return await Quiz.findById(id).populate("questions")
}


const QuizService = {
    getAllQuizzes,
    getQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    getQuizWithQuestions,
    getQuizForAttempt,
    submitQuizAttempt,
    addQuestionToQuiz,
    addQuestionsToQuiz
};

module.exports = QuizService
