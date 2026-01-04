import React from "react";
import { useNavigate } from "react-router-dom";
import "./PageStyles.css";

export default function TeacherUnit3Assignment() {
  const navigate = useNavigate();

  return (
    <div className="teacher-dashboard">
      <h1 className="dashboard-title">🧠 Unit 3 – Assignments</h1>
      <p className="dashboard-subtext">
        Create, manage, and review student performance for Unit 3 assignments.
      </p>

      <div className="button-container">
        <button
          className="dashboard-btn purple"
          onClick={() => navigate("/teacher/create-assignment?unit=3")}
        >
          ✳ Create Assignment
        </button>

        <button
  className="dashboard-btn blue"
  onClick={() => navigate("/teacher/unit3/manage-assignments?unit=3")}
>
  📁 Manage Assignments
</button>


        <button
          className="dashboard-btn green"
          onClick={() => navigate("/teacher/unit3/results")}
        >
          📊 View Assignment Results
        </button>
      </div>

      <button
        className="back-btn"
        style={{ marginTop: "40px" }}
        onClick={() => navigate("/teacher/unit3")}
      >
        ⬅ Back to Unit 3
      </button>
    </div>
  );
}
