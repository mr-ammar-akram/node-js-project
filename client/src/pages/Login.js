import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        username,
        password
      });

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard"); // Redirect to dashboard
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (<div className="auth-container">
  <div className="auth-card">

    <div className="auth-header">
      <h2>Welcome Back</h2>
      <p>Login to your account</p>
    </div>

    <div className="auth-form">
      <input
        className="auth-input"
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        className="auth-input"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin} className="auth-btn">
        Login
      </button>
    </div>

    <div className="auth-footer">
      <span
        className="auth-link"
        onClick={() => navigate("/register")}
      >
        Don’t have an account? <strong>Create one</strong>
      </span>
    </div>

  </div>
</div>
  );
}
