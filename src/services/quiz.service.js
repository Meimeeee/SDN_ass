const quizSchema = require("../models/quiz.model")

const getAllQuizzes = async () => {
    return await quizSchema.find()
}

const getQuizById = async (id) => {
    return await quizSchema.findById(id)
}

const createQuiz = async (data) => {
    return await quizSchema.create(data)
}

const updateQuiz = async (id, data) => {
    return await quizSchema.findByIdAndUpdate(id, data, { new: true })
}

const deleteQuiz = async (id) => {
    return await quizSchema.findByIdAndDelete(id)
}

const QuizService = {
    getAllQuizzes,
    getQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz
};

module.exports = QuizService
