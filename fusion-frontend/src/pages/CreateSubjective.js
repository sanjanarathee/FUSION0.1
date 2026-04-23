import React, { useState } from "react";
import axios from "axios";
import "../styles/teacher.css";   // ✅ FIXED

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
        "https://fusion0-1.onrender.com/api/assignments/subjective",
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
  <div className="unit-page">

    {/* 🔶 Header */}
    <div className="unit-header">
      <h2>📝 Create Subjective Assignment</h2>
    </div>

    {/* 🔷 Form Section */}
    <div className="section">
      
      <div className="form-wrapper">

        <form className="modern-form" onSubmit={handleSubmit}>
          
          <input
            className="modern-input"
            type="text"
            placeholder="Enter Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />

          <input
            className="modern-input"
            type="text"
            placeholder="Keywords (comma separated)"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            required
          />

          <input
            className="modern-input"
            type="number"
            placeholder="Max Marks"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            required
          />

          <input
            className="modern-input"
            type="number"
            placeholder="Unit Number"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            required
          />

          <input
            className="modern-input"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />

          <button className="submit-btn" type="submit">
            Create Assignment
          </button>

          {msg && <p className="form-msg">{msg}</p>}

        </form>

        

      </div>

    </div>
  </div>
);

}