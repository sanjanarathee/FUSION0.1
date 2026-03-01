import React from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("fusionUser"));

  if (!userData) {
    return (
      <div style={styles.center}>
        <h2>Please login first</h2>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.avatar}>
          {userData.name.charAt(0).toUpperCase()}
        </div>

        <h2 style={styles.title}>My Profile</h2>

        <div style={styles.info}>
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>

          {userData.role === "student" ? (
            <p><strong>Roll Number:</strong> {userData.extraField}</p>
          ) : (
            <p><strong>Teacher ID:</strong> {userData.extraField}</p>
          )}

          <p><strong>Role:</strong> {userData.role}</p>
        </div>

        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          ⬅ Back
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "80px", // header ke niche
    color: "white",
  },
  card: {
    background: "rgba(255,255,255,0.08)",
    padding: "40px",
    borderRadius: "16px",
    width: "380px",
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
  },
  avatar: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6a5cff, #00e0ff)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "36px",
    fontWeight: "bold",
    margin: "0 auto 20px",
  },
  title: {
    marginBottom: "20px",
  },
  info: {
    textAlign: "left",
    lineHeight: "1.8",
    marginBottom: "30px",
  },
  backBtn: {
    padding: "10px 18px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    background: "#3b82f6",
    color: "white",
    fontWeight: "bold",
  },
  center: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};
