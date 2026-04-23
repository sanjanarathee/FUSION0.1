import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function SetPassword() {
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSetPassword = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!rollNumber || !password) {
      return setMsg("Please fill all fields");
    }

    try {
      const res = await axios.post(
        "https://fusion0-1.onrender.com/api/auth/set-password",
        {
          rollNumber: rollNumber.trim(),
          password: password.trim(),
        }
      );

      setMsg(res.data.msg || "Password set successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setMsg(err.response?.data?.msg || "Error setting password");
    }
  };

  return (
    <div className="auth-container">

      {/* HEADER */}
      <div className="register-header">
        🎓 FUSION
        <span>Set Your Password 🔐</span>
      </div>

      {/* CENTER CARD */}
      <div className="auth-center-wrapper">

        <div className="auth-center-card">

          <div className="user-circle">🔐</div>

          <h2>Set Password</h2>

          <p className="auth-sub-text">
            Enter your roll number and create password
          </p>

          <form onSubmit={handleSetPassword} className="auth-form">

            <input
              type="text"
              placeholder="Roll Number"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="auth-btn">
              Set Password
            </button>

          </form>

          {/* MESSAGE */}
          {msg && (
            <p className="auth-message">
              {msg}
            </p>
          )}

        </div>
      </div>
    </div>
  );
}