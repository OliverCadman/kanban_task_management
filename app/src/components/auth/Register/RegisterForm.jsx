import React from "react";

const RegisterForm = () => {
  return (
    <form>
      <div className="form-row mt-1 mb-1">
        <label htmlFor="username" className="form-label">
          Username
        </label>
        <input type="text" id="username" className="form-control" />
      </div>
      <div className="form-row mt-1 mb-1">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input type="email" className="form-control" />
      </div>
      <div className="form-row mt-1 mb-1">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input type="password" id="password" className="form-control" />
      </div>
      <div className="form-row mt-1 mb-1">
        <button type="submit" className="submit-btn pt-1 pb-1">
          Register
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
