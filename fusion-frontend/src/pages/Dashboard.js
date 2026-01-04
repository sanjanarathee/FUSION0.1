import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PageStyles.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("fusionUser"));
  const role = userData?.role || "student";

  // Route protection
  useEffect(() => {
    if (!userData) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    if (role !== "student") {
      alert("Access denied! Only students can access this dashboard.");
      navigate("/teacher-dashboard");
    }
  }, [userData, role, navigate]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">
        Welcome to <span className="fusion-text">Fusion Dashboard</span> 🎓
      </h1>

      <p className="dashboard-subtext">
        You are logged in as <strong>{role}</strong>.
      </p>

      {/* 💻 Learn & Practice Section */}
      <h3 className="unit-heading" style={{ marginTop: "40px" }}>
        💻 Learn & Practice
      </h3>

      <div className="button-container">
        <button
          className="learn-btn c-btn"
          onClick={() => navigate("/learn-c")}
        >
          Learn C Language
        </button>

        <button
          className="learn-btn cpp-btn"
          onClick={() => navigate("/learn-cpp")}
        >
          Learn C++
        </button>
      </div>

      {/* 🏆 Leaderboard Section */}
      <h3 className="unit-heading" style={{ marginTop: "40px" }}>
        🏆 Coding Performance
      </h3>

      <div className="button-container">
        <button
          className="learn-btn"
          onClick={() => navigate("/leaderboard")}
        >
          🏆 View Leaderboard
        </button>
      </div>

      {/* Logout */}
      <button
        className="logout-btn"
        style={{ marginTop: "40px" }}
        onClick={() => {
          localStorage.clear();
          navigate("/login");
        }}
      >
        🚪 Logout
      </button>
    </div>
  );
}
