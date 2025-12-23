import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const [openUser, setOpenUser] = useState(false);
  const [openPost, setOpenPost] = useState(false);

  return (
    <aside
      className="sidebar bg-light p-3"
      style={{ minHeight: "100vh", width: "250px" }}
    >
      <h5 className="mb-4">Menu</h5>

      <ul className="list-unstyled">

        {/* Dashboard */}
        <li className="mb-3">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            Dashboard
          </NavLink>
        </li>

        {/* Users Parent Tab */}
        <li className="mb-2">
          <div
            className="sidebar-link"
            style={{ cursor: "pointer" }}
            onClick={() => setOpenUser(!openUser)}
          >
            Users
          </div>

          {/* Sub Menu */}
          {openUser && (
            <ul className="list-unstyled ps-3 mt-2">
            <li className="submenu-item">
              <NavLink
                to="/users"
                end
                className={({ isActive }) =>
                  isActive ? "sidebar-link active" : "sidebar-link"
                }
              >
                All Users
              </NavLink>
            </li>

            <li className="submenu-item">
              <NavLink
                to="/users/add"
                className={({ isActive }) =>
                  isActive ? "sidebar-link active" : "sidebar-link"
                }
              >
                Add New User
              </NavLink>
            </li>

            </ul>
          )}
        </li>

        {/* Users Parent Tab */}
        <li className="mb-2">
          <div
            className="sidebar-link"
            style={{ cursor: "pointer" }}
            onClick={() => setOpenPost(!openPost)}
          >
            Posts
          </div>

          {/* Sub Menu */}
          {openPost && (
            <ul className="list-unstyled ps-3 mt-2">
            <li className="submenu-item">
              <NavLink
                to="/posts"
                end
                className={({ isActive }) =>
                  isActive ? "sidebar-link active" : "sidebar-link"
                }
              >
                All Posts
              </NavLink>
            </li>
            <li className="submenu-item">
              <NavLink
                to="/posts/add"
                end
                className={({ isActive }) =>
                  isActive ? "sidebar-link active" : "sidebar-link"
                }
              >
                Add New Post
              </NavLink>
            </li>
            </ul>
          )}
        </li>
      </ul>
    </aside>
  );
}
