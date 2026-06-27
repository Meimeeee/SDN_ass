import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";

export default function AppNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom">
      <div className="container">
        <Link className="navbar-brand fw-semibold" to="/">
          Quiz App
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {token && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/quizzes">
                  Bài quiz
                </NavLink>
              </li>
            )}
            {user?.admin && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin/questions">
                  Quản lý câu hỏi
                </NavLink>
              </li>
            )}
          </ul>
          <div className="d-flex align-items-center gap-2">
            {token ? (
              <>
                <span className="text-secondary small">
                  {user?.username || "User"} {user?.admin ? "(Admin)" : ""}
                </span>
                <button className="btn btn-outline-secondary btn-sm" type="button" onClick={handleLogout}>
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-primary btn-sm" to="/login">
                  Đăng nhập
                </Link>
                <Link className="btn btn-primary btn-sm" to="/register">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
