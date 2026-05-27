const Quiz = require("../models/quiz.model")
const Question = require("../models/question.model")

const getAllQuizzes = async () => {
    return await Quiz.find()
}

const getQuizById = async (id) => {
    return await Quiz.findById(id)
}

const getQuizWithQuestions = async (id) => {
    return await Quiz.findById(id).populate("questions")
}

const createQuiz = async (data) => {
    return await Quiz.create(data)
}

const updateQuiz = async (id, data) => {
    return await Quiz.findByIdAndUpdate(id, data, { new: true })
}

const deleteQuiz = async (id) => {
    return await Quiz.findByIdAndDelete(id)
}


const addQuestionToQuiz = async (quizId, questionData) => {
    const question = await Question.create(questionData)
    return await Quiz.findByIdAndUpdate(
        quizId,
        { $push: { questions: question._id } },
        { new: true }
    ).populate("questions")
}

const addQuestionsToQuiz = async (quizId, questionsData) => {
    const Question = require("../models/question.model")
    const created = await Question.insertMany(questionsData)
    const ids = created.map(q => q._id)
    return await Quiz.findByIdAndUpdate(
        quizId,
        { $push: { questions: { $each: ids } } },
        { new: true }
    ).populate("questions")
}

const QuizService = {
    getAllQuizzes,
    getQuizById,
    getQuizWithQuestions,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    addQuestionToQuiz,
    addQuestionsToQuiz
}

module.exports = QuizService
