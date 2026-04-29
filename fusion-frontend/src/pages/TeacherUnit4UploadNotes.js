import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/teacher.css";   // ✅ FIXED

export default function TeacherUnit4UploadNotes({ course = "c" }) {
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
    formData.append("unit", "4");
    formData.append("subject", course);
    formData.append("file", file);

    await axios.post(
"https://fusion0-1.onrender.com/api/files/upload",
      formData
    );

    setSuccess(true);
  };

  return (
    <div className="upload-modern-page">

      {/* 🔶 HEADER */}
      <div className="unit-header">
  <h1>📘 Upload Study Material</h1>
</div>

      {/* 📦 FORM CARD */}
      <div className="upload-card">

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            placeholder="Enter title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            placeholder="Enter description..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group small">
            <label>Category</label>
            <select value="Notes" disabled>
              <option>Notes</option>
            </select>
          </div>

          <div className="form-group small">
            <label>Unit</label>
            <select value="4" disabled>
              <option>Unit 4</option>
            </select>
          </div>
        </div>

        {/* 🔥 CUSTOM FILE INPUT */}
        <div className="form-group">
          <label>Upload File</label>

          <div className="custom-file-upload">
            <label htmlFor="fileUpload" className="file-label">
              <div className="file-content">
  <div className="file-icon">📂</div>

  {file ? (
    <div>
      <p className="file-main">Selected File</p>
      <p className="file-sub">{file.name}</p>
    </div>
  ) : (
    <div>
      <p className="file-main">Click to upload</p>
      {/* <p className="file-sub">PDF, DOC, PPT allowed</p> */}
    </div>
  )}
</div>
            </label>

            <input
              id="fileUpload"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              hidden
            />
          </div>
        </div>

        <button className="upload-btn" onClick={handleUpload}>
          🚀 Upload
        </button>

        {success && (
          <p className="success-msg">
            ✔ Upload successful!
          </p>
        )}
      </div>

      {/* 🔙 BUTTONS */}
      <div className="upload-actions">

        {success && (
          <button
            className="secondary-btn"
            onClick={() => navigate("/view-uploads")}
          >
            📂 View Uploads
          </button>
        )}

        <button
          className="back-btn"
          onClick={() => navigate("/teacher/unit4")}
        >
          ← Back to Unit 4
        </button>
      </div>

    </div>
  );
}