import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./PageStyles.css";

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
    <div className="learn-container">
      <h1 className="learn-title">
        📊 Unit {unit} - Coding Questions
      </h1>

      {questions.length === 0 ? (
        <p>No coding questions found.</p>
      ) : (
        <div className="question-list">
          {questions.map((q) => (
            <div
              key={q._id}
              className="question-card"
              onClick={() =>
                navigate(`/teacher/unit/${unit}/coding/results/${q._id}`)
              }
            >
              <h3>{q.title}</h3>
              <p>{q.description?.substring(0, 100)}...</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}