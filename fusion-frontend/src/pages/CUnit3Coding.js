import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";
import "../styles/student.css";

export default function CUnit3Coding() {

const navigate = useNavigate();

const [questions, setQuestions] = useState([]);
const [selected, setSelected] = useState(null);
  const [language, setLanguage] = useState("c");
  const [code, setCode] = useState("");

  const [result, setResult] = useState(null);

  const [canSubmit, setCanSubmit] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const templates = useMemo(() => ({
  c: `#include <stdio.h>

int main() {
    // Write your C code here
    return 0;
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    // Write your C++ code here
    return 0;
}`
}), []);


  // ⭐ UNIQUE LOCAL STORAGE KEY FOR UNIT 3
  const getStorageKey = (qId, lang) => `fusion_code_unit3_${qId}_${lang}`;

  // 🔥 FETCH C UNIT 3 QUESTIONS (LMS STYLE)
  // 🔥 Fetch GLOBAL coding questions (C language)
useEffect(() => {
  axios
    .get("https://fusion0-1.onrender.com/api/coding/practice", {
      params: { language: "c" },
    })
    .then((res) => {
      console.log("UNIT 3 CODING QUESTIONS:", res.data.questions);
      setQuestions(res.data.questions || []);
    })
    .catch((err) => {
      console.error("UNIT 3 CODING FETCH ERROR:", err);
    });
}, []);


  // ⭐ Load stored code when question/language changes
  useEffect(() => {
    if (selected) {
      const saved = localStorage.getItem(
        getStorageKey(selected._id, language)
      );

      if (saved) setCode(saved);
      else setCode(templates[language]);

      setResult(null);
      setCanSubmit(false);
    }
  }, [selected, language, templates]);

  const handleCodeChange = (val) => {
    setCode(val || "");
    if (selected)
      localStorage.setItem(getStorageKey(selected._id, language), val || "");
  };

  // -------------------- RUN CODE --------------------
  const runCode = async () => {
    if (!selected) return alert("Select a question!");

    try {
      setIsRunning(true);
      setCanSubmit(false);

  const res = await axios.post("https://fusion0-1.onrender.com/api/code/run",
  {
    code,
    language,
    questionId: selected._id,
  }
);

setResult(res.data);

if (
  res.data.success &&
  res.data.testcasesPassed === res.data.totalTestcases
) {
  setCanSubmit(true);
}
    } catch (err) {
      console.error(err);
      alert("Run error");
    } finally {
      setIsRunning(false);
    }
  };

  // -------------------- SUBMIT CODE --------------------
 const handleSubmit = async () => {
  if (!selected) return alert("Select a question first!");
  if (!result) return alert("Run your code first!");
  if (!canSubmit) return alert("Submit only after all testcases pass!");

  const data = JSON.parse(localStorage.getItem("fusionUser"));

  if (!data || !data.user) {
    alert("Please login first!");
    return;
  }

  try {
    setIsSubmitting(true);

    const payload = {
      code,
      language,
      questionId: selected._id,
      userId: data.user.id,
      testcasesPassed: result.testcasesPassed,
      totalTestcases: result.totalTestcases,
    };

    console.log("Submitting payload:", payload);

    const res = await axios.post(
      "https://fusion0-1.onrender.com/api/coding/submit",
      payload,
      {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      }
    ); // ✅ VERY IMPORTANT semicolon

    if (res.data.success) {
      alert("✅ Accepted!");

      if (res.data.submissionId) {
        window.location.href = `/submission/${res.data.submissionId}`;
      }
    } else {
      alert(res.data.message || "Submit failed");
    }
  } catch (err) {
    console.error("Submit error:", err);
    alert("Submit failed");
  } finally {
    setIsSubmitting(false);
  }
};
  const copyCode = () => {
    navigator.clipboard.writeText(code);
    alert("Copied!");
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `solution.${language === "c" ? "c" : "cpp"}`;
    a.click();
  };

  const resetTemplate = () => {
    setCode(templates[language]);
  };

 return (
<>

{/* QUESTION LIST SCREEN */}
{!selected && (

<div className="student-page">

<div className="student-header">
<h1 style={{margin:"0 auto"}}>
💻 Coding Practice 
</h1>
</div>

{/* <div className="student-fusion-bg">
FUSION
</div> */}

<div className="student-content">

<div className="student-learn-section">

<h2>💻 Choose a Coding Question</h2>

<div className="student-learn-grid">

{questions.map((q)=>(

<div
key={q._id}
className="student-learn-card"
onClick={()=>{
setSelected(q);
setLanguage(q.language || "c");
setResult(null);
setCanSubmit(false);
}}
>

<div className="student-learn-left">

<div className="student-learn-icon">
💻
</div>

<div>
<h3>{q.title}</h3>

<p>
{q.description?.substring(0,70)}...
</p>

</div>

</div>

<div className="student-learn-arrow">
➡
</div>

</div>

))}

</div>

</div>

{/* THIS WAS MISSING */}
</div>

<button
className="student-back-btn"
onClick={()=>navigate("/learn-c/unit3")}
>
⬅ Back to Unit
</button>

</div>

)}



{/* CODING SCREEN */}
{selected && (

<div className="student-page">

<div className="student-header">
<h1 style={{margin:"0 auto"}}>
💻 {selected.title}
</h1>
</div>
{/* 
<div className="student-fusion-bg">
FUSION
</div> */}

<div className="student-content">

<div className="leetcode-layout">

<div className="left-panel">

<h2>{selected.title}</h2>

<p className="question-desc">
{selected.description}
</p>

<h3 style={{marginTop:"30px"}}>
🧪 Testcases
</h3>

{selected.testcases?.map((tc,i)=>(

<div key={i} className="sample-box">
<p><b>Testcase {i+1}</b></p>
<p>Input: {tc.input}</p>
<p>Expected: {tc.expected}</p>
</div>

))}

</div>



<div className="right-panel">

<div className="editor-top-row">

<select
className="language-select"
value={language}
onChange={(e)=>setLanguage(e.target.value)}
>
<option value="c">C</option>
<option value="cpp">C++</option>
</select>

<button
className="editor-utility-btn"
onClick={resetTemplate}
>
Reset
</button>

<button
className="editor-utility-btn"
onClick={copyCode}
>
Copy
</button>

<button
className="editor-utility-btn"
onClick={downloadCode}
>
Download
</button>

</div>


<div style={{height:"420px"}}>

<Editor
height="100%"
theme="vs-dark"
language={language}
value={code}
onChange={handleCodeChange}
/>

</div>


<div
className="editor-top-row"
style={{marginTop:"20px"}}
>

<button
className="run-btn"
onClick={runCode}
disabled={isRunning}
>
{isRunning ? "Running..." : "▶ Run Code"}
</button>


<button
className={
canSubmit
? "submit-btn enabled"
: "submit-btn disabled"
}
disabled={!canSubmit || isSubmitting}
onClick={handleSubmit}
>
{isSubmitting ? "Submitting..." : "Submit"}
</button>


{/* <button
className="back-btn"
onClick={()=>{
setSelected(null);
setResult(null);
}}
>
⬅ Back
</button> */}

</div>



{result && (
<div className="bottom-evaluation-row">

{/* Step Evaluation Left */}
{result?.stepResults && (
<div className="step-box-clean">

<h3>📊 Step Evaluation</h3>

{result.stepResults.map((step,i)=>(

<div
key={i}
className="step-row-clean"
>
<div>
{step.passed ? "✅" : "❌"} {step.label}
</div>

<div>
{step.marksAwarded}/{step.marksTotal}
</div>

</div>

))}

<div className="total-clean">
Total Score: {result.totalMarks}
</div>

</div>
)}


{/* Results Right */}
<div className="results-box">

<h3>📋 Results</h3>

<p>
Passed: {result.testcasesPassed}/{result.totalTestcases}
</p>

{result.results?.map((r,i)=>(

<div
key={i}
className="testcase-card"
>

<p><b>Testcase {i+1}</b></p>
<p>Input: {r.input}</p>
<p>Expected: {r.expected}</p>
<p>Got: {r.got}</p>
<p>Status: {r.status}</p>

</div>

))}

</div>

</div>
)}
</div>

</div>

</div>

</div>
/* <button
className="back-btn"
onClick={()=>{
setSelected(null);
setResult(null);
}}
>
⬅ Back
</button> */

)}

</>
);
}