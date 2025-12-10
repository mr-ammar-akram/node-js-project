import { useEffect, useState } from "react";

export default function Dashboard() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.message) {
        setMessage(data.message);
      } else {
        setMessage("Unauthorized");
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>{message}</h2>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
        style={{
          marginTop: "20px",
          padding: "10px",
          background: "red",
          color: "white",
          borderRadius: "5px",
          border: "none",
        }}
      >
        Logout
      </button>
    </div>
  );
}
