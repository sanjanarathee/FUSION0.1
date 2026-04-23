import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/student.css";

export default function CUnit3Notes() {

const navigate = useNavigate();

const [files,setFiles] = useState([]);
const [loading,setLoading] = useState(true);

useEffect(()=>{

axios.get(
"http://localhost:5000/api/notes/filter",
{
params:{
subject:"c",
unit:"unit 3",
category:"notes"
}
}
)

.then((res)=>{

if(res.data.success){
setFiles(res.data.files || []);
}

setLoading(false);

})

.catch((err)=>{
console.log(err);
setLoading(false);
});

},[]);


return(

<div className="student-page">

{/* HEADER */}

<div className="student-header">
<h1 style={{margin:"0 auto"}}>
📝 C — Unit 3 Notes
</h1>
</div>


<div className="student-fusion-bg">
FUSION
</div>


<div className="student-content">

<div className="student-learn-section">

<h2>📘 Study Notes</h2>


{loading ? (

<div style={{
textAlign:"center",
marginTop:"60px",
fontSize:"22px",
color:"#64748b"
}}>
Loading notes...
</div>

)

: files.length===0 ? (

<div
className="student-learn-card"
style={{
cursor:"default",
justifyContent:"center"
}}
>

<div style={{textAlign:"center"}}>

<h3>No Notes Uploaded Yet</h3>

<p>
Notes for Unit 3 have not been uploaded.
</p>

</div>

</div>

)

: (

<div className="notes-grid">

{files.map((note,index)=>(

<div
className="note-card"
key={index}
>

<h3 className="note-title">
📘 {note.metadata?.title}
</h3>

<div className="note-meta">

<div>
📂 Category:
{" "}
{note.metadata?.category}
</div>

<div>
👨‍🏫 Uploaded By:
{" "}
{note.metadata?.uploadedBy}
</div>

<div>
📅
{" "}
{new Date(note.uploadDate).toLocaleDateString()}
</div>

</div>

<div className="note-actions">

<a
href={`http://localhost:5000/api/notes/file/${note.filename}`}
target="_blank"
rel="noreferrer"
className="note-btn"
>
View
</a>

<a
href={`http://localhost:5000/api/notes/file/${note.filename}`}
download
className="note-btn"
>
Download
</a>

</div>

</div>

))}

</div>

)}

</div>


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