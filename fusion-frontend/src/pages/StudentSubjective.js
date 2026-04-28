import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function StudentSubjective() {
  const [assignments, setAssignments] = useState([]);
  const [answers, setAnswers] = useState({});
  const [files, setFiles] = useState({});
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
          `/api/assignments/subjective/student?unit=${unit}&section=${section}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // ✅ FETCH SUBMISSIONS
        const submissionsRes = await axios.get(
          `/api/assignments/subjective/submissions?userId=${userId}`,
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
  const id = s.assignmentId?._id || s.assignmentId;

  // 🔥 only keep latest submission
  if (
    !resultMap[id] ||
    new Date(s.createdAt) > new Date(resultMap[id].createdAt)
  ) {
    resultMap[id] = s;
  }

  ids.push(id);
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
  const handleFileChange = (id, file) => {
  setFiles({ ...files, [id]: file });
};

  const handleSubmit = async (assignment) => {
  try {
    const formData = new FormData();

    formData.append("assignmentId", assignment._id);
    formData.append("answer", answers[assignment._id] || "");
    formData.append("userId", user?.user?.id);

    // 👉 PDF add karo
    if (files[assignment._id]) {
      formData.append("file", files[assignment._id]);
    }

    const res = await axios.post(
  "/api/assignments/subjective/submit",
  formData,
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

container:{
  minHeight:"100vh",
  background:"#eef2f7",
  padding:"20px"
},

title:{
  background:"linear-gradient(135deg,#ff7a00,#ff9f43)",
  color:"white",
  padding:"30px",
  borderRadius:"18px",
  textAlign:"center",
  fontSize:"34px",
  fontWeight:"700",
  marginBottom:"50px",
  boxShadow:"0 6px 20px rgba(0,0,0,0.08)"
},

noData:{
  textAlign:"center",
  fontSize:"20px",
  color:"#64748b"
},

card:{
  background:"white",
  padding:"30px",
  borderRadius:"18px",
  marginBottom:"30px",
  maxWidth:"1100px",
  marginLeft:"auto",
  marginRight:"auto",
  boxShadow:"0 6px 20px rgba(0,0,0,.06)"
},

question:{
  fontSize:"24px",
  fontWeight:"700",
  marginBottom:"15px",
  color:"#0f172a"
},

textarea:{
  width:"100%",
  padding:"18px",
  borderRadius:"12px",
  border:"1px solid #dbe3ef",
  fontSize:"16px",
  background:"#f8fafc",
  marginTop:"10px",
  outline:"none"
},

/* 🔥 NEW: Upload + Submit Row */
actionsRow:{
  display:"flex",
  alignItems:"center",
  gap:"12px",
  marginTop:"15px"
},

/* 🔥 Upload Button */
uploadBtn:{
  padding:"10px 16px",
  borderRadius:"8px",
  background:"#eef2ff",
  border:"1px solid #6366f1",
  cursor:"pointer",
  fontSize:"14px",
  color:"#3730a3",
  fontWeight:"500",
  transition:"0.2s"
},

/* 🔥 Submit Button (clean) */
submitBtn:{
  padding:"10px 18px",
  borderRadius:"8px",
  border:"none",
  fontSize:"14px",
  fontWeight:"600",
  color:"white",
  cursor:"pointer"
},

/* File name */
fileName:{
  marginTop:"8px",
  fontSize:"13px",
  color:"#16a34a",
  fontWeight:"500"
},

/* Result */
resultBox:{
  marginTop:"20px",
  padding:"20px",
  background:"#ecfdf3",
  border:"1px solid #bbf7d0",
  borderRadius:"14px",
  color:"#166534",
  fontSize:"16px"
}

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

        <p style={{
  fontSize: "14px",
  color: "#64748b",
  marginBottom: "10px",
  fontWeight: "500"
}}>
  Max Marks: {a.maxMarks || 10}
</p>

        {/* TEXT AREA */}
        <textarea
          rows="5"
          placeholder="Write your answer..."
          style={styles.textarea}
          disabled={submittedIds.includes(a._id)}
          onChange={(e) => handleChange(a._id, e.target.value)}
        />

        {/* ACTION ROW (UPLOAD + SUBMIT) */}
        <div style={styles.actionsRow}>
          <label style={styles.uploadBtn}>
            📎 Upload PDF
            <input
              type="file"
              accept=".pdf"
              style={{ display: "none" }}
              disabled={submittedIds.includes(a._id)}
              onChange={(e) =>
                handleFileChange(a._id, e.target.files[0])
              }
            />
          </label>

          <button
            disabled={submittedIds.includes(a._id)}
            style={{
              ...styles.submitBtn,
              backgroundColor: submittedIds.includes(a._id)
                ? "#9ca3af"
                : "#22c55e",
            }}
            onClick={() => handleSubmit(a)}
          >
            {submittedIds.includes(a._id) ? "Submitted" : "Submit"}
          </button>
        </div>

        {/* FILE NAME */}
        {files[a._id] && (
          <p style={styles.fileName}>
            📄 {files[a._id].name}
          </p>
        )}

        {/* RESULT */}
        {results[a._id] && (
          <div style={styles.resultBox}>
<p>
  <b>Marks:</b> {Math.min(results[a._id].marks, a.maxMarks)}
</p>
<p style={{ whiteSpace: "pre-line" }}>
  <b>Feedback:</b> {results[a._id].feedback || "No feedback available"}
</p>
          </div>
        )}
      </div>
    ))}
  </div>
);
}