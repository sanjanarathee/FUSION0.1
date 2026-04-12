import React, { useState } from "react";
import axios from "axios";
import "./PageStyles.css";

export default function CreateSubjective() {
  const [question, setQuestion] = useState("");
  const [keywords, setKeywords] = useState("");
  const [marks, setMarks] = useState("");
  const [deadline, setDeadline] = useState("");
  const [unit, setUnit] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ GET USER FROM LOCAL STORAGE
      const user = JSON.parse(localStorage.getItem("fusionUser"));

      if (!user) {
        setMsg("❌ Please login again");
        return;
      }

      await axios.post(
        "https://fusion-backend.onrender.com/api/assignments/subjective",
        {
          question,
          keywords: keywords.split(",").map((k) => k.trim()),
          maxMarks: Number(marks),
          unit: Number(unit),
          deadline,
          section: user.user.section 
        },

        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setMsg("✅ Assignment Created");

      // 🔄 reset fields
      setQuestion("");
      setKeywords("");
      setMarks("");
      setDeadline("");
      setUnit("");

    } catch (err) {
      console.error(err);
      setMsg("❌ Error creating assignment");
    }
  };

  return (
    <div className="teacher-dashboard">
      <h1 className="dashboard-title">📝 Create Subjective Assignment</h1>

      <form className="form-container" onSubmit={handleSubmit}>
        
        <input
          className="form-input"
          type="text"
          placeholder="Enter Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />

        <input
          className="form-input"
          type="text"
          placeholder="Keywords (comma separated)"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          required
        />

        <input
          className="form-input"
          type="number"
          placeholder="Max Marks"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
          required
        />

        {/* 🔥 NEW: UNIT INPUT */}
        <input
          className="form-input"
          type="number"
          placeholder="Unit Number"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          required
        />

        <input
          className="form-input"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />

        <button className="dashboard-btn green" type="submit">
          Create Assignment
        </button>
      </form>

      <p style={{ marginTop: "20px" }}>{msg}</p>
    </div>
  );
}