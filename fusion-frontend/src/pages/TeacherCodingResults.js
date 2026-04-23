import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/teacher.css";   // ✅ FIXED

export default function TeacherCodingResults() {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  const { unit } = useParams();   // ✅ dynamic unit

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/coding/practice", {
        params: { language: "c" },
      })
      .then((res) => {
        console.log("Questions:", res.data.questions);
        setQuestions(res.data.questions || []);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
  <div className="unit-page">

    {/* HEADER */}
    <div className="unit-header">
      <h1>📊 Unit {unit} - Coding Questions</h1>
    </div>

    <div className="section">

      {questions.length === 0 ? (
        <div className="empty-state">
          <p>❌ No coding questions found</p>
        </div>
      ) : (
        <div className="section-grid">

          {questions.map((q) => (
            <div
              key={q._id}
              className="section-card"
              onClick={() =>
                navigate(`/teacher/unit/${unit}/coding/results/${q._id}`)
              }
            >
              <div className="card-left">
                <div className="card-icon">💻</div>
                <div>
                  <h3>{q.title}</h3>
                  <p>{q.description?.substring(0, 80)}...</p>
                </div>
              </div>

              <div className="arrow">➜</div>
            </div>
          ))}

        </div>
      )}

    </div>
  </div>
);
}