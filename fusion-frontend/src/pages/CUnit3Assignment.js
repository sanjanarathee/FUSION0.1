import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/student.css";

export default function CUnit3Assignments() {

const navigate = useNavigate();

const [assignments,setAssignments] = useState([]);

const unit = new URLSearchParams(window.location.search).get("unit");


useEffect(()=>{

axios.get("https://fusion0-1.onrender.com/api/assignments",{
params:{
unit:unit,
subject:"c"
}
})
.then((res)=>{
setAssignments(res.data.assignments || []);
})
.catch((err)=>{
console.error(err);
});

},[unit]);


return(

<div className="student-page">

{/* HEADER */}

<div className="student-header">
<h1 style={{margin:"0 auto"}}>
🧩 MCQ Assignments — Unit {unit}
</h1>
</div>


{/* FUSION */}

<div className="student-fusion-bg">
FUSION
</div>


<div className="student-content">

{assignments.length===0 ? (

<div style={{
textAlign:"center",
fontSize:"22px",
color:"#64748b",
marginTop:"80px"
}}>
No assignments available.
</div>

) : (

<div className="student-learn-section">

<h2>🧠 Available Assignments</h2>

<div className="student-learn-grid">

{assignments.map((a)=>(

<div
key={a._id}
className="student-learn-card"
onClick={()=>navigate(`/student/attempt-assignment/${a._id}`)}
>

<div className="student-learn-left">

<div className="student-learn-icon">
📝
</div>

<div>
<h3>{a.title}</h3>
<p>{a.description}</p>
</div>

</div>

<div className="student-learn-arrow">
➡
</div>

</div>

))}

</div>

</div>

)}


<button
className="student-back-btn"
onClick={()=>navigate("/learn-c/unit3")}
>
⬅ Back
</button>


</div>
</div>

);

}