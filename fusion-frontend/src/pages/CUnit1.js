import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/student.css";

export default function CUnit1(){

const navigate = useNavigate();
const location = useLocation();

const isCpp = location.pathname.includes("learn-cpp");
const language = isCpp ? "cpp" : "c";

return(

<div className="student-page">

{/* HEADER */}
<div className="student-header">
<h1 style={{margin:"0 auto"}}>
Unit 1
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
onClick={()=>navigate(`/student/notes/${language}/1`)}
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
onClick={()=>navigate(`/learn-${language}/unit1/ppt`)}
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
onClick={()=>navigate(`/student-assignment?unit=1`)}
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
onClick={()=>navigate(`/learn-${language}/unit/1/subjective`)}
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
onClick={()=>navigate(`/learn-${language}/unit1/coding`)}
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



<button
className="student-back-btn"
onClick={()=>navigate(`/learn-${language}`)}
>
⬅ Back to Units
</button>

</div>
</div>

);

}