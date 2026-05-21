const Question = require("../models/question.model")

const getAllQuestions = async() => {
    return await Question.find()
}

const getQuestionById = async(id) => {
    return await Question.findById(id)
}

const createQuestion = async(data) => {
    return await Question.create(data)
}

const updateQuestion = async (id, data) => {
    return await Question.findByIdAndUpdate(id, data, {new: true})
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
