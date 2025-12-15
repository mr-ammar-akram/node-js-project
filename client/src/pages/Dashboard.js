import React, { useEffect, useState } from "react";
import "./Dashboard.css";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "User"
  });

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/users/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.log(err);
      window.location.href = "/login";
    }
  };

useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/users/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.log(err);
      window.location.href = "/login"; 
    }
  };

  fetchUsers();
}, [token]); // include token because it's used inside

  // useEffect(() => {
  //   fetchUsers();
  // }, [token]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/users/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        alert(`${formData.role} added successfully!`);
        setFormData({ username: "", email: "", password: "", role: "User" });
        setShowForm(false);
        fetchUsers();
      } else {
        alert(data.message || "Error adding user");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>All Users</h2>
        <button className="btn btn-add" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add User/Admin"}
        </button>
      </div>

      {showForm && (
        <form className="add-form" onSubmit={handleSubmit}>
          <label>Role</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>

          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          {/* Email input for both User and Admin */}
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* Password only for Admin */}
          {formData.role === "Admin" && (
            <>
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </>
          )}

          <button type="submit" className="btn btn-submit">
            Add {formData.role}
          </button>
        </form>
      )}

      <table className="users-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map(u => (
              <tr key={u._id}>
                <td>{u.username}</td>
                <td>{u.email || "-"}</td>
                <td>{u.role}</td>
                <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
