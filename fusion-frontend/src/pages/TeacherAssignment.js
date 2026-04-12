import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PageStyles.css";

export default function TeacherAssignment() {
  const navigate = useNavigate();

  // ✅ 10 empty question templates
  const [questions, setQuestions] = useState(
    Array.from({ length: 10 }, () => ({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    }))
  );

  const [msg, setMsg] = useState("");

  // ✅ Handle change in question text
  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  // ✅ Handle change in option text
  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  // ✅ Handle correct answer change
  const handleCorrectChange = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].correctAnswer = value;
    setQuestions(updated);
  };

  // ✅ Handle assignment submission (save to backend)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    // Check validation
    if (
      questions.some(
        (q) =>
          !q.question ||
          q.options.some((opt) => !opt) ||
          !q.correctAnswer
      )
    ) {
      setMsg("⚠️ Please fill all questions, options, and correct answers!");
      return;
    }

    try {
      const res = await axios.post("https://fusion0-1.onrender.com/api/assignments", {
        questions,
      });
      console.log("✅ Assignment Saved:", res.data);
      setMsg("✅ Assignment published successfully!");
    } catch (error) {
      console.error("🔥 Error saving assignment:", error);
      setMsg("❌ Failed to publish assignment!");
    }
  };

  return (
  <div className="upload-modern-page">

    {/* 🔶 HEADER */}
    <div className="upload-header">
      <h1>🧩 Create Assignment</h1>
      <p>Add 10 MCQs with options & correct answer</p>
    </div>

    {/* 📦 FORM */}
    <form onSubmit={handleSubmit} className="assignment-modern-form">

      {questions.map((q, qIndex) => (
        <div key={qIndex} className="assignment-card">

          <h3>Question {qIndex + 1}</h3>

          <textarea
            placeholder="Enter question..."
            value={q.question}
            onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
          />

          <div className="options-grid">
            {q.options.map((opt, optIndex) => (
              <input
                key={optIndex}
                type="text"
                placeholder={`Option ${optIndex + 1}`}
                value={opt}
                onChange={(e) =>
                  handleOptionChange(qIndex, optIndex, e.target.value)
                }
              />
            ))}
          </div>

          <input
            className="correct-input"
            placeholder="Correct answer"
            value={q.correctAnswer}
            onChange={(e) => handleCorrectChange(qIndex, e.target.value)}
          />

        </div>
      ))}

      <button type="submit" className="upload-btn">
        🚀 Publish Assignment
      </button>

      {msg && (
        <p className="success-msg">
          {msg}
        </p>
      )}

    </form>

    {/* 🔙 BACK */}
    <div className="upload-actions">
      <button
        className="back-btn"
        onClick={() => navigate("/teacher/unit3")}
      >
        ← Back to Unit 3
      </button>
    </div>

  </div>
);
}
