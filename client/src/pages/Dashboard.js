import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/users/all")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.log("Error:", err));
  }, []);

  return (
    <div>
      <h2 className="mb-4">All Users</h2>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>User Name</th>
            <th>Email</th>
            <th>Created</th>
          </tr>
        </thead>

        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr key={u._id}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
