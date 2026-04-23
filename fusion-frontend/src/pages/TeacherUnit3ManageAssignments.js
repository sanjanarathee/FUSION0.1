import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/teacher.css";   // ✅ FIXED

export default function TeacherUnit3ManageAssignments() {
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();
  const unit = 3;   // ✅ ADD THIS LINE

 useEffect(() => {
   const fetchAssignments = async () => {
     try {
       const res = await axios.get(
         `http://localhost:5000/api/assignments/unit/${unit}`
       );
 
       console.log("🔥 API RESPONSE:", res.data);
 
 setAssignments(res.data.assignments || []);
     } catch (error) {
       console.error("❌ Error fetching assignments", error);
     }
   };
 
   fetchAssignments();
 }, [unit]);

  const deleteAssignment = async (id) => {
    try {
      await await axios.delete(`http://localhost:5000/api/assignments/${id}`);;
      alert("Assignment Deleted");

      // Refresh list after delete
      setAssignments(assignments.filter((a) => a._id !== id));
    } catch (err) {
      console.log("Delete Error:", err);
    }
  };

  return (
  <div className="unit-page">
    <div className="unit-header">
      📁 Manage Assignments – Unit {unit}
    </div>

    {assignments.length === 0 ? (
      <div className="empty-state">
        No assignments found for Unit {unit}.
      </div>
    ) : (
      <div className="assignments-grid">
        {assignments.map((a) => (
          <div key={a._id} className="section-card">
            
            {/* LEFT SIDE */}
            <div className="card-left">
              <div className="card-icon">📄</div>

              <div>
                <h3>{a.title}</h3>
                <p>{a.description}</p>
                <p>
                  <strong>Deadline:</strong>{" "}
                  {a.deadline
                    ? new Date(a.deadline).toLocaleDateString()
                    : "No deadline"}
                </p>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="manage-actions">
              <button
                className="view-btn"
                onClick={() =>
                  navigate(`/teacher/assignment-results/${a._id}`)
                }
              >
                📊 Results
              </button>

              <button
                className="delete-btn"
                onClick={() => deleteAssignment(a._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
}
