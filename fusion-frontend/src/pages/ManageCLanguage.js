import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/teacher.css"; // same theme CSS

export default function ManageCLanguage() {
  const navigate = useNavigate();

  return (
  <div className="unit-page">

    {/* HEADER */}
    <div className="unit-header">
      <h1>📘 Manage C Language</h1>
    </div>

    {/* BG TEXT */}
    <div className="fusion-bg-text">FUSION</div>

    {/* CONTENT */}
    <div className="unit-content">

      <div className="section">
        <h2>📘 Manage Units</h2>

        <div className="section-grid">

          <div
            className="section-card"
            onClick={() => navigate("/teacher/unit1")}
          >
            <div className="card-left">
              <span className="card-icon">1️⃣</span>
              <div>
                <h3>Unit 1</h3>
                <p>Manage Unit 1 content</p>
              </div>
            </div>
            <div className="arrow">➜</div>
          </div>

          <div
            className="section-card"
            onClick={() => navigate("/teacher/unit2")}
          >
            <div className="card-left">
              <span className="card-icon">2️⃣</span>
              <div>
                <h3>Unit 2</h3>
                <p>Manage Unit 2 content</p>
              </div>
            </div>
            <div className="arrow">➜</div>
          </div>

          <div
            className="section-card"
            onClick={() => navigate("/teacher/unit3")}
          >
            <div className="card-left">
              <span className="card-icon">3️⃣</span>
              <div>
                <h3>Unit 3</h3>
                <p>Manage Unit 3 content</p>
              </div>
            </div>
            <div className="arrow">➜</div>
          </div>

          <div
            className="section-card"
            onClick={() => navigate("/teacher/unit4")}
          >
            <div className="card-left">
              <span className="card-icon">4️⃣</span>
              <div>
                <h3>Unit 4</h3>
                <p>Manage Unit 4 content</p>
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
      onClick={() => navigate("/teacher-dashboard")}
    >
      ← Back to Teacher Dashboard
    </button>

  </div>
);
}