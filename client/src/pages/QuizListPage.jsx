import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoadingButton from "../components/LoadingButton";
import { createQuiz, deleteQuiz, fetchQuizzes, updateQuiz } from "../store/quizSlice";
import { fetchQuestions } from "../store/questionSlice";

const emptyQuizForm = { title: "", description: "", questions: [] };

const getQuestionId = (question) => {
  if (!question) return "";
  return typeof question === "string" ? question : question._id || String(question);
};

export default function QuizListPage() {
  const dispatch = useDispatch();
  const { items, loading, saving, error } = useSelector((state) => state.quizzes);
  const {
    items: questions,
    loading: questionsLoading,
    error: questionsError,
  } = useSelector((state) => state.questions);
  const { user } = useSelector((state) => state.auth);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form, setForm] = useState(emptyQuizForm);
  const [editingId, setEditingId] = useState(null);
  const isAdmin = user?.admin === true;

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchQuestions());
    }
  }, [dispatch, isAdmin]);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleQuestionToggle = (event) => {
    const { checked, value } = event.target;

    setForm((current) => ({
      ...current,
      questions: checked
        ? [...current.questions, value]
        : current.questions.filter((questionId) => questionId !== value),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isAdmin) {
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      questions: form.questions,
    };

    const action = editingId ? updateQuiz({ id: editingId, payload }) : createQuiz(payload);
    const result = await dispatch(action);

    if (createQuiz.fulfilled.match(result) || updateQuiz.fulfilled.match(result)) {
      setForm(emptyQuizForm);
      setEditingId(null);
      setShowCreateForm(false);
    }
  };

  const handleEdit = (quiz) => {
    if (!isAdmin) {
      return;
    }

    setEditingId(quiz._id);
    setForm({
      title: quiz.title || "",
      description: quiz.description || "",
      questions: (quiz.questions || []).map(getQuestionId).filter(Boolean),
    });
    setShowCreateForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (quiz) => {
    if (!isAdmin) {
      return;
    }

    const ok = window.confirm(`Bạn có chắc chắn muốn xóa quiz "${quiz.title}" không?`);

    if (ok) {
      dispatch(deleteQuiz(quiz._id));
    }
  };

  const resetForm = () => {
    setForm(emptyQuizForm);
    setEditingId(null);
    setShowCreateForm(false);
  };

  return (
    <main className="page-wrap">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">Danh sách bài quiz</h1>
          <p className="text-secondary mb-0">Chọn một bài để bắt đầu làm trắc nghiệm.</p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          {isAdmin && (
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => {
                if (showCreateForm) {
                  resetForm();
                } else {
                  setShowCreateForm(true);
                }
              }}
            >
              {showCreateForm ? "Đóng form" : "Thêm quiz"}
            </button>
          )}
          <button className="btn btn-outline-primary" type="button" onClick={() => dispatch(fetchQuizzes())}>
            Tải lại
          </button>
        </div>
      </div>

      {isAdmin && showCreateForm && (
        <section className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h5 mb-3">{editingId ? "Sửa quiz" : "Thêm quiz"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12 col-md-5">
                  <label className="form-label" htmlFor="title">
                    Tiêu đề
                  </label>
                  <input
                    className="form-control"
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12 col-md-7">
                  <label className="form-label" htmlFor="description">
                    Mô tả
                  </label>
                  <input
                    className="form-control"
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Chọn câu hỏi cho quiz</label>
                  {questionsLoading && (
                    <div className="text-secondary">
                      <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                      Đang tải câu hỏi...
                    </div>
                  )}
                  {!questionsLoading && questions.length === 0 && (
                    <div className="alert alert-info mb-0">Chưa có câu hỏi nào để gắn vào quiz.</div>
                  )}
                  {!questionsLoading && questions.length > 0 && (
                    <div className="border rounded p-3" style={{ maxHeight: 220, overflowY: "auto" }}>
                      <div className="row g-2">
                        {questions.map((question) => (
                          <div className="col-12 col-lg-6" key={question._id}>
                            <label className="form-check border rounded p-2 h-100">
                              <input
                                className="form-check-input ms-0 me-2"
                                type="checkbox"
                                value={question._id}
                                checked={form.questions.includes(question._id)}
                                onChange={handleQuestionToggle}
                              />
                              <span className="form-check-label">{question.text}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="col-12 d-flex gap-2">
                  <LoadingButton loading={saving} type="submit">
                    Lưu quiz
                  </LoadingButton>
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    disabled={saving}
                    onClick={resetForm}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>
      )}

      {loading && (
        <div className="d-flex align-items-center gap-2 text-secondary">
          <span className="spinner-border spinner-border-sm" aria-hidden="true" />
          Đang tải quiz...
        </div>
      )}
      {(error || questionsError) && <div className="alert alert-danger">{error || questionsError}</div>}
      {!loading && items.length === 0 && <div className="alert alert-info">Chưa có bài quiz nào.</div>}

      <div className="row g-3">
        {items.map((quiz) => (
          <div className="col-12 col-md-6 col-xl-4" key={quiz._id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h2 className="h5">{quiz.title}</h2>
                <p className="text-secondary flex-grow-1">{quiz.description || "Không có mô tả."}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="badge text-bg-light">{quiz.questions?.length || 0} câu hỏi</span>
                  <div className="d-flex flex-wrap gap-2">
                    {isAdmin && (
                      <>
                        <button className="btn btn-outline-primary btn-sm" type="button" onClick={() => handleEdit(quiz)}>
                          Sửa
                        </button>
                        <button className="btn btn-outline-danger btn-sm" type="button" onClick={() => handleDelete(quiz)}>
                          Xóa
                        </button>
                      </>
                    )}
                    <Link className="btn btn-primary btn-sm" to={`/quizzes/${quiz._id}`}>
                      Làm bài
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
