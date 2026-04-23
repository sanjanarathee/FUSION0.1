import React from "react";
import "../styles/student.css";import { useNavigate } from "react-router-dom";

export default function LearnC() {
  const navigate = useNavigate();

  return (
    <div className="student-page">

      {/* Header */}
      <div className="student-header">
        <h1 style={{ margin: "0 auto" }}>
          💻 C Language Learning Hub
        </h1>
      </div>

      {/* FUSION goes HERE */}
   <div className="student-fusion-bg">
      FUSION
   </div>

      {/* Content */}
      <div className="student-content">

       

        <div className="student-learn-section">
          <h2>📘 Learning Units</h2>

          <div className="student-learn-grid">

            <div
              className="student-learn-card"
              onClick={() => navigate("/learn-c/unit1")}
            >
              <div className="student-learn-left">
                <div className="student-learn-icon">1️⃣</div>

                <div>
                  <h3>Unit 1</h3>
                  <p>Introduction to C Programming</p>
                </div>
              </div>

              <div className="student-learn-arrow">➡</div>
            </div>


            <div
              className="student-learn-card"
              onClick={() => navigate("/learn-c/unit2")}
            >
              <div className="student-learn-left">
                <div className="student-learn-icon">2️⃣</div>

                <div>
                  <h3>Unit 2</h3>
                  <p>Control Statements and Loops</p>
                </div>
              </div>

              <div className="student-learn-arrow">➡</div>
            </div>


            <div
              className="student-learn-card"
              onClick={() => navigate("/learn-c/unit3")}
            >
              <div className="student-learn-left">
                <div className="student-learn-icon">3️⃣</div>

                <div>
                  <h3>Unit 3</h3>
                  <p>Functions and Arrays</p>
                </div>
              </div>

              <div className="student-learn-arrow">➡</div>
            </div>


            <div
              className="student-learn-card"
              onClick={() => navigate("/learn-c/unit4")}
            >
              <div className="student-learn-left">
                <div className="student-learn-icon">4️⃣</div>

                <div>
                  <h3>Unit 4</h3>
                  <p>Pointers and File Handling</p>
                </div>
              </div>

              <div className="student-learn-arrow">➡</div>
            </div>

          </div>
        </div>

        <button
          className="student-back-btn"
          onClick={() => navigate("/dashboard")}
        >
          ⬅ Back to Dashboard
        </button>

      </div>

    </div>
  );
}