import React from "react";
import { useNavigate } from "react-router-dom";

export default function TeacherSubjectiveAssignment() {
  const navigate = useNavigate();

  return (
    <div className="teacher-dashboard">
      <h1>📝 Subjective Assignment Panel</h1>

      <div className="button-container">

        <button
          className="dashboard-btn green"
          onClick={() => navigate("/teacher/unit3/subjective/create")}
        >
          ➕ Create Assignment
        </button>

        <button
          className="dashboard-btn blue"
          onClick={() => navigate("/teacher/unit3/subjective/manage")}
        >
          📋 Manage Assignments
        </button>

        <button
          className="dashboard-btn purple"
          onClick={() => navigate("/teacher/unit3/subjective/results")}
        >
          📊 View Results
        </button>

      </div>
    </div>
  );
}