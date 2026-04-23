import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/teacher.css";   // ✅ FIXED

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const teacherData = JSON.parse(localStorage.getItem("fusionUser"));

  // ✅ Route protection
  useEffect(() => {
    if (!teacherData) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    if (!teacherData.user || teacherData.user.role !== "teacher") {
      alert("Access denied! Only teachers can access this dashboard.");
      navigate("/login");
    }
  }, [teacherData, navigate]);

 return (
  <div className="unit-page">

    {/* HEADER */}
    <div className="unit-header">
      <h1>🎓 Teacher Dashboard</h1>
    </div>

    {/* BG TEXT */}
    <div className="fusion-bg-text">FUSION</div>

    {/* CONTENT */}
    <div className="unit-content">

      <div className="section">
        <h2>📚 Manage Courses</h2>

        <div className="section-grid">

          <div
            className="section-card"
            onClick={() => navigate("/teacher/manage-c")}
          >
            <div className="card-left">
              <span className="card-icon">💻</span>
              <div>
                <h3>C Language</h3>
                <p>Manage units, assignments & results</p>
              </div>
            </div>
            <div className="arrow">➜</div>
          </div>

          <div
            className="section-card"
            onClick={() => navigate("/teacher/manage-cpp")}
          >
            <div className="card-left">
              <span className="card-icon">⚡</span>
              <div>
                <h3>C++ Language</h3>
                <p>Advanced programming & evaluation</p>
              </div>
            </div>
            <div className="arrow">➜</div>
          </div>

        </div>
      </div>

    </div>

    {/* LOGOUT */}
    <button
      className="back-btn"
      onClick={() => {
        localStorage.clear();
        navigate("/login");
      }}
    >
      🚪 Logout
    </button>

  </div>
);
}