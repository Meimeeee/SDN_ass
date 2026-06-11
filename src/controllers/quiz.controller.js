const { Router } = require("express");
const QuizService = require("../services/quiz.service");
const { authenticate } = require("passport");
const authenticateConfig = require("../auth/authenticate");

const QuizController = Router()

const handleError = (res, err) => {
  const statusCode =
    err.name === "CastError" || err.name === "ValidationError" ? 400 : 500;

  return res.status(statusCode).json({ error: err.message });
};

QuizController.get("/", async (req, res) => {
  try {
    const quizzes = await QuizService.getAllQuizzes();
    return res.status(200).json(quizzes);
  } catch (err) {
    return handleError(res, err);
  }
});

QuizController.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await QuizService.getQuizById(id);

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    return res.status(200).json(quiz);
  } catch (err) {
    return handleError(res, err);
  }
});

QuizController.post(
  "/",
  authenticateConfig.verifyUser,
  authenticateConfig.verifyAdmin,
  async (req, res) => {
    try {
      const quiz = await QuizService.createQuiz(req.body);
      return res.status(201).json(quiz);
    } catch (err) {
      return handleError(res, err);
    }
  });

QuizController.put(
  "/:id",
  authenticateConfig.verifyUser,
  authenticateConfig.verifyAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const quiz = await QuizService.updateQuiz(id, req.body);

      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }

      return res.status(200).json(quiz);
    } catch (err) {
      return handleError(res, err);
    }
  });

QuizController.delete(
  "/:id",
  authenticateConfig.verifyUser,
  authenticateConfig.verifyAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const result = await QuizService.deleteQuiz(id);

      if (!result) {
        return res.status(404).json({ error: "Quiz not found" });
      }
      return res.status(200).json({
        message: "Quiz and related questions deleted successfully",
        deletedQuiz: result.quiz,
        deletedQuestionsCount: result.deletedQuestionsCount,
      });
    } catch (err) {
      return handleError(res, err);
    }
  });


QuizController.get("/:quizId/populate", async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await QuizService.getQuizWithQuestions(quizId);

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    return res.status(200).json(quiz);
  } catch (err) {
    return handleError(res, err);
  }
});

QuizController.post(
  "/:quizId/question",
  authenticateConfig.verifyUser,
  authenticateConfig.verifyAdmin,
  async (req, res) => {
    try {
      const { quizId } = req.params;
      const quiz = await QuizService.addQuestionToQuiz(quizId, req.body, req.user._id);

      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }

      return res.status(201).json(quiz);
    } catch (err) {
      return handleError(res, err);
    }
  });

QuizController.post(
  "/:quizId/questions",
  authenticateConfig.verifyUser,
  authenticateConfig.verifyAdmin,
  async (req, res) => {
    try {
      const { quizId } = req.params;
      const questions = Array.isArray(req.body) ? req.body : req.body.questions;

      if (!Array.isArray(questions) || questions.length === 0) {
        return res
          .status(400)
          .json({ error: "Request body must be an array or { questions: [] }" });
      }

      const quiz = await QuizService.addQuestionsToQuiz(quizId, questions, req.user._id);

      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }

      return res.status(201).json(quiz);
    } catch (err) {
      return handleError(res, err);
    }
  });


module.exports = QuizController
