import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PageStyles.css";

export default function TeacherUnit3UploadNotes() {
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
    formData.append("category", "Notes");
    formData.append("unit", 3);
    formData.append("file", file);

    await axios.post("http://localhost:5000/api/files/upload", formData);

    setSuccess(true);
  };

  return (
    <div className="upload-page">
      <h1 className="unit-title">📘 Upload Study Material (Unit 3)</h1>

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

        <select value="3" disabled>
          <option>Unit 3</option>
        </select>

        <input type="file" onChange={(e) => setFile(e.target.files[0])} />

        <button onClick={handleUpload}>Upload</button>
      </div>

      {/* Success Message */}
      {success && (
        <p style={{ color: "#00ff00", marginTop: "15px", fontWeight: "bold" }}>
          ✔ Upload successful!
        </p>
      )}

      {/* ⭐ NEW BUTTON: View uploaded study material */}
      {success && (
        <button
          className="back-button"
          style={{ marginTop: "10px" }}
          onClick={() => navigate("/view-uploads")}
        >
          📂 View Uploaded Study Materials
        </button>
      )}

      {/* Back to Unit 3 */}
      <button
        className="back-button"
        onClick={() => navigate("/teacher/unit3")}
      >
        ⬅ Back to Unit 3
      </button>
    </div>
  );
}
