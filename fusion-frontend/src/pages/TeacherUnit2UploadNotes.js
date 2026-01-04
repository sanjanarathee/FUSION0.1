import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PageStyles.css";

export default function TeacherUnit2UploadNotes() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file!");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", desc);
    formData.append("category", "Notes");  // ⭐ FIXED
    formData.append("unit", 2);            // ⭐ FIXED
    formData.append("file", file);

    await axios.post("http://localhost:5000/api/files/upload", formData);

    setSuccess(true);
  };

  return (
    <div className="upload-page">
      <h1 className="unit-title">📘 Upload Notes (Unit 2)</h1>

      <div className="upload-form">
        <input
          type="text"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Enter Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <select value="Notes" disabled>
          <option>Notes</option>
        </select>

        <select value="2" disabled>
          <option>Unit 2</option>
        </select>

        <input type="file" onChange={(e) => setFile(e.target.files[0])} />

        <button onClick={handleUpload}>Upload</button>
      </div>

      {success && (
        <p style={{ color: "#00ff00", marginTop: "15px", fontWeight: "bold" }}>
          ✔ Upload successful!
        </p>
      )}

      <button
        className="back-button"
        onClick={() => navigate("/teacher/unit2")}
      >
        ⬅ Back to Unit 2
      </button>
    </div>
  );
}
