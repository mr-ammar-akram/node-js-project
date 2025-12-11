import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div
      className="bg-dark text-white p-3"
      style={{ width: "250px", height: "100vh", position: "fixed" }}
    >
      <h4 className="mb-4">Admin Panel</h4>

      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/dashboard">Dashboard</Link>
        </li>

        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/register">Register Admin</Link>
        </li>

        <li className="nav-item mb-2">
          <button
            className="btn btn-danger w-100"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}
