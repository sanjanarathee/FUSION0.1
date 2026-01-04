import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PageStyles.css";

export default function AssignmentResults() {
  const [results, setResults] = useState([]);
  const [filtered, setFiltered] = useState([]);

  // Filters
  const [nameFilter, setNameFilter] = useState("");
  const [rollFilter, setRollFilter] = useState("");
  const [accuracyFilter, setAccuracyFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [unitFilter, setUnitFilter] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/assignments/performance"
        );

        console.log("API response →", res.data);

        let dataArray = [];

        if (Array.isArray(res.data.performances)) {
          dataArray = res.data.performances;
        } else if (Array.isArray(res.data)) {
          dataArray = res.data;
        } else {
          dataArray = [];
        }

        // Normalize date
        dataArray = dataArray.map((d) => ({
          ...d,
          date: d.date ? new Date(d.date).toISOString() : null,
        }));

        setResults(dataArray);
        setFiltered(dataArray);
      } catch (error) {
        console.error("❌ Error fetching results:", error);
      }
    };

    fetchResults();
  }, []);

  // APPLY FILTERS
  const applyFilters = () => {
    let data = [...results];

    if (nameFilter.trim() !== "") {
      data = data.filter((r) =>
        r.studentName?.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    if (rollFilter.trim() !== "") {
      data = data.filter((r) => r.rollNumber === rollFilter);
    }

    if (accuracyFilter !== "") {
      if (accuracyFilter === "above80") data = data.filter((r) => r.accuracy >= 80);
      if (accuracyFilter === "50to80")
        data = data.filter((r) => r.accuracy >= 50 && r.accuracy < 80);
      if (accuracyFilter === "below50") data = data.filter((r) => r.accuracy < 50);
    }

    if (dateFilter !== "") {
      const selected = new Date(dateFilter).toDateString();
      data = data.filter((r) => new Date(r.date).toDateString() === selected);
    }

    if (unitFilter !== "") {
      data = data.filter((r) => r.unit === unitFilter);
    }

    setFiltered(data);
  };

  const resetFilters = () => {
    setNameFilter("");
    setRollFilter("");
    setAccuracyFilter("");
    setDateFilter("");
    setUnitFilter("");

    setFiltered(results);
  };

  return (
    <div className="learn-container">
      <h1 className="learn-title">📊 Student Assignment Results</h1>

      {/* FILTER BAR */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by Name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="filter-input"
        />

        <input
          type="text"
          placeholder="Search by Roll No"
          value={rollFilter}
          onChange={(e) => setRollFilter(e.target.value)}
          className="filter-input"
        />

        <select
          value={accuracyFilter}
          onChange={(e) => setAccuracyFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">Filter by Accuracy</option>
          <option value="above80">Above 80%</option>
          <option value="50to80">50–80%</option>
          <option value="below50">Below 50%</option>
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="filter-input"
        />

        <select
          value={unitFilter}
          onChange={(e) => setUnitFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">Select Unit</option>
          <option value="Unit 1">Unit 1</option>
          <option value="Unit 2">Unit 2</option>
          <option value="Unit 3">Unit 3</option>
          <option value="Unit 4">Unit 4</option>
        </select>

        <button className="view-btn" onClick={applyFilters}>
          Apply Filters
        </button>

        <button className="back-btn" onClick={resetFilters}>
          Reset
        </button>
      </div>

      {/* RESULTS LIST */}
      {filtered.length === 0 ? (
        <p style={{ marginTop: "20px", fontSize: "18px" }}>No results found.</p>
      ) : (
        filtered.map((res, i) => (
          <div key={i} className="file-card">
            <h3>🧑 {res.studentName || "Unknown Student"}</h3>
            <p>🎓 Roll: {res.rollNumber}</p>
            <p>📘 Unit: {res.unit}</p>
            <p>✅ Correct: {res.correct}</p>
            <p>❌ Wrong: {res.wrong}</p>
            <p>🎯 Accuracy: {res.accuracy}%</p>
            <p>📅 Date: {new Date(res.date).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
}
