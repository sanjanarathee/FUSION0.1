import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TeacherSubjectiveResults() {
  const [results, setResults] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [unit, setUnit] = useState("");

  // 📥 get assignments (unit-wise filter optional later)
  useEffect(() => {
    axios.get("/api/assignments/subjective")
      .then(res => {
        setAssignments(res.data.assignments || []);
      })
      .catch(err => console.error(err));
  }, []);

  // 📥 get results (NOW WITH UNIT 🔥)
  const fetchResults = (assignmentId) => {
    if (!assignmentId) return;

    axios
      .get(`/api/assignments/subjective/results?assignmentId=${assignmentId}&unit=${unit}`)
      .then((res) => {
        console.log("RESULTS:", res.data);

        const sorted = (res.data.results || []).sort((a, b) => b.marks - a.marks);
        setResults(sorted);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2>📊 Subjective Results</h2>

      {/* 🔽 UNIT DROPDOWN */}
      <select onChange={(e) => setUnit(e.target.value)} style={{ marginRight: "10px" }}>
        <option value="">Select Unit</option>
        <option value="1">Unit 1</option>
        <option value="2">Unit 2</option>
        <option value="3">Unit 3</option>
        <option value="4">Unit 4</option>
      </select>

      {/* 🔽 ASSIGNMENT DROPDOWN */}
      <select onChange={(e) => fetchResults(e.target.value)}>
        <option value="">Select Assignment</option>
        {assignments.map((a) => (
          <option key={a._id} value={a._id}>
            {a.question}
          </option>
        ))}
      </select>

      {/* 📊 TABLE */}
      <table style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#1e2a47" }}>
            <th style={th}>Student</th>
            <th style={th}>Answer</th>
            <th style={th}>Marks</th>
            <th style={th}>Feedback</th>
          </tr>
        </thead>

        <tbody>
          {results.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                No results found
              </td>
            </tr>
          ) : (
            results.map((r, i) => (
              <tr key={i} style={{ background: "#2c3e66" }}>
                <td style={td}>{r.userId?.name}</td>
                <td style={td}>{r.answer}</td>

                <td style={{ ...td, color: "lightgreen", fontWeight: "bold" }}>
                  {r.marks} {r.marks > 8 && "🏆"}
                </td>

                <td style={td}>{r.feedback}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const th = {
  padding: "10px",
  border: "1px solid #444",
};

const td = {
  padding: "10px",
  border: "1px solid #444",
};