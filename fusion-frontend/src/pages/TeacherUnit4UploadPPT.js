import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/teacher.css";

export default function TeacherUnit2UploadPPT({ course = "c" }) {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select a PPT!");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", desc);
    formData.append("category", "PPT");
    formData.append("unit", "2");   // ✅ Unit 2
    formData.append("subject", course);
    formData.append("file", file);

    await axios.post(
"http://localhost:5000/api/files/upload",
      formData
    );

    setSuccess(true);
  };

  return (
    <div className="upload-modern-page">

      <div className="upload-header">
        <h1>📊 Upload PPT</h1>
      </div>

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
            <select value="PPT" disabled>
              <option>PPT</option>
            </select>
          </div>

          <div className="form-group small">
            <label>Unit</label>
            <select value="2" disabled>
              <option>Unit 2</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Upload File</label>

          <label className="file-upload-box">
            <span className="file-main">
              📁 {file ? file.name : "Click to upload"}
            </span>

            <input
              type="file"
              accept=".ppt,.pptx"
              onChange={(e) => setFile(e.target.files[0])}
              hidden
            />
          </label>
        </div>

        <button className="upload-btn" onClick={handleUpload}>
          🚀 Upload
        </button>

        {success && (
          <p className="success-msg">
            ✔ PPT uploaded successfully!
          </p>
        )}
      </div>

      <div className="upload-actions">
        <button
          className="back-btn"
          onClick={() => navigate("/teacher/unit2")}
        >
          ← Back to Unit 2
        </button>
      </div>

    </div>
  );
}