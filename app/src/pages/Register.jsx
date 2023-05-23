import React from "react";
import RegisterContainer from "../components/auth/Register/RegisterContainer";
import { useSignUp } from "../auth/useSignup";
import { Link } from "react-router-dom";

const Register = () => {
  const signUp = useSignUp();

  const handleRegister = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    if (username && email && password) {
      signUp({
        username,
        email,
        password,
      });
    }
  };

  return (
    <section className="form--container">
      <div className="form--wrapper p-3">
        <h1>Register</h1>
        <form onSubmit={handleRegister}>
          <div className="form-row mt-1 mb-1">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-control"
            />
          </div>
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
              Register
            </button>
          </div>
          <p className="auth-small">
            Already registered? <Link to="/">Login</Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Register;
