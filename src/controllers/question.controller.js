const { Router } = require("express");
const QuestionService = require("../services/question.service");
const { authenticate } = require("passport");
const authenticateConfig = require("../auth/authenticate");

const QuestionController = Router()

const handleError = (res, err) => {
  const statusCode =
    err.name === "CastError" || err.name === "ValidationError" ? 400 : 500;

  return res.status(statusCode).json({ error: err.message });
};

QuestionController.get("/", async (req, res) => {
  try {
    const questions = await QuestionService.getAllQuestions();
    return res.status(200).json(questions);
  } catch (err) {
    return handleError(res, err);
  }
});

QuestionController.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const question = await QuestionService.getQuestionById(id);

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    return res.status(200).json(question);
  } catch (err) {
    return handleError(res, err);
  }
});

QuestionController.post(
  "/",
  authenticateConfig.verifyUser,
  async (req, res) => {
    try {
      const question = await QuestionService.createQuestion(req.body, req.user._id);
      return res.status(201).json(question);
    } catch (err) {
      return handleError(res, err);
    }
  });

QuestionController.put(
  "/:id",
  authenticateConfig.verifyUser,
  authenticateConfig.verifyAuthor,
  async (req, res) => {
    try {
      const { id } = req.params;
      const question = await QuestionService.updateQuestion(id, req.body);

      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }

      return res.status(200).json(question);
    } catch (err) {
      return handleError(res, err);
    }
  });

QuestionController.delete(
  "/:id",
  authenticateConfig.verifyUser,
  authenticateConfig.verifyAuthor,
  async (req, res) => {
    try {
      const { id } = req.params;
      const question = await QuestionService.deleteQuestion(id);

      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }

      return res.status(200).json({ message: "Question deleted successfully" });
    } catch (err) {
      return handleError(res, err);
    }
  });

module.exports = QuestionController
