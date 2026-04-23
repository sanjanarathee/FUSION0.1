import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../styles/teacher.css";   // ✅ FIXED

export default function TeacherCodingQuestionResults() {
  const { questionId, unit } = useParams();   // ✅ dynamic unit + question
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    axios
      .get(`https://fusion0-1.onrender.com/api/coding/results/${questionId}`)
      .then((res) => {
        console.log("Coding Results:", res.data);
        setSubmissions(res.data.submissions || []);
      })
      .catch((err) => {
        console.error("Error fetching coding results:", err);
      });
  }, [questionId]);

  return (
  <div className="unit-page">

    {/* HEADER */}
    <div className="unit-header">
      <h1>💻 Unit {unit} - Coding Results</h1>
    </div>

    <div className="section">

      {submissions.length === 0 ? (
        <div className="empty-state">
          ❌ No student has submitted this question yet
        </div>
      ) : (
        <div className="table-container">

          <table className="styled-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll</th>
                <th>Score</th>
                <th>Code</th>
              </tr>
            </thead>

            <tbody>
              {submissions.map((sub, index) => (
                <tr key={index}>
<td>{sub.userId?.name}</td>
<td>{sub.userId?.rollNumber}</td>

<td>{sub.totalMarks}</td>

<td>
<details>
<summary>👀 View</summary>
<pre className="code-box">
{sub.code}
</pre>
</details>
</td>

</tr>
              ))}
            </tbody>
          </table>

        </div>
      )}

    </div>
  </div>
);
}