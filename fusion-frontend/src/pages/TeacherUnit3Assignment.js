import React from "react";
import { useNavigate  } from "react-router-dom";
import "../styles/teacher.css";

export default function TeacherUnit3Assignment() {
  const navigate = useNavigate();
const unit = 3;  // ✅ ADD THIS

  return (
  <div className="unit-page">

    {/* HEADER */}
    <div className="unit-header">
      <h1> MCQ Assignments</h1>
    </div>

    {/* ASSIGNMENT SECTION */}
    <div className="section">

      {/* GRID */}
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
          onClick={() => navigate("/teacher/unit3/manage-assignments?unit=3")}
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
          onClick={() => navigate("/teacher/unit3/results")}
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

      {/* ✅ BACK BUTTON OUTSIDE GRID */}
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <button
          className="view-btn"
          onClick={() => window.history.back()}
        >
          ⬅ Back
        </button>
      </div>

    </div>
  </div>
);
}