import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/student.css";

export default function CAssignments(){

const navigate = useNavigate();

return(

<div className="student-page">

{/* HEADER */}
<div className="student-header">
<h1 style={{margin:"0 auto"}}>
🧾 Assignments / Quizzes
</h1>
</div>


{/* FUSION */}
<div className="student-fusion-bg">
FUSION
</div>


<div className="student-content">

<div className="student-learn-section">

<h2>🧠 Assignment Activities</h2>

<div className="student-learn-grid">

<div
className="student-learn-card"
onClick={()=>navigate("/student-assignment?unit=1")}
>

<div className="student-learn-left">

<div className="student-learn-icon">
📝
</div>

<div>
<h3>MCQ Quiz</h3>
<p>Attempt objective assignment</p>
</div>

</div>

<div className="student-learn-arrow">
➡
</div>

</div>



<div
className="student-learn-card"
onClick={()=>navigate("/learn-c/unit/1/subjective")}
>

<div className="student-learn-left">

<div className="student-learn-icon">
✍
</div>

<div>
<h3>Subjective Assignment</h3>
<p>Submit written answers</p>
</div>

</div>

<div className="student-learn-arrow">
➡
</div>

</div>

</div>

</div>


<button
className="student-back-btn"
onClick={()=>navigate("/learn-c/unit1")}
>
⬅ Back to Unit 1
</button>


</div>
</div>

);

}