import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/teacher.css";

export default function TeacherSubjectiveAssignment() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 dynamic unit detect
  const getUnitFromPath = () => {
    const match = location.pathname.match(/unit(\d+)/);
    return match ? Number(match[1]) : 1;
  };

  const unit = getUnitFromPath();

  return (
    <div className="unit-page">

      {/* Header */}
      <div className="unit-header">
        <h2>Subjective Assignments</h2>
      </div>

      <div className="section"></div>

      {/* Cards */}
      <div className="section-grid">

        <div
          className="section-card"
          onClick={() => navigate(`/teacher/unit${unit}/subjective/create`)}
        >
          <div className="card-left">
            <span className="card-icon">📝</span>
            <div>
              <h3>Subjective Assignment</h3>
              <p>Create subjective assignments</p>
            </div>
          </div>
          <div className="arrow">→</div>
        </div>

        <div
          className="section-card"
          onClick={() => navigate(`/teacher/unit${unit}/subjective/manage`)}
        >
          <div className="card-left">
            <span className="card-icon">📁</span>
            <div>
              <h3>Manage Assignments</h3>
              <p>Edit / delete assignments</p>
            </div>
          </div>
          <div className="arrow">→</div>
        </div>

        <div
          className="section-card"
          onClick={() => navigate(`/teacher/unit/${unit}/subjective/results`)}
        >
          <div className="card-left">
            <span className="card-icon">📊</span>
            <div>
              <h3>Results</h3>
              <p>View student performance</p>
            </div>
          </div>
          <div className="arrow">→</div>
        </div>

      </div>
    </div>
  );
}