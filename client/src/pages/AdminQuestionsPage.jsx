import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingButton from "../components/LoadingButton";
import { fetchQuizzes } from "../store/quizSlice";
import { createQuestion, deleteQuestion, fetchQuestions, updateQuestion } from "../store/questionSlice";

const emptyForm = {
  text: "",
  options: "",
  keyword: "",
  correctAnswerIndex: 0,
  quizId: "",
};

const toForm = (question) => ({
  text: question.text || "",
  options: (question.options || []).join("\n"),
  keyword: (question.keyword || []).join(", "),
  correctAnswerIndex: question.correctAnswerIndex || 0,
  quizId: "",
});

const toPayload = (form) => ({
  text: form.text.trim(),
  options: form.options
    .split("\n")
    .map((option) => option.trim())
    .filter(Boolean),
  keyword: form.keyword
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean),
  correctAnswerIndex: Number(form.correctAnswerIndex),
});

export default function AdminQuestionsPage() {
  const dispatch = useDispatch();
  const { items: questions, loading, saving, error } = useSelector((state) => state.questions);
  const { items: quizzes, error: quizError } = useSelector((state) => state.quizzes);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchQuestions());
    dispatch(fetchQuizzes());
  }, [dispatch]);

  const optionsCount = useMemo(() => {
    return form.options
      .split("\n")
      .map((option) => option.trim())
      .filter(Boolean).length;
  }, [form.options]);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleEdit = (question) => {
    setEditingId(question._id);
    setForm(toForm(question));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = toPayload(form);
    const action = editingId
      ? updateQuestion({ id: editingId, payload })
      : createQuestion({ ...payload, quizId: form.quizId || undefined });
    const result = await dispatch(action);

    if (createQuestion.fulfilled.match(result) || updateQuestion.fulfilled.match(result)) {
      resetForm();
    }
  };

  const handleDelete = (question) => {
    const ok = window.confirm(`Xóa câu hỏi "${question.text}"?`);

    if (ok) {
      dispatch(deleteQuestion(question._id));
    }
  };

  return (
    <main className="page-wrap">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">Quản lý câu hỏi</h1>
          <p className="text-secondary mb-0">Admin có thể tạo, sửa, xóa và gắn câu hỏi mới vào quiz.</p>
        </div>
        <button className="btn btn-outline-primary" type="button" onClick={() => dispatch(fetchQuestions())}>
          Tải lại
        </button>
      </div>

      {(error || quizError) && <div className="alert alert-danger">{error || quizError}</div>}

      <section className="card shadow-sm mb-4">
        <div className="card-body">
          <h2 className="h5 mb-3">{editingId ? "Sửa câu hỏi" : "Tạo câu hỏi"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label" htmlFor="text">
                  Nội dung câu hỏi
                </label>
                <input
                  className="form-control"
                  id="text"
                  name="text"
                  value={form.text}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12 col-lg-7">
                <label className="form-label" htmlFor="options">
                  Đáp án, mỗi dòng một lựa chọn
                </label>
                <textarea
                  className="form-control option-textarea"
                  id="options"
                  name="options"
                  value={form.options}
                  onChange={handleChange}
                  required
                />
                <div className="form-text">Cần ít nhất 2 lựa chọn.</div>
              </div>
              <div className="col-12 col-lg-5">
                <label className="form-label" htmlFor="correctAnswerIndex">
                  Đáp án đúng
                </label>
                <select
                  className="form-select"
                  id="correctAnswerIndex"
                  name="correctAnswerIndex"
                  value={form.correctAnswerIndex}
                  onChange={handleChange}
                  required
                >
                  {Array.from({ length: Math.max(optionsCount, 1) }, (_, index) => (
                    <option key={index} value={index}>
                      Lựa chọn {index + 1}
                    </option>
                  ))}
                </select>
                <label className="form-label mt-3" htmlFor="keyword">
                  Keywords
                </label>
                <input
                  className="form-control"
                  id="keyword"
                  name="keyword"
                  value={form.keyword}
                  onChange={handleChange}
                  placeholder="math, easy"
                />
                {!editingId && (
                  <>
                    <label className="form-label mt-3" htmlFor="quizId">
                      Gắn vào quiz
                    </label>
                    <select
                      className="form-select"
                      id="quizId"
                      name="quizId"
                      value={form.quizId}
                      onChange={handleChange}
                    >
                      <option value="">Không gắn ngay</option>
                      {quizzes.map((quiz) => (
                        <option key={quiz._id} value={quiz._id}>
                          {quiz.title}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </div>
            </div>
            <div className="d-flex gap-2 mt-4">
              <LoadingButton loading={saving} type="submit">
                {editingId ? "Lưu thay đổi" : "Tạo câu hỏi"}
              </LoadingButton>
              {editingId && (
                <button className="btn btn-outline-secondary" type="button" onClick={resetForm}>
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      <section className="bg-white border rounded shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle table-fixed mb-0">
            <thead>
              <tr>
                <th scope="col">Câu hỏi</th>
                <th scope="col">Đáp án</th>
                <th scope="col">Đúng</th>
                <th scope="col">Keywords</th>
                <th scope="col" className="text-end">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="5" className="text-secondary">
                    <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                    Đang tải câu hỏi...
                  </td>
                </tr>
              )}
              {!loading && questions.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-secondary">
                    Chưa có câu hỏi nào.
                  </td>
                </tr>
              )}
              {questions.map((question) => (
                <tr key={question._id}>
                  <td>{question.text}</td>
                  <td>{(question.options || []).join(" | ")}</td>
                  <td>{Number(question.correctAnswerIndex) + 1}</td>
                  <td>{(question.keyword || []).join(", ") || "-"}</td>
                  <td className="text-end">
                    <div className="btn-group btn-group-sm">
                      <button className="btn btn-outline-primary" type="button" onClick={() => handleEdit(question)}>
                        Sửa
                      </button>
                      <button className="btn btn-outline-danger" type="button" onClick={() => handleDelete(question)}>
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
