const { Router } = require("express");
const QuizService = require("../services/quiz.service");
const QuestionService = require("../services/question.service");

const QuizViewController = Router();

// Parse options/keywords từ textarea (hỗ trợ cả newline và comma)
function parseList(value) {
  if (!value) return [];
  return value
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// GET /quizzes - Danh sách quiz
QuizViewController.get("/", async (req, res) => {
  try {
    const quizzes = await QuizService.getAllQuizzes();
    return res.renderWithLayout("quizzes/list", { quizzes });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// GET /quizzes/create - Form tạo quiz
QuizViewController.get("/create", async (req, res) => {
  try {
    const questions = await QuestionService.getAllQuestions();
    return res.renderWithLayout("quizzes/create", { questions });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// POST /quizzes - Tạo quiz mới
QuizViewController.post("/", async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    const questionIds = Array.isArray(questions)
      ? questions
      : questions
      ? [questions]
      : [];

    await QuizService.createQuiz({ title, description, questions: questionIds });
    return res.redirect("/quizzes");
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// GET /quizzes/:id - Chi tiết quiz
QuizViewController.get("/:id", async (req, res) => {
  try {
    const quiz = await QuizService.getQuizWithQuestions(req.params.id);
    if (!quiz) return res.status(404).send("Quiz not found");
    return res.renderWithLayout("quizzes/detail", { quiz });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// GET /quizzes/:id/edit - Form sửa quiz
QuizViewController.get("/:id/edit", async (req, res) => {
  try {
    const quiz = await QuizService.getQuizWithQuestions(req.params.id);
    if (!quiz) return res.status(404).send("Quiz not found");
    const questions = await QuestionService.getAllQuestions();
    return res.renderWithLayout("quizzes/edit", { quiz, questions });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// PUT /quizzes/:id - Cập nhật quiz
QuizViewController.put("/:id", async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    const questionIds = Array.isArray(questions)
      ? questions
      : questions
      ? [questions]
      : [];

    const updated = await QuizService.updateQuiz(req.params.id, {
      title,
      description,
      questions: questionIds,
    });
    if (!updated) return res.status(404).send("Quiz not found");
    return res.redirect(`/quizzes/${req.params.id}`);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// DELETE /quizzes/:id - Xoá quiz
QuizViewController.delete("/:id", async (req, res) => {
  try {
    const deleted = await QuizService.deleteQuiz(req.params.id);
    if (!deleted) return res.status(404).send("Quiz not found");
    return res.redirect("/quizzes");
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

module.exports = QuizViewController;
