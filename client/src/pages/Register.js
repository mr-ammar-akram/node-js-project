import { useState } from "react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const registerHandler = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.message === "Admin Registered!") {
      alert("Admin Registered Successfully!");
      window.location.href = "/";
    } else {
      alert(data.error || "Registration failed");
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
      <h2 style={{ textAlign: "center" }}>Register Admin</h2>

      <form onSubmit={registerHandler}>
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

        <button type="submit" style={btnStyle}>Register</button>
      </form>
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
  backgroundColor: "green",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};
