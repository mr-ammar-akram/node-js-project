import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>

        <input className="auth-input" onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <input className="auth-input" onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />

        <button onClick={handleLogin} className="auth-btn">Login</button>

        <span
          className="auth-link"
          onClick={() => navigate("/register")}
        >
          Not registered? Create account
        </span>
      </div>
    </div>
  );
}
