import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./PageStyles.css";

export default function SubmissionResult() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("details"); // details | code | output
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/code/submission/${id}`)
      .then((res) => setData(res.data.submission))
      .catch(console.error);
  }, [id]);

  if (!data) return <h2 className="loading-text">Loading submission...</h2>;

  // runtime graph width (simple)
  const runtimeMs = parseFloat(data.runtime); // "4ms" -> 4
  const maxRuntime = 100;
  const runtimeWidth = Math.max(
    10,
    Math.min(100, ((maxRuntime - runtimeMs) / maxRuntime) * 100)
  );

  return (
    <div className={`submission-page ${isDark ? "theme-dark" : "theme-light"}`}>
      {/* TOP BAR */}
      <div className="submission-topbar">
        <h1 className={data.status === "Accepted" ? "status-badge success" : "status-badge fail"}>
          {data.status}
        </h1>

        <div className="topbar-right">
          <button
            className="history-btn"
            onClick={() => navigate("/submissions")}
          >
            View All Submissions
          </button>

          <button
            className="theme-toggle"
            onClick={() => setIsDark((prev) => !prev)}
          >
            {isDark ? "☀ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="tabs-row">
        <button
          className={activeTab === "details" ? "tab active" : "tab"}
          onClick={() => setActiveTab("details")}
        >
          Details
        </button>
        <button
          className={activeTab === "code" ? "tab active" : "tab"}
          onClick={() => setActiveTab("code")}
        >
          Code
        </button>
        <button
          className={activeTab === "output" ? "tab active" : "tab"}
          onClick={() => setActiveTab("output")}
        >
          Output
        </button>
      </div>

      {/* TAB CONTENTS */}
      {activeTab === "details" && (
        <div className="tab-content">
          <div className="stats-container">
            <div className="stat-card">
              <h4>Runtime</h4>
              <p>{data.runtime}</p>
            </div>
            <div className="stat-card">
              <h4>Memory</h4>
              <p>{data.memory}</p>
            </div>
            <div className="stat-card">
              <h4>Passed</h4>
              <p>
                {data.passed}/{data.total}
              </p>
            </div>
          </div>

          {/* Simple runtime graph */}
          <div className="runtime-graph">
            <div className="runtime-graph-header">
              <span>Runtime distribution</span>
              <span>Your runtime: {data.runtime}</span>
            </div>
            <div className="runtime-bar-bg">
              <div
                className="runtime-bar-fill"
                style={{ width: `${runtimeWidth}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "code" && (
        <div className="tab-content">
          <h2 className="code-title">Submitted Code</h2>
          <pre className="submitted-code-box">
{data.code}
          </pre>
        </div>
      )}

      {activeTab === "output" && (
        <div className="tab-content">
          <h2 className="code-title">Output Summary</h2>
          <div className="output-box">
            {data.status === "Accepted" ? (
              <p>All testcases passed successfully ✅</p>
            ) : (
              <p>
                {data.passed} out of {data.total} testcases passed.
              </p>
            )}
            <p>
              <b>Language:</b> {data.language?.toUpperCase() || "C"}
            </p>
            <p>
              <b>Submitted at:</b>{" "}
              {new Date(data.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
