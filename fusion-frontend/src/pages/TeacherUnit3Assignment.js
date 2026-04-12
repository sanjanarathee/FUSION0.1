import React from "react";
import { useNavigate } from "react-router-dom";
import "./PageStyles.css";

export default function TeacherUnit3Assignment() {
  const navigate = useNavigate();

 return (
  <div className="unit-page">

    

    {/* HEADER */}
    <div className="unit-header">
  <h1>Assignments</h1>
</div>


  <div className="fusion-overlay">FUSION</div>

    {/* ASSIGNMENT SECTION */}
    <div className="section">
      {/* <h2>Assignments</h2> */}

      <div className="card-grid">

        {/* CREATE */}
        <div
          className="unit-card"
          onClick={() => navigate("/teacher/unit3/create-assignment")}
        >
          <div className="card-left">
            <div className="icon">📝</div>
            <div>
              <h3>MCQ Assignment</h3>
              <p>Create objective assignments</p>
            </div>
          </div>
          <div className="arrow">→</div>
        </div>

        {/* MANAGE */}
        <div
          className="unit-card"
          onClick={() => navigate("/teacher/unit3/manage-assignments?unit=3")}
        >
          <div className="card-left">
            <div className="icon">📁</div>
            <div>
              <h3>Manage Assignments</h3>
              <p>Edit / delete assignments</p>
            </div>
          </div>
          <div className="arrow">→</div>
        </div>

        {/* RESULTS */}
        <div
          className="unit-card"
          onClick={() => navigate("/teacher/unit3/results")}
        >
          <div className="card-left">
            <div className="icon">📊</div>
            <div>
              <h3>Results</h3>
              <p>View student performance</p>
            </div>
          </div>
          <div className="arrow">→</div>
        </div>

      </div>
    </div>

  </div>
);
}
