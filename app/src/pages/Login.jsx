import React from "react";
import { useLogin } from "../auth/useLogin";
import { Link } from "react-router-dom";

const Login = () => {
  const login = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (email && password) {
      login({
        email,
        password,
      });
    }
  };

  return (
    <section className="form--container">
      <div className="form--wrapper p-3">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <div className="form-row mt-1 mb-1">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
            />
          </div>
          <div className="form-row mt-1 mb-1">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
            />
          </div>
          <div className="form-row mt-1 mb-1">
            <button type="submit" className="submit-btn pt-1 pb-1">
              Login
            </button>
          </div>
          <p className="auth-small">
            Don't have an account? <Link to="/">Register</Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;
