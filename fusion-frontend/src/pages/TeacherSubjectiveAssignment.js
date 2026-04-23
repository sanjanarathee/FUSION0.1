import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/teacher.css";   // ✅ FIXED

export default function TeacherSubjectiveAssignment() {
  const navigate = useNavigate();

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
      onClick={() => navigate("/teacher/unit3/subjective/create")}
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
      onClick={() => navigate("/teacher/unit3/subjective/manage")}
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
      onClick={() => navigate("/teacher/unit/3/subjective/results")}
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