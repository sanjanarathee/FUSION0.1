import React, { useState } from "react";
import axios from "axios";
import "../styles/auth.css";

export default function TeacherSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sections, setSections] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !sections || !password || !confirmPassword) {
      return setMsg("All fields are required");
    }

    if (password !== confirmPassword) {
      return setMsg("Passwords do not match");
    }

    try {
      await axios.post("https://fusion0-1.onrender.com/api/auth/signup", {
        name,
        email,
        role: "teacher",
        password,
        sections: sections.split(",").map((s) => s.trim()),
      });

      setMsg("Signup successful! Wait for admin approval.");

    } catch (err) {
      setMsg(err.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <div className="auth-container">

      {/* HEADER */}
      <div className="register-header">
        🎓 FUSION
        <span>Teacher Signup 👨‍🏫</span>
      </div>

      {/* CENTER CARD */}
      <div className="auth-center-wrapper">

        <div className="auth-center-card">

          <div className="user-circle">👨‍🏫</div>

          <h2>Teacher Signup</h2>

          <p className="auth-sub-text">
            Create your account and request access
          </p>

          <form onSubmit={handleSignup} className="auth-form">

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Sections (e.g. A,B,C)"
              value={sections}
              onChange={(e) => setSections(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button type="submit" className="auth-btn">
              Submit Request
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