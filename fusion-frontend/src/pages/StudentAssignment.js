import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "../styles/student.css";

export default function StudentAssignment() {

const location = useLocation();

const query = new URLSearchParams(location.search);
const selectedUnit = query.get("unit");

const [assignments,setAssignments]=useState([]);
const [selectedAssignment,setSelectedAssignment]=useState(null);
const [answers,setAnswers]=useState({});
const [result,setResult]=useState(null);

const [studentName,setStudentName]=useState("");
const [rollNumber,setRollNumber]=useState("");
const [detailsFilled,setDetailsFilled]=useState(false);



useEffect(()=>{

const fetchAssignments = async()=>{

try{

const res=await axios.get(
`http://localhost:5000/api/assignments/student?unit=${Number(selectedUnit)}&rollNumber=${rollNumber}`
);

setAssignments(res.data.assignments || []);

}catch(err){
console.error(err);
}

};

if(rollNumber){
fetchAssignments();
}

},[selectedUnit,rollNumber]);



const handleOptionSelect=(qIndex,option)=>{
setAnswers({
...answers,
[qIndex]:option
});
};



const handleSubmit = async()=>{

let correct=0;

selectedAssignment.questions.forEach((q,i)=>{

const chosen=answers[i]?.toString().trim().toLowerCase();

const actual=q.correctAnswer?.toString().trim().toLowerCase();

if(chosen===actual){
correct++;
}

});

const wrong=
selectedAssignment.questions.length-correct;

const accuracy=
((correct/selectedAssignment.questions.length)*100).toFixed(2);

setResult({
correct,
wrong,
accuracy
});


try{

await axios.post(
"http://localhost:5000/api/assignments/performance",
{
studentName,
rollNumber,
answers:Object.values(answers),
unit:selectedAssignment.unit
}
);

}catch(err){
console.error(err);
}

};



const handleAssignmentClick = async(assignment)=>{

if(!rollNumber){
alert("Please enter details first");
return;
}

if(new Date()>new Date(assignment.deadline)){
alert("Deadline is over");
return;
}

try{

const res=await axios.post(
"http://localhost:5000/api/assignments/check",
{
rollNumber,
unit:assignment.unit
}
);

if(res.data.attempted){
alert("Already attempted");
return;
}

setSelectedAssignment(assignment);

}catch(err){
console.error(err);
}

};



return(

<div className="student-page">

{/* HEADER */}

<div className="student-header">
<h1 style={{margin:"0 auto"}}>
🧩 MCQ Assignments — Unit {selectedUnit}
</h1>
</div>


{/* FUSION */}
<div className="student-fusion-bg">
FUSION
</div>


<div className="student-content">

{/* DETAILS FORM */}

{!detailsFilled && (

<div className="mcq-box">

<h2 style={{marginBottom:"25px"}}>
Enter Your Details
</h2>

<input
className="mcq-input"
placeholder="Enter your Name"
value={studentName}
onChange={(e)=>setStudentName(e.target.value)}
/>


<input
className="mcq-input"
placeholder="Enter your Roll Number"
value={rollNumber}
onChange={(e)=>setRollNumber(e.target.value)}
/>


<button
className="mcq-btn"
onClick={()=>{

if(!studentName || !rollNumber){
alert("Fill all details");
return;
}

setDetailsFilled(true);

}}
>
Continue 🚀
</button>

</div>

)}



{/* ASSIGNMENT LIST */}

{detailsFilled && !selectedAssignment && (

<div className="student-learn-section">

<h2>📚 Choose Assignment</h2>

<div className="student-learn-grid">

{assignments.map((a)=>(

<div
key={a._id}
className="student-learn-card"
onClick={()=>handleAssignmentClick(a)}
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



{/* QUESTIONS */}

{selectedAssignment && !result && (

<div>

<h2 style={{
textAlign:"center",
marginBottom:"30px"
}}>
📘 Assignment Questions
</h2>

{selectedAssignment.questions.map((q,index)=>(

<div
key={index}
className="mcq-assignment-card"
>

<h3>
{index+1}. {q.questionText}
</h3>

{q.options.map((opt,oIndex)=>(

<label key={oIndex} className="option-label">
  <input
    type="radio"
    name={`q-${index}`}
    value={opt}
    checked={answers[index] === opt}
    onChange={() => handleOptionSelect(index, opt)}
  />
  <span>{opt}</span>
</label>

))}

</div>

))}


<div style={{textAlign:"center"}}>

<button
className="mcq-btn"
onClick={handleSubmit}
>
Submit Assignment
</button>

</div>

</div>

)}



{/* RESULT */}

{result && (

<div className="mcq-result">

<h2>
📊 Performance
</h2>

<p>🧑‍🎓 {studentName}</p>

<p>📌 {rollNumber}</p>

<p>✅ Correct: {result.correct}</p>

<p>❌ Wrong: {result.wrong}</p>

<p>🎯 Accuracy: {result.accuracy}%</p>

</div>

)}


</div>
</div>

);

}