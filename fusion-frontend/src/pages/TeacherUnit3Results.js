import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function TeacherUnit3Results() {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [results, setResults] = useState([]);

  /* --------------------------------------------------
      FETCH ASSIGNMENTS (UNIT 3)
  -------------------------------------------------- */
  useEffect(() => {
    axios
      .get("https://fusion0-1.onrender.com/api/assignments/unit/3")
      .then((res) => {
setAssignments(res.data.assignments || []);      })
      .catch((err) => console.error(err));
  }, []);

  /* --------------------------------------------------
      FETCH RESULTS (WHEN ASSIGNMENT SELECTED)
  -------------------------------------------------- */
  useEffect(() => {
    if (!selectedAssignment) return;

    const user = JSON.parse(localStorage.getItem("fusionUser"));

    axios
      .get("https://fusion0-1.onrender.com/api/assignments/performance", {
        params: {
          unit: 3,
          assignmentId: selectedAssignment._id, // 🔥 IMPORTANT
          teacherId: user?.id,
          section: user?.sections?.[0],
        },
      })
      .then((res) => {
        const data = res.data.performances ?? res.data ?? [];
        setResults(data);
      })
      .catch((err) => console.error(err));
  }, [selectedAssignment]);

  /* --------------------------------------------------
      EXPORT TO EXCEL
  -------------------------------------------------- */
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(results);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
    XLSX.writeFile(workbook, `${selectedAssignment.title}_results.xlsx`);
  };

  /* --------------------------------------------------
      EXPORT TO PDF
  -------------------------------------------------- */
  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.text(`Results - ${selectedAssignment.title}`, 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [["Name", "Roll Number", "Correct", "Wrong", "Accuracy"]],
      body: results.map((r) => [
        r.studentName,
        r.rollNumber,
        r.correct,
        r.wrong,
        `${r.accuracy}%`,
      ]),
    });

    doc.save(`${selectedAssignment.title}_results.pdf`);
  };

  /* --------------------------------------------------
      UI
  -------------------------------------------------- */
  return (
  <div className="unit-page">
    <div className="unit-header">
      Assignment Results
    </div>

    {/* 🔹 STEP 1: SHOW ASSIGNMENTS */}
    {!selectedAssignment ? (
      <div className="assignments-grid">
        {assignments.map((a) => (
          <div
            key={a._id}
            className="section-card"
            onClick={() => setSelectedAssignment(a)}
          >
            <div className="card-left">
              <div className="card-icon">📄</div>

              <div>
                <h3>{a.title}</h3>
                <p>{a.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      /* 🔹 STEP 2: SHOW RESULTS */
      <div
        className="glass-card"
        style={{ padding: "25px", marginTop: "20px" }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          📊 Results – {selectedAssignment.title}
        </h2>

        {/* EXPORT BUTTONS */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <button
            className="view-btn"
            onClick={exportToExcel}
            style={{ marginRight: "10px" }}
          >
            📘 Export Excel
          </button>

          <button className="view-btn" onClick={exportToPDF}>
            📄 Export PDF
          </button>
        </div>

        {/* TABLE */}
        <table className="styled-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll Number</th>
              <th>Correct</th>
              <th>Wrong</th>
              <th>Accuracy</th>
            </tr>
          </thead>

          <tbody>
            {results.map((r, i) => (
              <tr key={i}>
                <td>{r.studentName}</td>
                <td>{r.rollNumber}</td>
                <td>{r.correct}</td>
                <td>{r.wrong}</td>
                <td>{r.accuracy}%</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 🔻 BACK BUTTON AT BOTTOM */}
        <div
          style={{
            textAlign: "center",
            marginTop: "25px",
          }}
        >
          <button
            className="view-btn"
            onClick={() => setSelectedAssignment(null)}
          >
            ⬅ Back
          </button>
        </div>
      </div>
    )}
  </div>
);
}