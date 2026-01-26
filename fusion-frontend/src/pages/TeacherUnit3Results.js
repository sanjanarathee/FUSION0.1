import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function TeacherUnit3Results() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    axios.get("https://fusion0-1.onrender.com/api/assignments/performance")
      .then((res) => {
        const filtered = res.data.performances.filter(
          (x) => Number(x.unit) === 3
        );
        setResults(filtered);
      });
  }, []);

  /* --------------------------------------------------
      EXPORT TO EXCEL
  -------------------------------------------------- */
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(results);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");

    XLSX.writeFile(workbook, "Unit_3_Assignment_Results.xlsx");
  };

  /* --------------------------------------------------
      EXPORT TO PDF
  -------------------------------------------------- */
  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Unit 3 – Assignment Results", 14, 20);

    const tableColumn = ["Name", "Roll Number", "Correct", "Wrong", "Accuracy"];
    const tableRows = [];

    results.forEach((r) => {
      tableRows.push([
        r.studentName,
        r.rollNumber,
        r.correct,
        r.wrong,
        `${r.accuracy}%`,
      ]);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 30 });
    doc.save("Unit_3_Assignment_Results.pdf");
  };

  return (
    <div className="learn-container">

      <div className="glass-card" style={{ padding: "25px", width: "80%", margin: "auto" }}>
        <h1 className="dashboard-title" style={{ textAlign: "center" }}>
          📊 Unit 3 – Assignment Results
        </h1>

        {/* Buttons */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <button className="view-btn" onClick={exportToExcel} style={{ marginRight: "15px" }}>
            📘 Export Excel
          </button>

          <button className="view-btn" onClick={exportToPDF}>
            📄 Export PDF
          </button>
        </div>

        {/* Results Table */}
        <table className="styled-table" style={{ margin: "auto" }}>
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
            {results.map((item, i) => (
              <tr key={i}>
                <td>{item.studentName}</td>
                <td>{item.rollNumber}</td>
                <td>{item.correct}</td>
                <td>{item.wrong}</td>
                <td>{item.accuracy}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
