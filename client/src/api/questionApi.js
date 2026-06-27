import { http } from "./http";

export const questionApi = {
  getQuestions() {
    return http.get("/questions").then((res) => res.data);
  },
  createQuestion(payload) {
    return http.post("/questions", payload).then((res) => res.data);
  },
  updateQuestion(id, payload) {
    return http.put(`/questions/${id}`, payload).then((res) => res.data);
  },
  deleteQuestion(id) {
    return http.delete(`/questions/${id}`).then((res) => res.data);
  },
  addQuestionToQuiz(quizId, payload) {
    return http.post(`/quizzes/${quizId}/question`, payload).then((res) => res.data);
  },
};
