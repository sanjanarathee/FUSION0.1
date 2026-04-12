import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PageStyles.css";

export default function ManageSubjective() {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
  try {
    const res = await axios.get(
      "https://fusion-backend.onrender.com/api/assignments/unit/3"
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
        `https://fusion-backend.onrender.com/api/assignments/${id}`
      );
      fetchAssignments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="teacher-dashboard">
      <h1 className="dashboard-title">📋 Manage Assignments</h1>

      <div className="card-container">
        {assignments.length === 0 ? (
          <p>No assignments found</p>
        ) : (
          assignments.map((a) => (
            <div key={a._id} className="assignment-card">
              
              <h3>{a.question}</h3>

              <p>Marks: {a.maxMarks}</p>

              <p>
                Deadline:{" "}
                {a.deadline
                  ? new Date(a.deadline).toLocaleDateString()
                  : "No deadline"}
              </p>

              <div className="btn-group">
                <button
                  className="dashboard-btn red"
                  onClick={() => handleDelete(a._id)}
                >
                  Delete
                </button>

                <button className="dashboard-btn blue">
                  Edit
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}