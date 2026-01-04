import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./PageStyles.css";

export default function CUnit1PPT() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        console.log("📡 Fetching Unit 1 PPTs...");

        // 🔥 FIX: Always call ONLY "1"
        const res = await axios.get("http://localhost:5000/api/files/unit/1");

        const pptFiles = res.data.filter(
          (file) =>
            file.metadata?.category?.toLowerCase() === "ppt" &&
            file.metadata?.unit?.toLowerCase() === "unit 1"
        );

        setFiles(pptFiles);
      } catch (error) {
        console.error("❌ Error fetching PPTs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  if (loading) return <p className="learn-text">⏳ Loading PPTs...</p>;

  return (
    <div className="learn-container">
      <h1 className="learn-title">📊 Unit 1 - PPTs</h1>
      <p className="learn-text">
        Here are all the PPTs uploaded by your teacher for Unit 1.
      </p>

      {files.length === 0 ? (
        <p className="learn-text">⚠️ No PPTs uploaded yet for Unit 1.</p>
      ) : (
        <div className="files-list">
          {files.map((file) => (
            <div key={file._id} className="file-card">
              <h3>{file.metadata?.title || file.filename}</h3>

              <p>
                👩‍🏫 <b>Uploaded By:</b> {file.metadata?.uploadedBy} <br />
                📅 <b>Date:</b>{" "}
                {new Date(file.uploadDate).toLocaleDateString("en-GB")}
              </p>

              <div className="file-actions">
                <a
                  href={`http://localhost:5000/api/files/download/${file.filename}`}
                  target="_blank"
                  rel="noreferrer"
                  className="view-btn"
                >
                  📥 View / Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="back-btn" onClick={() => navigate("/unit1")}>
        ⬅ Back to Unit 1
      </button>
    </div>
  );
}
