const Question = require("../models/question.model")

const getAllQuestions = async() => {
    return await Question.find()
}

const getQuestionById = async(id) => {
    return await Question.findById(id)
}

const createQuestion = async(data, authorId) => {
    const { author, ...questionData } = data
    return await Question.create({ ...questionData, author: authorId })
}

const updateQuestion = async (id, data) => {
    const { author, ...updateData } = data
    return await Question.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    })
}

const deleteQuestion = async (id) => {
  return await Question.findByIdAndDelete(id);
};

const QuestionService = {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion
};

module.exports = QuestionService
