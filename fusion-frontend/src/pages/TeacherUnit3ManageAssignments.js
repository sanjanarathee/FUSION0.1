import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PageStyles.css";

export default function TeacherUnit3ManageAssignments() {
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/assignments/unit/3")
      .then((res) => {
        console.log("Unit 3 assignments → ", res.data.assignments);
        setAssignments(res.data.assignments || []);
      })
      .catch((err) => console.log("API ERROR:", err));
  }, []);

  const deleteAssignment = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/assignments/${id}`);
      alert("Assignment Deleted");

      // Refresh list after delete
      setAssignments(assignments.filter((a) => a._id !== id));
    } catch (err) {
      console.log("Delete Error:", err);
    }
  };

  return (
    <div className="teacher-unit-container">
      <h1 className="dashboard-title">
        Manage Assignments – <span className="fusion-text">Unit 3</span>
      </h1>

      {assignments.length === 0 ? (
        <p>No assignments found for Unit 3.</p>
      ) : (
        <div className="assignment-list">
          {assignments.map((a) => (
            <div key={a._id} className="assignment-card">
              <h3>{a.title}</h3>
              <p>{a.description}</p>

              {/* 🔹 Deadline */}
              {a.deadline && (
                <p>
                  <strong>Deadline:</strong>{" "}
                  {new Date(a.deadline).toLocaleDateString()}
                </p>
              )}

              {/* 🔹 Number of Questions */}
              {a.numQuestions && (
                <p>
                  <strong>No. of Questions:</strong> {a.numQuestions}
                </p>
              )}

              <button className="delete-btn" onClick={() => deleteAssignment(a._id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        className="back-button"
        onClick={() => navigate("/teacher/unit3/assignments")}
      >
        ⬅ Back to Assignments Menu
      </button>
    </div>
  );
}
