import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";
    } else {
      alert(data.message || "Login failed");
    }
  };

  return (
    <div style={{
      maxWidth: "350px",
      margin: "50px auto",
      border: "1px solid #ddd",
      padding: "20px",
      borderRadius: "10px"
    }}>
      <h2 style={{ textAlign: "center" }}>Admin Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button type="submit" style={btnStyle}>Login</button>
      </form>
      <a href="/register" style={{ marginTop: '10px', display: 'block' }}>
        Create new admin?
      </a>

    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "10px",
  borderRadius: "5px",
  border: "1px solid #bbb"
};

const btnStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "15px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};
