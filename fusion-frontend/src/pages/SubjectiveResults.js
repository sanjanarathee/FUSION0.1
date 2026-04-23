import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TeacherSubjectiveResults() {
  const [results, setResults] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [unit, setUnit] = useState("");

  // 📥 get assignments (unit-wise filter optional later)
  useEffect(() => {
  if (!unit) return;


 axios.get(`https://fusion0-1.onrender.com/api/assignments/unit/${unit}`)
  .then((res) => {
    console.log("TEACHER ASSIGNMENTS:", res.data);

    // 🔥 IMPORTANT FILTER
    const subjectiveOnly = (res.data.assignments || []).filter(
      (a) => a.type === "subjective"
    );

    setAssignments(subjectiveOnly);
  })
  .catch((err) => console.error(err));
}, [unit]);

  // 📥 get results (NOW WITH UNIT 🔥)
  const fetchResults = (assignmentId) => {
    if (!assignmentId) return;

    axios.get(`https://fusion0-1.onrender.com/api/assignments/subjective/results?assignmentId=${assignmentId}&unit=${unit}`)
      .then((res) => {
        console.log("RESULTS:", res.data);

        const sorted = (res.data.results || []).sort((a, b) => b.marks - a.marks);
        setResults(sorted);
      })
      .catch((err) => console.error(err));
  };

  return (
  <div className="unit-page">

    {/* 🔶 Header */}
    <div className="unit-header">
      <h2>📊 Subjective Results</h2>
    </div>

    {/* 🔷 Section */}
    <div className="section">

      {/* 🔽 Filters */}
      <div className="results-filters">

        <select
          className="modern-input"
          onChange={(e) => setUnit(e.target.value)}
        >
          <option value="">Select Unit</option>
          <option value="1">Unit 1</option>
          <option value="2">Unit 2</option>
          <option value="3">Unit 3</option>
          <option value="4">Unit 4</option>
        </select>

        <select
          className="modern-input"
          onChange={(e) => fetchResults(e.target.value)}
        >
          <option value="">Select Assignment</option>
          {assignments.map((a) => (
            <option key={a._id} value={a._id}>
              {a.question}
            </option>
          ))}
        </select>

      </div>

      {/* 📊 Table */}
      <div className="table-container">

        <table className="styled-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Answer</th>
              <th>Marks</th>
              <th>Feedback</th>
            </tr>
          </thead>

          <tbody>
            {results.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-state">
                  No results found
                </td>
              </tr>
            ) : (
              results.map((r, i) => (
                <tr key={i}>
                  <td>{r.userId?.name}</td>
                  <td>{r.answer}</td>

                  <td className="marks-cell">
                    {r.marks} {r.marks > 8 && "🏆"}
                  </td>

                  <td>{r.feedback}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

      </div>

    </div>
  </div>
);
}

