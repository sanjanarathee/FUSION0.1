import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/teacher.css";   // ✅ FIXED

export default function ManageSubjective() {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/assignments/unit/3"
    );

    console.log("RESPONSE:", res.data);

    const filtered = res.data.assignments.filter(
      (a) => a.type === "subjective"
    );

    setAssignments(filtered);

  } catch (err) {
    console.error(err);
  }
};
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/assignments/${id}`
      );
      fetchAssignments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
  <div className="unit-page">

    {/* 🔶 Header */}
    <div className="unit-header">
      <h2>📋 Manage Assignments</h2>
    </div>

    {/* 🔷 Section */}
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

              {/* 🔥 Buttons */}
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