import React from "react";
import { useNavigate } from "react-router-dom";
import "./PageStyles.css";

export default function CUnit3() {
  const navigate = useNavigate();

  return (
    <div className="learn-container">
      <h1 className="learn-title">📘 Unit 3 Resources</h1>

      <p className="learn-text">
        Explore detailed materials for all C programming concepts in Unit 3.
      </p>

      {/* 📁 View Study Materials */}
      <h3 className="unit-heading" style={{ marginTop: "40px" }}>
        📁 View Study Materials
      </h3>

      <div
        className="button-container"
        style={{ gap: "20px", flexWrap: "wrap", justifyContent: "center" }}
      >
        {/* Notes */}
        <button
          className="unit-btn"
          onClick={() => navigate("/student/notes/c/3")}
        >
          📝 Notes
        </button>

        {/* PPTs */}
        <button
          className="unit-btn"
          onClick={() => navigate("/learn-c/unit3/ppt")}
        >
          📊 PPTs
        </button>

        {/* Coding Practice */}
        <button
          className="unit-btn"
          onClick={() => navigate("/learn-c/unit3/coding")}
        >
          💻 Coding Practice
        </button>

        {/* Quiz */}
        <button
          className="unit-btn"
          onClick={() => navigate("/student-assignment?unit=3")}
        >
          🎯 Take Unit 3 Quiz
        </button>

        <button
  className="dashboard-btn pink"
  onClick={() => navigate("/learn-c/unit/3/subjective")}   // ✅ CORRECT
>
  📝 Subjective Assignment
</button>
      </div>

      <button
        className="back-btn"
        onClick={() => navigate("/learn-c")}
        style={{ marginTop: "40px" }}
      >
        ⬅ Back to Unit Selection
      </button>
    </div>
  );
}
