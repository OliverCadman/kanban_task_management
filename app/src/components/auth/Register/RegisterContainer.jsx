import React from "react";
import RegisterForm from "./RegisterForm";

const RegisterContainer = () => {
  return (
    <section className="form--container">
      <div className="form--wrapper p-3">
        <h1>Register</h1>
        <RegisterForm />
      </div>
    </section>
  );
};

export default RegisterContainer;
