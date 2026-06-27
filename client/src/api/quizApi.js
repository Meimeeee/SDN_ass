import { http } from "./http";

export const quizApi = {
  getQuizzes() {
    return http.get("/quizzes").then((res) => res.data);
  },
  getAttemptQuiz(quizId) {
    return http.get(`/quizzes/${quizId}/attempt`).then((res) => res.data);
  },
  submitQuiz(quizId, answers) {
    return http.post(`/quizzes/${quizId}/submit`, { answers }).then((res) => res.data);
  },
};
