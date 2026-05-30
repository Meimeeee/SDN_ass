const { text } = require("express")
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
    return await Quiz.findByIdAndUpdate(id, data, { new: true })
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
    return await Quiz.findById(id).populate({
        path: "questions",
        match: {text: /capital/i}
    })
}

const addQuestionToQuiz = async(id, questionData) => {
    const quiz = await Quiz.findById(id)
    if(!quiz) return null

    const question = await Question.create(questionData)
    quiz.questions.push(question._id)

    await quiz.save()
    return await Quiz.findById(id).populate("questions")
}


const addQuestionsToQuiz = async(id, questions) => {
    const quiz = await Quiz.findById(id)
    if(!quiz) return null

    const createQuestions = await Question.insertMany(questions)
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
    addQuestionToQuiz,
    addQuestionsToQuiz
};

module.exports = QuizService
