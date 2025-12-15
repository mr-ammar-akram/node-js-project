// import "./auth.css";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Register</h2>

        <input className="auth-input" placeholder="Username" />
        <input className="auth-input" type="password" placeholder="Password" />

        <button className="auth-btn auth-btn-secondary">Register</button>

        <span
          className="auth-link"
          onClick={() => navigate("/login")}
        >
          Already registered? Login
        </span>
      </div>
    </div>
  );
}
