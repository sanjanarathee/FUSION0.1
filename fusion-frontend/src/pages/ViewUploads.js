import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/uploads.css";   // ✅ FIXED

export default function ViewUploads() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState("Unit 1");
  const navigate = useNavigate();

  // Fetch files
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get("https://fusion0-1.onrender.com/api/files");
        setFiles(res.data);
      } catch (error) {
        toast.error("⚠️ Failed to load files!");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  // Delete file
  const handleDelete = async (filename) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      await axios.delete(
        `https://fusion0-1.onrender.com/api/files/${filename}`
      );

      setFiles(files.filter((f) => f.filename !== filename));
      toast.success("🗑️ File deleted successfully!");
    } catch (error) {
      toast.error("❌ Failed to delete file!");
    }
  };

  // Filter
  const filteredFiles =
    selectedUnit === "All"
      ? files
      : files.filter((f) => {
          const unitMeta = f.metadata?.unit?.toString().trim();
          const selectedNum = selectedUnit.replace("Unit ", "").trim();

          return (
            unitMeta === selectedUnit ||
            unitMeta === selectedNum
          );
        });

  if (loading) return <p className="uploads-text">⏳ Loading...</p>;

  return (
    <div className="uploads-page">
      <h1 className="uploads-title">📂 Uploaded Study Materials</h1>
      <p className="uploads-subtext">
        View, download, or delete uploaded notes, PPTs, and assignments.
      </p>

      {/* UNIT FILTER */}
      <div className="unit-filter">
        {["Unit 1", "Unit 2", "Unit 3", "Unit 4"].map((unit) => (
          <button
            key={unit}
            className={`unit-btn ${
              selectedUnit === unit ? "active-unit" : ""
            }`}
            onClick={() => setSelectedUnit(unit)}
          >
            {unit}
          </button>
        ))}
      </div>

      {/* FILES */}
      {filteredFiles.length === 0 ? (
        <p className="uploads-text">No uploaded files available.</p>
      ) : (
        <div className="uploads-grid">
          {filteredFiles.map((file) => (
            <div key={file._id} className="upload-card">
              <h3>{file.metadata?.title || file.filename}</h3>

              <p>
                📘 <b>Unit:</b> {file.metadata?.unit} <br />
                🗂️ <b>Category:</b> {file.metadata?.category} <br />
                👩‍🏫 <b>Uploaded By:</b>{" "}
                {file.metadata?.uploadedBy || "Unknown"} <br />
                ⏰ <b>Date:</b>{" "}
                {new Date(file.uploadDate).toLocaleDateString("en-GB")}
              </p>

              <div className="file-actions">
                <a
                  href={`https://fusion0-1.onrender.com/api/files/file/${file.filename}`}
                  target="_blank"
                  rel="noreferrer"
                  className="view-btn"
                >
                  📥 Download
                </a>

                <button
                  onClick={() => handleDelete(file.filename)}
                  className="delete-btn"
                >
                  ❌ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        className="back-btn"
        onClick={() => navigate("/teacher-dashboard")}
      >
        ⬅ Back to Dashboard
      </button>

      {/* 🔥 Light theme toast */}
      <ToastContainer theme="light" />
    </div>
  );
}