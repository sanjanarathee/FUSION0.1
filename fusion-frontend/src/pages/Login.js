import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./PageStyles.css";

export default function Login() {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      console.log("➡️ Sending login data:", { email, password, role });

      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: email.toLowerCase().trim(),
        password,
        role,
      });

      console.log("✅ Backend response:", res.data);

      // ✅ Save user directly (no nested user object)
      localStorage.setItem("fusionUser", JSON.stringify(res.data.user));
      localStorage.setItem("userId", res.data.user._id);

      console.log("Stored userId:", res.data.user._id);



      setMsg("✅ Login successful!");

      // ✅ Redirect based on role
      if (res.data.user.role === "teacher") {
        navigate("/teacher-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("❌ Login Error:", err.response?.data || err.message);
      setMsg(err.response?.data?.msg || "Invalid credentials, try again!");
    }
  };

  return (
    <div className="login-page">
      {/* Toggle Buttons */}
      <div className="role-toggle">
        <button
          className={role === "student" ? "active" : ""}
          onClick={() => setRole("student")}
        >
          Student Login
        </button>
        <button
          className={role === "teacher" ? "active" : ""}
          onClick={() => setRole("teacher")}
        >
          Teacher Login
        </button>
      </div>

      {/* Login Form */}
      <div className="form-card">
        <h2>{role === "student" ? "Student Login" : "Teacher Login"}</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        {/* Message */}
        <p
          className="message"
          style={{
            color: msg.includes("successful") ? "limegreen" : "rgb(255,80,80)",
          }}
        >
          {msg}
        </p>

        <p className="bottom-text">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
