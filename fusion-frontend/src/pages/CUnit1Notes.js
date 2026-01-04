import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PageStyles.css";

export default function CUnit1Notes() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/files/all")   // ⭐ Fetch EVERYTHING
      .then((res) => {
        if (Array.isArray(res.data)) {
          
          // ⭐ Filter both cases: "Unit 1" and "1"
          const notes = res.data.filter(
            (f) =>
              f.metadata?.category === "Notes" &&
              (f.metadata?.unit === "Unit 1" || f.metadata?.unit === "1")
          );

          setFiles(notes);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="learn-container">
      <h1 className="learn-title">📘 Unit 1 Notes</h1>
      <p className="learn-text">Here are the notes uploaded by your teacher.</p>

      {files.length === 0 ? (
        <p>No notes available yet for Unit 1.</p>
      ) : (
        <div className="files-list">
          {files.map((file) => (
            <div key={file._id} className="file-card">
              <h3>{file.metadata.title}</h3>

              <p>
                👩‍🏫 <b>Uploaded By:</b> {file.metadata.uploadedBy} <br />
                📅 <b>Date:</b> {new Date(file.uploadDate).toLocaleDateString()}
              </p>

              <a
                href={`http://localhost:5000/api/files/download/${file.filename}`}
                className="view-btn"
                target="_blank"
              >
                📥 View / Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
