import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/teacher.css";   // ✅ FIXED

export default function TeacherUnit1() {
  const navigate = useNavigate();

  return (
    <div className="unit-page">

      {/* HEADER */}
      <div className="unit-header">
        <h1>Unit 1</h1>
      </div>

      {/* BG TEXT */}
      <div className="fusion-bg-text">FUSION</div>

      <div className="unit-content">

        {/* 📘 STUDY MATERIAL */}
        <div className="section">
          <h2>📘 Study Material</h2>

          <div className="section-grid">

            <div
              className="section-card"
              onClick={() => navigate("/teacher/unit1/upload-notes")}
            >
              <div className="card-left">
                <span className="card-icon">📒</span>
                <div>
                  <h3>Upload Notes</h3>
                  <p>Add study material</p>
                </div>
              </div>
              <div className="arrow">➜</div>
            </div>

            <div
              className="section-card"
              onClick={() => navigate("/teacher/unit1/upload-ppt")}
            >
              <div className="card-left">
                <span className="card-icon">📑</span>
                <div>
                  <h3>Upload PPT</h3>
                  <p>Upload presentation files</p>
                </div>
              </div>
              <div className="arrow">➜</div>
            </div>

          </div>
        </div>

        {/* 🧠 ASSIGNMENTS */}
        <div className="section">
          <h2>🧠 Assignments</h2>

          <div className="section-grid">

            <div
              className="section-card"
              onClick={() => navigate("/teacher/unit1/assignments")}
            >
              <div className="card-left">
                <span className="card-icon">🧠</span>
                <div>
                  <h3>MCQ Assignment</h3>
                  <p>Create objective assignments</p>
                </div>
              </div>
              <div className="arrow">➜</div>
            </div>

            <div
              className="section-card"
              onClick={() => navigate("/teacher/unit1/subjective")}
            >
              <div className="card-left">
                <span className="card-icon">📝</span>
                <div>
                  <h3>Subjective Assignment</h3>
                  <p>Evaluate written answers</p>
                </div>
              </div>
              <div className="arrow">➜</div>
            </div>

          </div>
        </div>

        {/* 💻 CODING */}
        <div className="section">
          <h2>💻 Coding Practice</h2>

          <div className="section-grid">

            <div
              className="section-card"
              onClick={() => navigate("/teacher/unit/1/coding/add")}
            >
              <div className="card-left">
                <span className="card-icon">💻</span>
                <div>
                  <h3>Add Questions</h3>
                  <p>Add coding problems</p>
                </div>
              </div>
              <div className="arrow">➜</div>
            </div>

            <div
              className="section-card"
              onClick={() => navigate("/teacher/unit/1/coding/results")}
            >
              <div className="card-left">
                <span className="card-icon">📊</span>
                <div>
                  <h3>Coding Results</h3>
                  <p>View student performance</p>
                </div>
              </div>
              <div className="arrow">➜</div>
            </div>

          </div>
        </div>

      </div>

      {/* BACK */}
      <button
        className="back-btn"
        onClick={() => navigate("/teacher/manage-c")}
      >
        ← Go Back
      </button>

    </div>
  );
}