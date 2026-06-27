import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoadingButton from "../components/LoadingButton";
import { createQuiz, deleteQuiz, fetchQuizzes, updateQuiz } from "../store/quizSlice";

export default function QuizListPage() {
  const dispatch = useDispatch();
  const { items, loading, saving, error } = useSelector((state) => state.quizzes);
  const { user } = useSelector((state) => state.auth);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await dispatch(
      editingId
        ? updateQuiz({
            id: editingId,
            payload: {
              title: form.title.trim(),
              description: form.description.trim(),
            },
          })
        : createQuiz({
        title: form.title.trim(),
        description: form.description.trim(),
      })
    );

    if (createQuiz.fulfilled.match(result) || updateQuiz.fulfilled.match(result)) {
      setForm({ title: "", description: "" });
      setEditingId(null);
      setShowCreateForm(false);
    }
  };

  const handleEdit = (quiz) => {
    setEditingId(quiz._id);
    setForm({
      title: quiz.title || "",
      description: quiz.description || "",
    });
    setShowCreateForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (quiz) => {
    const ok = window.confirm(`Xóa quiz "${quiz.title}"? Các câu hỏi trong quiz cũng sẽ bị xóa.`);

    if (ok) {
      dispatch(deleteQuiz(quiz._id));
    }
  };

  const resetForm = () => {
    setForm({ title: "", description: "" });
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
          {user?.admin && (
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

      {user?.admin && showCreateForm && (
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
      {error && <div className="alert alert-danger">{error}</div>}
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
                    {user?.admin && (
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
