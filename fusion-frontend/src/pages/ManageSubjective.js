import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../styles/teacher.css";
import { useLocation } from "react-router-dom";

export default function ManageSubjective() {
  const [assignments, setAssignments] = useState([]);
  const location = useLocation();

  // 🔥 Detect unit from URL
 const getUnitFromPath = useCallback(() => {
  const match = location.pathname.match(/unit(\d+)/);
  return match ? Number(match[1]) : 1;
}, [location.pathname]);

  // 🔥 Fetch assignments
  const fetchAssignments = useCallback(async () => {
    try {
      const unit = getUnitFromPath();

      const res = await axios.get(
        `https://fusion0-1.onrender.com/api/assignments/unit/${unit}`
      );

      const filtered = res.data.assignments.filter(
        (a) => a.type === "subjective"
      );

      setAssignments(filtered);

    } catch (err) {
      console.error(err);
    }
  }, [getUnitFromPath]);

  // 🔥 Load data on unit change
  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  // 🔥 Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://fusion0-1.onrender.com/api/assignments/${id}`
      );
      fetchAssignments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="unit-page">

      {/* HEADER */}
      <div className="unit-header">
        <h2>📋 Manage Assignments</h2>
      </div>

      <div className="section">

        {assignments.length === 0 ? (
          <p className="empty-state">No assignments found</p>
        ) : (
          <div className="section-grid">

            {assignments.map((a) => (
              <div key={a._id} className="section-card">

                <div className="card-left">
                  <span className="card-icon">📝</span>
                  <div>
                    <h3>{a.question}</h3>
                    <p>Marks: {a.maxMarks}</p>
                    <p>
                      Deadline:{" "}
                      {a.deadline
                        ? new Date(a.deadline).toLocaleDateString()
                        : "No deadline"}
                    </p>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="manage-actions">
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(a._id)}
                  >
                    Delete
                  </button>

                  <button className="edit-btn">
                    Edit
                  </button>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}