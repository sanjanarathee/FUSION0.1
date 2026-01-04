import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PageStyles.css";

export default function CUnit2Notes() {
  const [file, setFile] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/notes/unit/2")   // ⭐ Unit Changed
      .then((res) => {
        if (res.data.success) setFile(res.data.notes);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="learn-container">
      <h1 className="learn-title">📝 Unit 2 – Notes</h1>
      <p className="learn-text">
        Download detailed study notes uploaded by your teacher.
      </p>

      {!file ? (
        <p style={{ marginTop: "20px" }}>No notes uploaded yet.</p>
      ) : (
        <iframe
          src={`http://localhost:5000/uploads/unit2/notes/${file}`}  // ⭐ Unit Changed
          className="pdf-viewer"
          title="Unit 2 Notes"
        ></iframe>
      )}
    </div>
  );
}
