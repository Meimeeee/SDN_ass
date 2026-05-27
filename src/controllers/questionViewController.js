const { Router } = require("express");
const QuestionService = require("../services/question.service");

const QuestionViewController = Router();

// Parse options/keywords từ textarea (hỗ trợ cả newline và comma)
function parseList(value) {
  if (!value) return [];
  return value
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// GET /questions - Danh sách câu hỏi
QuestionViewController.get("/", async (req, res) => {
  try {
    const questions = await QuestionService.getAllQuestions();
    return res.renderWithLayout("questions/list", { questions });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// GET /questions/create - Form tạo câu hỏi
QuestionViewController.get("/create", async (req, res) => {
  try {
    return res.renderWithLayout("questions/create", {});
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// POST /questions - Tạo câu hỏi mới
QuestionViewController.post("/", async (req, res) => {
  try {
    const { text, options, correctAnswerIndex, keyword } = req.body;
    const parsedOptions = parseList(options);
    const parsedKeyword = parseList(keyword);
    await QuestionService.createQuestion({
      text,
      options: parsedOptions,
      correctAnswerIndex: Number(correctAnswerIndex),
      keyword: parsedKeyword,
    });
    return res.redirect("/questions");
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// GET /questions/:id - Chi tiết câu hỏi
QuestionViewController.get("/:id", async (req, res) => {
  try {
    const question = await QuestionService.getQuestionById(req.params.id);
    if (!question) return res.status(404).send("Question not found");
    return res.renderWithLayout("questions/detail", { question });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// GET /questions/:id/edit - Form sửa câu hỏi
QuestionViewController.get("/:id/edit", async (req, res) => {
  try {
    const question = await QuestionService.getQuestionById(req.params.id);
    if (!question) return res.status(404).send("Question not found");
    return res.renderWithLayout("questions/edit", { question });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// PUT /questions/:id - Cập nhật câu hỏi
QuestionViewController.put("/:id", async (req, res) => {
  try {
    const { text, options, correctAnswerIndex, keyword } = req.body;
    const parsedOptions = parseList(options);
    const parsedKeyword = parseList(keyword);
    const updated = await QuestionService.updateQuestion(req.params.id, {
      text,
      options: parsedOptions,
      correctAnswerIndex: Number(correctAnswerIndex),
      keyword: parsedKeyword,
    });
    if (!updated) return res.status(404).send("Question not found");
    return res.redirect(`/questions/${req.params.id}`);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// DELETE /questions/:id - Xoá câu hỏi
QuestionViewController.delete("/:id", async (req, res) => {
  try {
    const deleted = await QuestionService.deleteQuestion(req.params.id);
    if (!deleted) return res.status(404).send("Question not found");
    return res.redirect("/questions");
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

module.exports = QuestionViewController;
