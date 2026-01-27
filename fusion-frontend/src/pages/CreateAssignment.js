import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./PageStyles.css";

export default function CreateAssignment() {
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const defaultUnit = query.get("unit") || 1;

  const [unit, setUnit] = useState(Number(defaultUnit));
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");

  const [questions, setQuestions] = useState(
    Array.from({ length: 10 }, () => ({
      questionText: "",
      options: ["", "", "", ""], 
      correctAnswer: "",
    }))
  );

  const [msg, setMsg] = useState("");

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

  // ⭐ Updated validation with space-trim + lowercase matching
  const validateForm = () => {
    if (!title.trim()) return "❌ Assignment title cannot be empty!";
    if (!description.trim()) return "❌ Assignment description cannot be empty!";
    if (!deadline) return "❌ Deadline is required!";

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];

      if (!q.questionText.trim()) {
        return `❌ Question ${i + 1} is empty!`;
      }

      // Validate options
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          return `❌ Option ${j + 1} of Question ${i + 1} is empty!`;
        }
      }

      if (!q.correctAnswer.trim()) {
        return `❌ Correct answer missing in Question ${i + 1}!`;
      }

      // ⭐ Normalize spaces + lowercase for perfect matching
      const normalizedOptions = q.options.map(o => o.trim().toLowerCase());
      const normalizedAnswer = q.correctAnswer.trim().toLowerCase();

      if (!normalizedOptions.includes(normalizedAnswer)) {
        return `❌ Correct answer in Question ${i + 1} must exactly match one of the options (case-insensitive)!`;
      }
    }

    return null;
  };

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
        title,
        description,
        deadline,
        questions,
      });

      setMsg("✅ Assignment published successfully!");

      setTimeout(() => navigate("/teacher/manage-c"), 1500);

    } catch (error) {
      console.error("Error:", error);
      setMsg("❌ Failed to publish assignment. Try again!");
    }
  };

  return (
    <div className="learn-container">
      <h1 className="learn-title">🧩 Create C Programming Assignment</h1>
      <p style={{ color: "white" }}>
        Add 10 questions — each with 4 options and 1 correct answer.
      </p>

      {/* UNIT */}
      <div style={{ marginTop: 20, marginBottom: 30 }}>
        <label style={{ color: "white", fontWeight: "bold" }}>📘 Unit:</label>
        <select
          value={unit}
          onChange={(e) => setUnit(Number(e.target.value))}
          className="dropdown"
          style={{ marginLeft: 10 }}
        >
          <option value={1}>Unit 1</option>
          <option value={2}>Unit 2</option>
          <option value={3}>Unit 3</option>
          <option value={4}>Unit 4</option>
        </select>
      </div>

      {/* TITLE */}
      <div style={{ marginBottom: 25 }}>
        <label style={{ color: "white", fontWeight: "bold" }}>
          📝 Assignment Title:
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter assignment title..."
          style={{ width: "100%", marginTop: 10, padding: 10, borderRadius: 8 }}
        />
      </div>

      {/* DEADLINE */}
      <div style={{ marginBottom: 25 }}>
        <label style={{ color: "white", fontWeight: "bold" }}>
          ⏳ Deadline:
        </label>
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          style={{ marginLeft: 10, padding: 10, borderRadius: 8 }}
        />
      </div>

      {/* DESCRIPTION */}
      <div style={{ marginBottom: 25 }}>
        <label style={{ color: "white", fontWeight: "bold" }}>
          📝 Description:
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description..."
          style={{ width: "100%", marginTop: 10, padding: 10, minHeight: 70 }}
        />
      </div>

      <form onSubmit={handleSubmit}>
        {questions.map((q, i) => (
          <div key={i} className="assignment-question">
            <h3>Question {i + 1}</h3>

            <textarea
              placeholder="Enter question..."
              value={q.questionText}
              onChange={(e) => handleQuestionChange(i, e.target.value)}
            />

            {q.options.map((opt, j) => (
              <input
                key={j}
                type="text"
                placeholder={`Option ${j + 1}`}
                value={opt}
                onChange={(e) => handleOptionChange(i, j, e.target.value)}
              />
            ))}

            <input
              type="text"
              placeholder="Correct answer (must match one option)"
              value={q.correctAnswer}
              onChange={(e) => handleCorrectAnswerChange(i, e.target.value)}
            />
          </div>
        ))}

        <button type="submit" className="upload-btn">
          🚀 Publish Assignment
        </button>
      </form>

      {msg && (
        <p
          style={{
            color: msg.includes("✅") ? "limegreen" : "red",
            fontWeight: 600,
            marginTop: 15,
          }}
        >
          {msg}
        </p>
      )}

      <button
        className="back-btn"
        onClick={() => navigate("/teacher/manage-c")}
      >
        ⬅ Back to Units
      </button>
    </div>
  );
}
