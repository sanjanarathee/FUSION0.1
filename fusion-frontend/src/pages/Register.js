import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="auth-container">

      {/* HEADER */}
      <div className="register-header">
        🎓 FUSION
        <span>Start Your Journey ✨</span>
      </div>

      {/* MAIN CARD */}
      <div className="auth-card">

        {/* LEFT */}
        <div className="register-left">
          <h2>Welcome to</h2>
          <h1 className="fusion-text">FUSION</h1>
          {/* <div className="underline"></div> */}

          <p>
            The all-in-one platform to manage courses, assignments,
            students and coding evaluations.
          </p>

          <img
            src="/graduation.png"
            alt="illustration"
            className="illustration"
          />
        </div>

        {/* RIGHT */}
        <div className="register-right">

          <div className="user-circle">👤</div>

          <h2>Select Registration Type</h2>

          <p className="auth-sub-text">
            Choose how you want to register with Fusion
          </p>

          {/* STUDENT */}
          <div
            className="register-option"
            onClick={() => navigate("/set-password")}
          >
            <div className="option-left">
              <div className="option-icon">🎓</div>
              <div>
                <h4>Register as Student</h4>
                <p>
                  Get access to courses, assignments and coding challenges
                </p>
              </div>
            </div>
            <span className="arrow">→</span>
          </div>

          {/* TEACHER */}
          <div
            className="register-option"
            onClick={() => navigate("/teacher-signup")}
          >
            <div className="option-left">
              <div className="option-icon">👨‍🏫</div>
              <div>
                <h4>Register as Teacher</h4>
                <p>
                  Create and manage courses, assignments and evaluate students
                </p>
              </div>
            </div>
            <span className="arrow">→</span>
          </div>

        </div>
      </div>

      {/* LOGIN LINK */}
      <p className="auth-bottom-text">
        Already have an account?{" "}
        <span onClick={() => navigate("/login")}>
          Login here
        </span>
      </p>

    </div>
  );
}