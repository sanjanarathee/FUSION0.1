import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/student.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("fusionUser"));

  useEffect(() => {
    if (!userData) {
      navigate("/login");
    }
  }, [userData, navigate]);

  if (!userData) return null;

  return (
    <div className="student-page">

      <div className="student-header">

  {/* LEFT SIDE (PROFILE) */}
  <div className="header-left">
    <div className="header-profile">
      <div className="profile-avatar">
        {userData?.user?.name?.charAt(0).toUpperCase()}
      </div>

      <div className="profile-info">
        <h4>{userData?.user?.name}</h4>
        <p>{userData?.user?.email}</p>
        <span>
          {userData?.user?.rollNumber} | {userData?.user?.section}
        </span>
      </div>
    </div>
  </div>

  {/* CENTER TITLE */}
  <h1 className="header-title">🎓 Student Dashboard</h1>

  {/* RIGHT SIDE (LOGOUT) */}
  <div className="header-right">
    <button
      className="header-logout"
      onClick={() => {
        localStorage.clear();
        navigate("/login");
      }}
    >
      🚪 Logout
    </button>
  </div>

</div>
      {/* CONTENT */}
      <div className="student-content">

        {/* LEARN */}
        <div className="section">
          <h2>💻 Learn & Practice</h2>

          <div className="section-grid">

            <div
              className="section-card"
              onClick={() => navigate("/learn-c")}
            >
              <div className="card-left">
                <span className="card-icon">💻</span>
                <div>
                  <h3>C Language</h3>
                  <p>Start learning and practice C</p>
                </div>
              </div>
              <div className="arrow">➜</div>
            </div>

            <div
              className="section-card"
              onClick={() => navigate("/learn-cpp")}
            >
              <div className="card-left">
                <span className="card-icon">⚡</span>
                <div>
                  <h3>C++ Language</h3>
                  <p>Advanced concepts & coding</p>
                </div>
              </div>
              <div className="arrow">➜</div>
            </div>

          </div>
        </div>

        {/* PERFORMANCE */}
        <div className="section">
          <h2>🏆 Coding Performance</h2>

          <div className="section-grid">

            <div
              className="section-card"
              onClick={() => navigate("/leaderboard")}
            >
              <div className="card-left">
                <span className="card-icon">🏆</span>
                <div>
                  <h3>Leaderboard</h3>
                  <p>Track your ranking</p>
                </div>
              </div>
              <div className="arrow">➜</div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}