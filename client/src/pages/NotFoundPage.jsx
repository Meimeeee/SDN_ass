import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="page-wrap">
      <div className="alert alert-warning">Không tìm thấy trang.</div>
      <Link className="btn btn-primary" to="/">
        Về trang chính
      </Link>
    </main>
  );
}
