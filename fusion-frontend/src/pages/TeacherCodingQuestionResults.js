import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./PageStyles.css";

export default function TeacherCodingQuestionResults() {
  const { questionId, unit } = useParams();   // ✅ dynamic unit + question
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    axios
      .get(`https://fusion-backend.onrender.com/api/coding/results/${questionId}`)
      .then((res) => {
        console.log("Coding Results:", res.data);
        setSubmissions(res.data.submissions || []);
      })
      .catch((err) => {
        console.error("Error fetching coding results:", err);
      });
  }, [questionId]);

  return (
    <div className="learn-container">
      <div
        className="glass-card"
        style={{ padding: "25px", width: "85%", margin: "auto" }}
      >
        {/* Title */}
        <h1 className="dashboard-title" style={{ textAlign: "center" }}>
          💻 Unit {unit} - Coding Results
        </h1>

        {/* If no submissions */}
        {submissions.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            ❌ No student has submitted this question yet
          </p>
        ) : (
          <table className="styled-table" style={{ marginTop: "20px" }}>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Roll Number</th>
                <th>Passed</th>
                <th>Total</th>
                <th>Score</th>
                <th>View Code</th>
              </tr>
            </thead>

            <tbody>
              {submissions.map((sub, index) => (
                <tr key={index}>
                  <td>{sub.userId?.name}</td>
                  <td>{sub.userId?.rollNumber}</td>
                  <td>{sub.testcasesPassed}</td>
                  <td>{sub.totalTestcases}</td>
                  <td>{sub.totalMarks}</td>

                  <td>
                    <details>
                      <summary style={{ cursor: "pointer" }}>
                        👀 View
                      </summary>
                      <pre
                        style={{
                          maxHeight: "200px",
                          overflow: "auto",
                          background: "#111",
                          color: "#0f0",
                          padding: "10px",
                          borderRadius: "8px",
                        }}
                      >
                        {sub.code}
                      </pre>
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}