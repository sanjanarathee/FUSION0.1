import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/teacher.css";   // ✅ SAME THEME

export default function TeacherUnit4Assignment() {
  const navigate = useNavigate();
  const unit = 4;

  return (
    <div className="unit-page">

      {/* HEADER */}
      <div className="unit-header">
        <h1>MCQ Assignments</h1>
      </div>

      {/* SECTION */}
      <div className="section">

        <div className="section-grid assignments-grid">

          {/* CREATE */}
          <div
            className="section-card"
            onClick={() => navigate(`/teacher/unit/${unit}/create-assignment`)}
          >
            <div className="card-left">
              <div className="card-icon">📝</div>
              <div>
                <h3>MCQ Assignment</h3>
                <p>Create objective assignments</p>
              </div>
            </div>
            <div className="arrow">➜</div>
          </div>

          {/* MANAGE */}
          <div
            className="section-card"
            onClick={() => navigate(`/teacher/unit${unit}/assignment-manage?unit=${unit}`)}
          >
            <div className="card-left">
              <div className="card-icon">📁</div>
              <div>
                <h3>Manage Assignments</h3>
                <p>Edit / delete assignments</p>
              </div>
            </div>
            <div className="arrow">➜</div>
          </div>

          {/* RESULTS */}
          <div
            className="section-card"
            onClick={() => navigate(`/teacher/unit${unit}/results`)}
          >
            <div className="card-left">
              <div className="card-icon">📊</div>
              <div>
                <h3>Results</h3>
                <p>View student performance</p>
              </div>
            </div>
            <div className="arrow">➜</div>
          </div>

        </div>

        {/* BACK BUTTON */}
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <button
            className="view-btn"
            onClick={() => navigate("/teacher/unit4")}
          >
            ⬅ Back
          </button>
        </div>

      </div>
    </div>
  );
}