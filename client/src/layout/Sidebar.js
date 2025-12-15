import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar bg-light p-3" style={{ minHeight: "100vh", width: "250px" }}>
      <h5 className="mb-4">Menu</h5>

      <ul className="list-unstyled">
        <li className="mb-3">
          <NavLink  to="/dashboard"
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>Dashboard</NavLink>
        </li>
      </ul>
    </aside>
  );
}
