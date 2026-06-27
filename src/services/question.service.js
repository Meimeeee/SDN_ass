const Question = require("../models/question.model")
const Quiz = require("../models/quiz.model")

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
    const question = await Question.findById(id)

    if (!question) {
        return null
    }

    Object.assign(question, updateData)
    return await question.save()
}

const deleteQuestion = async (id) => {
  const question = await Question.findByIdAndDelete(id);

  if (!question) {
    return null;
  }

  const quizUpdateResult = await Quiz.updateMany(
    { questions: question._id },
    { $pull: { questions: question._id } }
  );

  return {
    question,
    modifiedQuizzesCount: quizUpdateResult.modifiedCount || 0,
  };
};

const QuestionService = {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion
};

module.exports = QuestionService
