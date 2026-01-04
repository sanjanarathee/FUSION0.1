import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PageStyles.css";

export default function CUnit3Ppt() {
  const [ppts, setPpts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPPTs = async () => {
      try {
        console.log("📡 Fetching PPTs for Unit 3...");

        // 🔥 Correct API call (unit = 3 exactly like DB)
        const res = await axios.get(
          "http://localhost:5000/api/files/unit/3"
        );

        // 🔥 Filter only PPTs (category = "PPT")
        const filteredPPTs = res.data.filter(
          (file) =>
            file.metadata?.category &&
            file.metadata.category.toLowerCase() === "ppt"
        );

        setPpts(filteredPPTs);
      } catch (error) {
        console.error("❌ Error fetching Unit 3 PPTs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPPTs();
  }, []);

  if (loading) {
    return <p className="learn-text">⏳ Loading PPTs for Unit 3...</p>;
  }

  return (
    <div className="learn-container">
      <h1 className="learn-title">📊 Unit 3 – PPTs</h1>
      <p className="learn-text">
        PPTs uploaded by your teacher for Unit 3.
      </p>

      {ppts.length === 0 ? (
        <p className="learn-text">No PPT uploaded yet.</p>
      ) : (
        <div className="files-list">
          {ppts.map((ppt) => (
            <div key={ppt._id} className="file-card">
              <h3>{ppt.metadata?.title || ppt.filename}</h3>

              <p>
                👩‍🏫 <b>Uploaded By:</b> {ppt.metadata?.uploadedBy || "Teacher"}
                <br />
                📘 <b>Unit:</b> {ppt.metadata?.unit}
                <br />
                📅 <b>Date:</b>{" "}
                {new Date(ppt.uploadDate).toLocaleDateString("en-GB")}
              </p>

              <div className="file-actions">
                <a
                  href={`http://localhost:5000/api/files/download/${ppt.filename}`}
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

      <button className="back-btn" onClick={() => navigate("/learn-c/unit3")}>
        ⬅ Back to Unit 3
      </button>
    </div>
  );
}
