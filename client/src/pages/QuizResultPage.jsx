import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function QuizResultPage() {
  const { quizId } = useParams();
  const { result } = useSelector((state) => state.quizzes);

  if (!result || result.quizId !== quizId) {
    return (
      <main className="page-wrap">
        <div className="alert alert-warning">
          Chưa có kết quả trong phiên hiện tại. Hãy làm bài và nộp lại.
        </div>
        <Link className="btn btn-primary" to={`/quizzes/${quizId}`}>
          Làm bài
        </Link>
      </main>
    );
  }

  return (
    <main className="page-wrap">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">Kết quả: {result.quizTitle}</h1>
          <p className="text-secondary mb-0">
            Đúng {result.correctCount}/{result.totalQuestions} câu, đã trả lời {result.answeredCount} câu.
          </p>
        </div>
        <div className="display-6 fw-semibold text-primary">{result.scorePercent}%</div>
      </div>

      <div className="table-responsive bg-white border rounded shadow-sm">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th scope="col">Câu hỏi</th>
              <th scope="col">Bạn chọn</th>
              <th scope="col">Đáp án đúng</th>
              <th scope="col">Kết quả</th>
            </tr>
          </thead>
          <tbody>
            {result.results.map((item, index) => (
              <tr key={item.questionId}>
                <td>
                  <span className="fw-semibold">Câu {index + 1}.</span> {item.text}
                </td>
                <td>{item.selectedAnswerIndex === null ? "Chưa chọn" : item.selectedAnswerIndex + 1}</td>
                <td>{item.correctAnswerIndex + 1}</td>
                <td>
                  <span className={`badge ${item.isCorrect ? "text-bg-success" : "text-bg-danger"}`}>
                    {item.isCorrect ? "Đúng" : "Sai"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex gap-2 mt-4">
        <Link className="btn btn-primary" to="/quizzes">
          Về danh sách
        </Link>
        <Link className="btn btn-outline-secondary" to={`/quizzes/${quizId}`}>
          Làm lại
        </Link>
      </div>
    </main>
  );
}
