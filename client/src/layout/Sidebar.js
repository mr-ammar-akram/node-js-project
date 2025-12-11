import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar bg-light p-3" style={{ minHeight: "100vh", width: "250px" }}>
      <h5 className="mb-4">Menu</h5>

      <ul className="list-unstyled">
        <li className="mb-3">
          <Link to="/dashboard" className="text-dark">Dashboard</Link>
        </li>
        <li className="mb-3">
          <Link to="/users" className="text-dark">Users</Link>
        </li>

        <li className="mb-3">
          <Link to="/settings" className="text-dark">Settings</Link>
        </li>
      </ul>
    </aside>
  );
}
