import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function StudentSubjective() {
  const [assignments, setAssignments] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const [submittedIds, setSubmittedIds] = useState([]);

  // ✅ GET UNIT FROM URL
  const { unit } = useParams();

  // ✅ GET USER
  const userData = JSON.parse(localStorage.getItem("fusionUser"));
  const user = JSON.parse(localStorage.getItem("fusionUser"));

  console.log("USER:", user);

  const userId = userData?.user?.id;
  const section = userData?.user?.section;
  const token = userData?.token;

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("DEBUG:", { userId, section, unit });

        if (!userId || !section || !unit) {
          console.error("User or unit missing. Please login again.");
          return;
        }

        // ✅ FETCH ASSIGNMENTS
        const assignmentsRes = await axios.get(
          `https://fusion-backend.onrender.com/api/assignments/subjective/student?unit=${unit}&section=${section}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // ✅ FETCH SUBMISSIONS
        const submissionsRes = await axios.get(
          `https://fusion-backend.onrender.com/api/assignments/subjective/submissions?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAssignments(assignmentsRes.data.assignments || []);

        // ✅ MAP RESULTS
        const resultMap = {};
        const ids = [];

        submissionsRes.data.submissions.forEach((s) => {
          resultMap[s.assignmentId] = s;
          ids.push(s.assignmentId);
        });

        setResults(resultMap);
        setSubmittedIds(ids);

      } catch (err) {
        console.error("❌ Fetch error:", err);
      }
    };

    fetchData();
  }, [userId, section, unit, token]);

  const handleChange = (id, value) => {
    setAnswers({ ...answers, [id]: value });
  };

  const handleSubmit = async (assignment) => {
    try {
      const res = await axios.post(
        "https://fusion-backend.onrender.com/api/assignments/subjective/submit",
        {
          assignmentId: assignment._id,
          answer: answers[assignment._id],
userId: user?.user?.id           },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResults({
        ...results,
        [assignment._id]: res.data.submission,
      });

      setSubmittedIds([...submittedIds, assignment._id]);

    } catch (err) {
      console.error(err);
      alert("Submission failed");
    }
  };

  // ✅ STYLES (FIXED ERROR)
  const styles = {
  container: {
    minHeight: "100vh",
    background: "#1e2a47", // 🔥 same fusion dark blue
    padding: "40px",
    fontFamily: "Segoe UI",
  },

  title: {
    textAlign: "center",
    color: "#ffffff",
    marginBottom: "40px",
    fontSize: "28px",
    fontWeight: "600",
  },

  noData: {
    textAlign: "center",
    color: "#ccc",
    fontSize: "18px",
  },

  card: {
    background: "#24345a", // 🔥 fusion card color
    padding: "25px",
    borderRadius: "15px",
    marginBottom: "25px",
    maxWidth: "700px",
    marginLeft: "auto",
    marginRight: "auto",
    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
  },

  question: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "12px",
    color: "#ffffff",
  },

  textarea: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    marginTop: "10px",
    background: "#1b2745",
    color: "#fff",
    outline: "none",
  },

  button: {
    marginTop: "15px",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    fontWeight: "500",
    background: "#00c9a7", // 🔥 fusion green button
  },

  resultBox: {
    marginTop: "15px",
    padding: "12px",
    background: "#1f3d2b",
    borderRadius: "8px",
    color: "#a5f3c7",
  },
};
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📝 Subjective Assignments</h2>

      {assignments.length === 0 && (
        <p style={styles.noData}>No assignments available</p>
      )}

      {assignments.map((a) => (
        <div key={a._id} style={styles.card}>
          <p style={styles.question}>{a.question}</p>

          <textarea
            rows="5"
            placeholder="Write your answer..."
            style={styles.textarea}
            disabled={submittedIds.includes(a._id)}
            onChange={(e) => handleChange(a._id, e.target.value)}
          />

          <button
            disabled={submittedIds.includes(a._id)}
            style={{
              ...styles.button,
              backgroundColor: submittedIds.includes(a._id)
                ? "#aaa"
                : "#4CAF50",
            }}
            onClick={() => handleSubmit(a)}
          >
            {submittedIds.includes(a._id) ? "Submitted" : "Submit"}
          </button>

          {results[a._id] && (
            <div style={styles.resultBox}>
              <p><b>Marks:</b> {results[a._id].marks}</p>
              <p><b>Feedback:</b> {results[a._id].feedback}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}