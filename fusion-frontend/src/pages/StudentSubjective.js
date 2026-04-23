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
          `https://fusion0-1.onrender.com/api/assignments/subjective/student?unit=${unit}&section=${section}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // ✅ FETCH SUBMISSIONS
        const submissionsRes = await axios.get(
          `https://fusion0-1.onrender.com/api/assignments/subjective/submissions?userId=${userId}`,
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
        "https://fusion0-1.onrender.com/api/assignments/subjective/submit",
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
fontSize:"28px",
fontWeight:"700",
marginBottom:"20px",
color:"#0f172a"
},

textarea:{
width:"100%",
padding:"20px",
borderRadius:"14px",
border:"1px solid #dbe3ef",
fontSize:"18px",
background:"#f8fafc",
color:"#111827",
outline:"none"
},

button:{
marginTop:"20px",
padding:"14px 30px",
border:"none",
borderRadius:"12px",
fontSize:"16px",
fontWeight:"600",
color:"white",
cursor:"pointer",
background:"#6366f1"
},

resultBox:{
marginTop:"20px",
padding:"20px",
background:"#ecfdf3",
border:"1px solid #bbf7d0",
borderRadius:"14px",
color:"#166534",
fontSize:"18px"
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