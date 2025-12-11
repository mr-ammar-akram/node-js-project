import { useEffect, useState } from "react";
export default function Header() {
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
    <header className="header bg-dark text-white p-3 d-flex justify-content-between">
      <h4 className="mb-0">Admin Panel</h4>
      <div className="userAction"><div><p>{message}</p></div>
      <div><button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
        style={{
          padding: "10px",
          background: "red",
          color: "white",
          borderRadius: "5px",
          border: "none",
        }}
      >
        Logout
      </button></div></div>
    </header>
  );
}
