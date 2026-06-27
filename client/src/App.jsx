import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AppNavbar from "./components/AppNavbar";
import ProtectedRoute from "./routes/ProtectedRoute";
import { getMe } from "./store/authSlice";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import QuizListPage from "./pages/QuizListPage";
import QuizAttemptPage from "./pages/QuizAttemptPage";
import QuizResultPage from "./pages/QuizResultPage";
import AdminQuestionsPage from "./pages/AdminQuestionsPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(getMe());
    }
  }, [dispatch, token]);

  return (
    <div className="app-shell">
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Navigate to={token ? "/quizzes" : "/login"} replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/quizzes"
          element={
            <ProtectedRoute>
              <QuizListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizzes/:quizId"
          element={
            <ProtectedRoute>
              <QuizAttemptPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizzes/:quizId/result"
          element={
            <ProtectedRoute>
              <QuizResultPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/questions"
          element={
            <ProtectedRoute adminOnly>
              <AdminQuestionsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}
