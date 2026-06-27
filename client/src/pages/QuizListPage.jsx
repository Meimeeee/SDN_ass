import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuizzes } from "../store/quizSlice";

export default function QuizListPage() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.quizzes);

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  return (
    <main className="page-wrap">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">Danh sách bài quiz</h1>
          <p className="text-secondary mb-0">Chọn một bài để bắt đầu làm trắc nghiệm.</p>
        </div>
        <button className="btn btn-outline-primary" type="button" onClick={() => dispatch(fetchQuizzes())}>
          Tải lại
        </button>
      </div>

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
                  <Link className="btn btn-primary" to={`/quizzes/${quiz._id}`}>
                    Làm bài
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
