import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoadingButton from "../components/LoadingButton";
import { clearAuthError, register } from "../store/authSlice";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ username: "", password: "", admin: false });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      navigate("/quizzes", { replace: true });
    }
  }, [navigate, token]);

  const handleChange = (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [event.target.name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(register(form));
  };

  return (
    <main className="auth-panel">
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h1 className="h4 mb-3">Đăng ký</h1>
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
                minLength={4}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                id="admin"
                name="admin"
                type="checkbox"
                checked={form.admin}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="admin">
                Tạo tài khoản Admin để test CRUD
              </label>
            </div>
            <LoadingButton loading={loading} className="btn btn-primary w-100" type="submit">
              Tạo tài khoản
            </LoadingButton>
          </form>
          <p className="text-secondary small mt-3 mb-0">
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
