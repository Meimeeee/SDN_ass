import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoadingButton from "../components/LoadingButton";
import { clearAuthError, login } from "../store/authSlice";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, token } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ username: "", password: "" });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      navigate(location.state?.from?.pathname || "/quizzes", { replace: true });
    }
  }, [location.state, navigate, token]);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(login(form));
  };

  return (
    <main className="auth-panel">
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h1 className="h4 mb-3">Đăng nhập</h1>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="username">
                Username
              </label>
              <input
                className="form-control"
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                className="form-control"
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <LoadingButton loading={loading} className="btn btn-primary w-100" type="submit">
              Đăng nhập
            </LoadingButton>
          </form>
          <p className="text-secondary small mt-3 mb-0">
            Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
