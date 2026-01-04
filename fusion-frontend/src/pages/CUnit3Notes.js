import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PageStyles.css";

export default function CUnit3Notes() {
  const [file, setFile] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/notes/unit/3")
      .then((res) => {
        if (res.data.success) setFile(res.data.notes);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="learn-container">
      <h1 className="learn-title">📝 Unit 3 – Notes</h1>
      <p className="learn-text">Download detailed study notes uploaded by teacher.</p>

      {!file ? (
        <p style={{ marginTop: "20px" }}>No notes uploaded yet.</p>
      ) : (
        <iframe
          src={`http://localhost:5000/uploads/unit3/notes/${file}`}
          className="pdf-viewer"
          title="Unit 3 Notes"
        ></iframe>
      )}
    </div>
  );
}
