import { Link } from "react-router-dom";
import "../styles/home.css";

export default function Home() {
  return (
    <div className="home-page">

      {/* HEADER */}
      <div className="home-header">
        <span>🎓 FUSION</span>
        <span className="header-right">Welcome 🚀</span>
      </div>

      {/* MAIN CARD */}
      <div className="home-card">

        {/* LEFT SIDE */}
        <div className="home-left">
          <h2>Welcome to</h2>
          <h1>FUSION</h1>
          {/* <div className="underline"></div> */}

          <p>
            The all-in-one platform to manage courses, assignments,
            students and coding evaluations.
          </p>

          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
            alt="fusion"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="home-right">
          <h2>Get Started</h2>
          <p>Choose what you want to do</p>

          <Link to="/login" className="home-option">
            <span>🔐 Login</span>
            <span>→</span>
          </Link>

          <Link to="/register" className="home-option">
            <span>📝 Register</span>
            <span>→</span>
          </Link>
        </div>

      </div>
    </div>
  );
}