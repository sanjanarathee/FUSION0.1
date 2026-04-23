import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/student.css";

export default function StudentNotes() {

const { subject, unitId } = useParams();
const navigate = useNavigate();

const [files,setFiles] = useState([]);
const [loading,setLoading] = useState(true);

useEffect(()=>{

const fetchNotes = async()=>{

try{

const res = await axios.get(
"https://fusion0-1.onrender.com/api/files/filter",
{
params:{
subject:subject,
unit:`unit ${unitId}`,
category:"notes"
}
}
);

setFiles(res.data.files || []);

}
catch(err){
console.error(err);
}
finally{
setLoading(false);
}

};

fetchNotes();

},[subject,unitId]);


return(

<div className="student-page">

{/* HEADER */}
<div className="student-header">
<h1 style={{margin:"0 auto"}}>
📘 {subject.toUpperCase()} — Unit {unitId} Notes
</h1>
</div>




<div className="student-content">

<div className="student-learn-section">

<h2>
📚 Study Materials
</h2>


{loading ? (

<div style={{
textAlign:"center",
marginTop:"60px",
fontSize:"22px",
color:"#64748b"
}}>
Loading Notes...
</div>

)

: files.length===0 ? (

<div
className="student-learn-card"
style={{
justifyContent:"center",
cursor:"default"
}}
>

<div style={{textAlign:"center"}}>

<h3>No Notes Available</h3>

<p>
Study material has not been uploaded yet.
</p>

</div>

</div>

)

: (

<div className="notes-grid">

{files.map((file)=>(
<div
className="note-card"
key={file._id}
>

<h3 className="note-title">
📘 {file.metadata?.title}
</h3>

<div className="note-meta">

<div>
📂 Category:
{" "}
{file.metadata?.category}
</div>

<div>
👨‍🏫 Uploaded By:
{" "}
{file.metadata?.uploadedBy}
</div>

<div>
📅
{" "}
{new Date(file.uploadDate)
.toLocaleDateString("en-GB")}
</div>

</div>


<div className="note-actions">

<a
className="note-btn"
href={`https://fusion0-1.onrender.com/api/files/download/${file.filename}`}
target="_blank"
rel="noreferrer"
>
View
</a>

<a
className="note-btn"
href={`https://fusion0-1.onrender.com/api/files/download/${file.filename}`}
download
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
onClick={()=>navigate(-1)}
>
⬅ Back
</button>

</div>

</div>

);

}