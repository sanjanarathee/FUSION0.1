import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./PageStyles.css";

export default function StudentAssignment() {
  const location = useLocation();

  // 🔥 FIX 1: Read unit from query params
  const query = new URLSearchParams(location.search);
  const selectedUnit = query.get("unit");

  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const [studentName, setStudentName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [detailsFilled, setDetailsFilled] = useState(false);

  /* -------------------------------------------------------
        FETCH ASSIGNMENTS  (STUDENT API)
  -------------------------------------------------------- */
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        // 🔥 FIX 2: Use CORRECT STUDENT API
        const res = await axios.get(
          `http://localhost:5000/api/assignments/student?unit=${selectedUnit}`
        );

        setAssignments(res.data.assignments || []);
      } catch (err) {
        console.error("❌ Error fetching assignments:", err);
      }
    };

    if (selectedUnit) {
      fetchAssignments();
    }
  }, [selectedUnit]);

  const handleOptionSelect = (qIndex, option) => {
    setAnswers({ ...answers, [qIndex]: option });
  };

  const handleSubmit = async () => {
    let correct = 0;

    selectedAssignment.questions.forEach((q, i) => {
      const chosen = answers[i]?.toString().trim().toLowerCase();
      const actual = q.correctAnswer?.toString().trim().toLowerCase();
      if (chosen === actual) correct++;
    });

    const wrong = selectedAssignment.questions.length - correct;
    const accuracy = ((correct / selectedAssignment.questions.length) * 100).toFixed(2);

    setResult({ correct, wrong, accuracy });

    try {
      const res = await axios.post(
        "http://localhost:5000/api/assignments/performance",
        {
          studentName,
          rollNumber,
          answers: Object.values(answers),
          unit: selectedAssignment.unit,
        }
      );

      if (!res.data.success) {
        alert(res.data.message);
        return;
      }
    } catch (err) {
      if (err.response?.data?.message) {
        alert(err.response.data.message);
        return;
      }
      console.error("❌ Error saving performance:", err);
    }
  };

  const handleAssignmentClick = async (assignment) => {
    if (!rollNumber) return alert("Please enter your details first.");
    if (new Date() > new Date(assignment.deadline)) {
      return alert("Deadline is over! You cannot attempt this assignment.");
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/assignments/check",
        {
          rollNumber,
          unit: assignment.unit,
        }
      );

      if (res.data.attempted) {
        alert("You have already attempted this assignment!");
        return;
      }

      setSelectedAssignment(assignment);
    } catch (err) {
      console.log("❌ Error checking attempt:", err);
    }
  };

  return (
    <div className="learn-container">
      <h1 className="learn-title">🧩 MCQ Assignments – Unit {selectedUnit}</h1>

      {/* DETAIL FORM */}
      {!detailsFilled && (
        <div className="file-card" style={{ padding: "25px" }}>
          <h2>Enter Your Details</h2>

          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Enter your Name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="clean-input"
              required
            />

            <input
              type="text"
              placeholder="Enter your Roll Number"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              className="clean-input"
              required
            />
          </div>

          <button
            className="view-btn"
            onClick={() => {
              if (!studentName || !rollNumber)
                return alert("Please enter both name and roll number!");
              setDetailsFilled(true);
            }}
          >
            Continue 🚀
          </button>
        </div>
      )}

      {/* ASSIGNMENTS LIST */}
      {detailsFilled && !selectedAssignment && (
        <div>
          <h2>📚 Choose an Assignment</h2>

          {assignments.length === 0 && <p>No assignments available for this unit.</p>}

          {assignments.map((a, i) => {
            const deadline = new Date(a.deadline);
            const expired = new Date() > deadline;

            return (
              <div
                key={i}
                className="file-card"
                style={{ cursor: "pointer" }}
                onClick={() => handleAssignmentClick(a)}
              >
                <h3>📘 {a.title}</h3>
                <p>📝 {a.description}</p>
                <p>🔢 Questions: {a.questions.length}</p>
                <p>⏳ Deadline: {deadline.toLocaleString()}</p>

                <p style={{ color: expired ? "red" : "lightgreen" }}>
                  {expired ? "❌ Deadline Over" : "✔ Available"}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* SHOW QUESTIONS */}
      {selectedAssignment && !result && (
        <>
          <h2>📘 Unit {selectedAssignment.unit} – Assignment</h2>

          {selectedAssignment.questions.map((q, index) => (
            <div key={index} className="file-card">
              <h3>{index + 1}. {q.questionText}</h3>

              {q.options.map((opt, oIndex) => (
                <label key={oIndex} className="option-label">
                  <input
                    type="radio"
                    name={`q-${index}`}
                    onChange={() => handleOptionSelect(index, opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}

          <button className="view-btn" onClick={handleSubmit}>
            Submit Assignment
          </button>
        </>
      )}

      {/* RESULT */}
      {result && (
        <div className="result-card">
          <h3>📊 Your Performance</h3>
          <p>🧑‍🎓 Name: {studentName}</p>
          <p>📌 Roll No: {rollNumber}</p>
          <p>📘 Unit: {selectedAssignment.unit}</p>
          <p>✅ Correct: {result.correct}</p>
          <p>❌ Wrong: {result.wrong}</p>
          <p>🎯 Accuracy: {result.accuracy}%</p>
        </div>
      )}
    </div>
  );
}
