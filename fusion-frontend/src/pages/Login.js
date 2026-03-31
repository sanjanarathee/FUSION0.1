import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PageStyles.css";
export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        identifier: identifier.trim(),
        password,
      });

      localStorage.setItem("fusionUser", JSON.stringify(res.data.user));
localStorage.setItem("token", res.data.token);   // 🔥 STORE TOKEN


      setMsg("✅ Login successful!");

      if (res.data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (res.data.user.role === "teacher") {
        navigate("/teacher-dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      setMsg(err.response?.data?.msg || "Invalid credentials, try again!");
    }
  };

  return (
    <div className="login-page">
      <div className="form-card">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
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

          <button type="submit">Login</button>
        </form>

        <p
          className="message"
          style={{
            color: msg.includes("successful") ? "limegreen" : "rgb(255,80,80)",
          }}
        >
          {msg}
        </p>

        <p>
  First time user?{" "}
  <span
    onClick={() => navigate("/register")}
    style={{ color: "#4da6ff", cursor: "pointer", fontWeight: "600" }}
  >
    Register
  </span>
</p>
      </div>
    </div>
  );
}
