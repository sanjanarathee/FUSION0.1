import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/student.css";

export default function CUnit3() {

const navigate = useNavigate();

return (
<div className="student-page">

{/* HEADER */}
<div className="student-header">
<h1 style={{margin:"0 auto"}}>
Unit 3
</h1>
</div>


{/* FUSION */}
<div className="student-fusion-bg">
FUSION
</div>


<div className="student-content">

{/* STUDY MATERIAL */}
<div className="student-learn-section">

<h2>📘 Study Material</h2>

<div className="student-learn-grid">

<div
className="student-learn-card"
onClick={()=>navigate("/student/notes/c/3")}
>
<div className="student-learn-left">
<div className="student-learn-icon">📝</div>

<div>
<h3>View Notes</h3>
<p>Access study notes</p>
</div>

</div>

<div className="student-learn-arrow">➡</div>
</div>


<div
className="student-learn-card"
onClick={()=>navigate("/learn-c/unit3/ppt")}
>
<div className="student-learn-left">
<div className="student-learn-icon">📄</div>

<div>
<h3>View PPTs</h3>
<p>Access presentation files</p>
</div>

</div>

<div className="student-learn-arrow">➡</div>
</div>

</div>
</div>



{/* ASSIGNMENTS */}
<div className="student-learn-section">

<h2>🧠 Assignments</h2>

<div className="student-learn-grid">

<div
className="student-learn-card"
onClick={()=>navigate("/student-assignment?unit=3")}
>
<div className="student-learn-left">
<div className="student-learn-icon">🎯</div>

<div>
<h3>Assignment Quiz</h3>
<p>Attempt Quiz</p>
</div>

</div>

<div className="student-learn-arrow">➡</div>
</div>


<div
className="student-learn-card"
onClick={()=>navigate("/learn-c/unit/3/subjective")}
>
<div className="student-learn-left">
<div className="student-learn-icon">📝</div>

<div>
<h3>Subjective Assignment</h3>
<p>Submit written answers</p>
</div>

</div>

<div className="student-learn-arrow">➡</div>
</div>

</div>
</div>



{/* CODING PRACTICE */}
<div className="student-learn-section">

<h2>💻 Coding Practice</h2>

<div className="student-learn-grid">

<div
className="student-learn-card"
onClick={()=>navigate("/learn-c/unit3/coding")}
>
<div className="student-learn-left">
<div className="student-learn-icon">💻</div>

<div>
<h3>Coding Practice</h3>
<p>Solve programming questions</p>
</div>

</div>

<div className="student-learn-arrow">➡</div>
</div>

</div>
</div>


{/* BACK BUTTON */}
<button
className="student-back-btn"
onClick={()=>navigate("/learn-c")}
>
⬅ Back to Units
</button>


</div>
</div>
);
}