import { http } from "./http";

export const quizApi = {
  getQuizzes() {
    return http.get("/quizzes").then((res) => res.data);
  },
  createQuiz(payload) {
    return http.post("/quizzes", payload).then((res) => res.data);
  },
  updateQuiz(id, payload) {
    return http.put(`/quizzes/${id}`, payload).then((res) => res.data);
  },
  deleteQuiz(id) {
    return http.delete(`/quizzes/${id}`).then((res) => res.data);
  },
  getAttemptQuiz(quizId) {
    return http.get(`/quizzes/${quizId}/attempt`).then((res) => res.data);
  },
  submitQuiz(quizId, answers) {
    return http.post(`/quizzes/${quizId}/submit`, { answers }).then((res) => res.data);
  },
};
