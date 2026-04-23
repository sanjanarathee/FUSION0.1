import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/teacher.css";   // ✅ FIXED

// ✅ SAFE USER FETCH
const rawUser = JSON.parse(localStorage.getItem("fusionUser")) || {};
const user = rawUser?.user || rawUser;   // handle both structures
const sections = user?.sections || [];

export default function CreateAssignment() {
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const defaultUnit = query.get("unit") || 1;

  const [unit, setUnit] = useState(Number(defaultUnit));
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [section, setSection] = useState("");

  // ✅ SAFE QUESTIONS INIT
  const [questions, setQuestions] = useState(() =>
    Array.from({ length: 10 }, () => ({
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    }))
  );

  const [msg, setMsg] = useState("");

  // ================= HANDLERS =================

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].questionText = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const handleCorrectAnswerChange = (index, value) => {
    const updated = [...questions];
    updated[index].correctAnswer = value;
    setQuestions(updated);
  };

  // ================= VALIDATION =================

  const validateForm = () => {
    if (!title.trim()) return "❌ Assignment title cannot be empty!";
    if (!description.trim()) return "❌ Assignment description cannot be empty!";
    if (!deadline) return "❌ Deadline is required!";

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];

      if (!q?.questionText?.trim()) {
        return `❌ Question ${i + 1} is empty!`;
      }

      for (let j = 0; j < (q?.options || []).length; j++) {
        if (!q.options[j]?.trim()) {
          return `❌ Option ${j + 1} of Question ${i + 1} is empty!`;
        }
      }

      if (!q?.correctAnswer?.trim()) {
        return `❌ Correct answer missing in Question ${i + 1}!`;
      }

      const normalizedOptions = (q.options || []).map(o =>
        o.trim().toLowerCase()
      );
      const normalizedAnswer = q.correctAnswer.trim().toLowerCase();

      if (!normalizedOptions.includes(normalizedAnswer)) {
        return `❌ Correct answer in Question ${i + 1} must match options!`;
      }
    }

    return null;
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    const error = validateForm();
    if (error) {
      setMsg(error);
      return;
    }

    try {
      await axios.post("https://fusion0-1.onrender.com/api/assignments/create", {
        unit: Number(unit),
        type: "quiz",
        title,
        description,
        deadline,
        questions,
        teacherId: user?._id || user?.id,
        section,
      });

      setMsg("✅ Assignment published successfully!");

      setTimeout(() => {
        navigate(`/teacher/unit/${unit}/assignments`);
      }, 1500);

    } catch (error) {
      console.error("Error:", error);
      setMsg("❌ Failed to publish assignment");
    }
  };

  // ================= UI =================

  if (!questions || questions.length === 0) {
    return <p>Loading...</p>;
  }

  
    return (
  <div className="unit-page">

    {/* HEADER */}
    <div className="unit-header">
      <h2>🧩 Create MCQ Assignment</h2>
    </div>

    <div className="section">
      <div className="form-wrapper">

        <form className="modern-form" onSubmit={handleSubmit}>

          {/* UNIT + SECTION */}
          <div style={{ display: "flex", gap: "10px" }}>
            <select
              className="modern-input"
              value={unit}
              onChange={(e) => setUnit(Number(e.target.value))}
            >
              <option value={1}>Unit 1</option>
              <option value={2}>Unit 2</option>
              <option value={3}>Unit 3</option>
              <option value={4}>Unit 4</option>
            </select>

            <select
              className="modern-input"
              value={section}
              onChange={(e) => setSection(e.target.value)}
            >
              <option value="">Select Section</option>
              {sections.map((sec) => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          {/* TITLE */}
          <input
            className="modern-input"
            type="text"
            placeholder="Assignment Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* DEADLINE */}
          <input
            className="modern-input"
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          {/* DESCRIPTION */}
          <textarea
            className="modern-input"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* QUESTIONS */}
          {questions.map((q, i) => (
            <div key={i} className="question-block">
              <h3>Q{i + 1}</h3>

              <textarea
                className="modern-input"
                placeholder="Enter Question"
                value={q.questionText}
                onChange={(e) => handleQuestionChange(i, e.target.value)}
              />

             <div className="options-grid">
  {q.options.map((opt, j) => (
    <input
      key={j}
      className="modern-input"
      placeholder={`Option ${j + 1}`}
      value={opt}
      onChange={(e) => handleOptionChange(i, j, e.target.value)}
    />
  ))}
</div>

              <input
                className="modern-input"
                placeholder="Correct Answer"
                value={q.correctAnswer}
                onChange={(e) => handleCorrectAnswerChange(i, e.target.value)}
              />
            </div>
          ))}

          <button className="submit-btn">🚀 Publish Assignment</button>

        </form>

        <p className="form-msg">{msg}</p>

      </div>
    </div>
  </div>
);
}