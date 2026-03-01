import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const userData = JSON.parse(localStorage.getItem("fusionUser"));

  // ❌ Don't show header if not logged in
  if (!userData) return null;

  // ❌ Don't show header on auth / public pages
  const hiddenRoutes = ["/", "/login", "/signup"];
  if (hiddenRoutes.includes(location.pathname)) return null;

  return (
    <div style={styles.header}>
      <div style={styles.profile} onClick={() => navigate("/profile")}>
        <div style={styles.avatar}>
          {userData.name?.charAt(0).toUpperCase()}
        </div>
        <span style={styles.name}>{userData.name}</span>
      </div>
    </div>
  );
}

const styles = {
  header: {
    position: "fixed",
    top: "16px",
    right: "24px",
    zIndex: 9999,
  },
  profile: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    background: "rgba(0,0,0,0.3)",
    padding: "6px 12px",
    borderRadius: "999px",
    backdropFilter: "blur(8px)",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "linear-gradient(135deg,#6a5cff,#00e0ff)",
    color: "white",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "15px",
  },
  name: {
    color: "white",
    fontSize: "14px",
    fontWeight: 500,
    whiteSpace: "nowrap",
  },
};
