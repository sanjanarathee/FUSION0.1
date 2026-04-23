import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";   // ✅ add this
import "../styles/admin.css";

export default function AdminDashboard() {
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [approvedTeachers, setApprovedTeachers] = useState([]);

  const navigate = useNavigate();   // ✅ init

  useEffect(() => {
    fetchPending();
    fetchApproved();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await axios.get(
        "https://fusion0-1.onrender.com/api/auth/pending-teachers"
      );
      setPendingTeachers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchApproved = async () => {
    try {
      const res = await axios.get(
        "https://fusion0-1.onrender.com/api/auth/approved-teachers"
      );
      setApprovedTeachers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const approveTeacher = async (id) => {
    try {
      await axios.put(`https://fusion0-1.onrender.com/api/auth/approve/${id}`);
      fetchPending();
      fetchApproved();
    } catch (err) {
      console.log(err);
    }
  };

  const disapproveTeacher = async (id) => {
    if (!window.confirm("Are you sure you want to disapprove this teacher?")) return;

    try {
      await axios.put(`https://fusion0-1.onrender.com/api/auth/disapprove/${id}`);
      fetchApproved();
      fetchPending();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("fusionUser");
    navigate("/login");   // ✅ better redirect
  };

  return (
    <div className="admin-container">

      {/* 🔶 HEADER */}
      <div className="admin-header">
        <span>🎓 FUSION Admin Panel</span>

        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      {/* 🔹 Pending Section */}
      <div className="section">
        <h2>Pending Teachers</h2>

        {pendingTeachers.length === 0 ? (
          <div className="empty-state">No pending teachers</div>
        ) : (
          <div className="teacher-grid">
            {pendingTeachers.map((teacher) => (
              <div className="teacher-card" key={teacher._id}>
                <h3>{teacher.name}</h3>
                <p>{teacher.email}</p>

                <button
                  className="approve-btn"
                  onClick={() => approveTeacher(teacher._id)}
                >
                  ✔ Approve
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🔹 Approved Section */}
      <div className="section">
        <h2>Approved Teachers</h2>

        {approvedTeachers.length === 0 ? (
          <div className="empty-state">No approved teachers yet</div>
        ) : (
          <div className="teacher-grid">
            {approvedTeachers.map((teacher) => (
              <div className="teacher-card approved" key={teacher._id}>
                <h3>{teacher.name}</h3>
                <p>{teacher.email}</p>

                <p>
                  <strong>Branch:</strong>{" "}
                  {teacher.sections?.join(", ") || teacher.extraField}
                </p>

                <p className="approved-text">✔ Approved</p>

                <button
                  className="disapprove-btn"
                  onClick={() => disapproveTeacher(teacher._id)}
                >
                  Disapprove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}