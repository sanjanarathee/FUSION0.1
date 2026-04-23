import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          identifier: identifier.trim(),
          password,
        }
      );

      localStorage.setItem(
        "fusionUser",
        JSON.stringify({
          token: res.data.token,
          user: res.data.user,
        })
      );

      setMsg("Login successful!");

      setTimeout(() => {
        if (res.data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else if (res.data.user.role === "teacher") {
          navigate("/teacher-dashboard");
        } else {
          navigate("/dashboard");
        }
      }, 800);

    } catch (err) {
      setMsg(err.response?.data?.msg || "Invalid credentials");
    }
  };

  return (
    <div className="auth-page">

      {/* HEADER */}
      <div className="register-header">
        🎓 FUSION
        <span>Login 🔐</span>
      </div>

      {/* CENTER CARD */}
      <div className="auth-center-wrapper">

        <div className="auth-center-card">

          <div className="user-circle">🔐</div>

          <h2>Login</h2>

          <div className="auth-sub-text">
            Welcome back! Please login to continue
          </div>

          <form onSubmit={handleLogin} className="auth-form">

            <input
              type="text"
              placeholder="Email or Roll Number"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="auth-btn">
              Login
            </button>
          </form>

          {/* MESSAGE */}
          {msg && (
            <p
              className="auth-message"
              style={{
                color: msg.includes("successful")
                  ? "#22c55e"
                  : "#ef4444",
              }}
            >
              {msg}
            </p>
          )}

          {/* REGISTER */}
          <p className="auth-bottom-text">
            First time user?{" "}
            <span onClick={() => navigate("/register")}>
              Register
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}