import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoadingButton from "../components/LoadingButton";
import { fetchAttemptQuiz, submitQuizAnswers } from "../store/quizSlice";

export default function QuizAttemptPage() {
  const { quizId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentQuiz, loading, submitLoading, error } = useSelector((state) => state.quizzes);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    dispatch(fetchAttemptQuiz(quizId));
    setAnswers({});
  }, [dispatch, quizId]);

  const questions = currentQuiz?.questions || [];
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

  const handleSelect = (questionId, selectedAnswerIndex) => {
    setAnswers((current) => ({ ...current, [questionId]: selectedAnswerIndex }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = Object.entries(answers).map(([questionId, selectedAnswerIndex]) => ({
      questionId,
      selectedAnswerIndex,
    }));
    const result = await dispatch(submitQuizAnswers({ quizId, answers: payload }));

    if (submitQuizAnswers.fulfilled.match(result)) {
      navigate(`/quizzes/${quizId}/result`);
    }
  };

  return (
    <main className="page-wrap">
      {loading && (
        <div className="d-flex align-items-center gap-2 text-secondary">
          <span className="spinner-border spinner-border-sm" aria-hidden="true" />
          Đang tải bài làm...
        </div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}
      {currentQuiz && (
        <form onSubmit={handleSubmit}>
          <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
            <div>
              <h1 className="h3 mb-1">{currentQuiz.title}</h1>
              <p className="text-secondary mb-0">{currentQuiz.description || "Hoàn thành các câu hỏi bên dưới."}</p>
            </div>
            <span className="badge text-bg-primary fs-6">
              {answeredCount}/{questions.length} đã chọn
            </span>
          </div>

          {questions.length === 0 && <div className="alert alert-info">Quiz này chưa có câu hỏi.</div>}

          <div className="vstack gap-3">
            {questions.map((question, index) => (
              <section className="card shadow-sm" key={question._id}>
                <div className="card-body">
                  <h2 className="h5 mb-3">
                    Câu {index + 1}: {question.text}
                  </h2>
                  <div className="vstack gap-2">
                    {question.options.map((option, optionIndex) => (
                      <label className="answer-option" key={`${question._id}-${optionIndex}`}>
                        <input
                          className="form-check-input me-2"
                          type="radio"
                          name={question._id}
                          value={optionIndex}
                          checked={answers[question._id] === optionIndex}
                          onChange={() => handleSelect(question._id, optionIndex)}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>

          <div className="d-flex justify-content-end mt-4">
            <LoadingButton
              loading={submitLoading}
              className="btn btn-success"
              type="submit"
              disabled={questions.length === 0}
            >
              Nộp bài
            </LoadingButton>
          </div>
        </form>
      )}
    </main>
  );
}
