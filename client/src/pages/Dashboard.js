import React, { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

import "./Dashboard.css";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "User",
    address: "",
    information: "",
    phone: "",
    profilImage: "" // URL or base64
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [page, setPage] = React.useState(1);
  const [postPage, setPostPage] = React.useState(1);
  const usersPerPage = 5;
  const POSTS_PER_PAGE = 6;
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const totalPages = Math.ceil(users.length / usersPerPage);
  const totalPostPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  const paginatedPosts = posts.slice(
    (postPage - 1) * POSTS_PER_PAGE,
    postPage * POSTS_PER_PAGE
  );
  const startIndex = (page - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const paginatedUsers = users.slice(startIndex, endIndex);

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const usersRes = await fetch("http://localhost:5000/users/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!usersRes.ok) throw new Error("Unauthorized");
      const usersData = await usersRes.json();
      setUsers(usersData);

      const postsRes = await fetch("http://localhost:5000/posts/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!postsRes.ok) throw new Error("Unauthorized");
      const postsData = await postsRes.json();
      setPosts(postsData);
    } catch (err) {
      console.log(err);
      window.location.href = "/login"; 
    }
  };

useEffect(() => {
  const fetchUsers = async () => {
    try {
      const usersRes = await fetch("http://localhost:5000/users/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!usersRes.ok) throw new Error("Unauthorized");
      const usersData = await usersRes.json();
      setUsers(usersData);

      const postsRes = await fetch("http://localhost:5000/posts/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!postsRes.ok) throw new Error("Unauthorized");
      const postsData = await postsRes.json();
      setPosts(postsData);
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
     const { name, value, files } = e.target;
    
  if (files) {
    const file = files[0];
    setFormData(prev => ({ ...prev, [name]: file }));
    setPreview(URL.createObjectURL(file)); // ✅ preview
  } else {
      setFormData(prev => ({ ...prev, [name]: value }));
  }
  };
  const handleView = (user) => {
    window.location.href = `/author?username=${user.username}`;
  }
  const handleEditPost = (postId) => {
    window.location.href = `/editpost/?id=${postId}`;
  }
  const handleEdit = (user) => {
    const proImage = (<img
                      src={`http://localhost:5000${user.profilImage}`}
                      alt="Profile"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        objectFit: "cover"
                      }}
                    />);
    
    setFormData({
      username: user.username,
      email: user.email || "",
      password: "",
      role: user.role,
      address: user.address,
      information: user.information,
      phone: user.phone,
      profilImage: proImage ? proImage : (<span>--</span>)
    });

    setEditId(user._id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm(`Delete this ${id}?`)) return;
  
    try {
      const res = await fetch(
        `http://localhost:5000/posts/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        fetchUsers(); // refresh table
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      console.log(err);
    }
  }
  const handleDelete = async (id, role) => {
    if (!window.confirm(`Delete this ${role}?`)) return;

    try {
      const res = await fetch(
        `http://localhost:5000/users/delete/${id}?role=${role}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        fetchUsers(); // refresh table
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getLoggedInAdminId = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id;
  } catch {
    return null;
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formPayload = new FormData();
      for (let key in formData) {
        if (formData[key]) formPayload.append(key, formData[key]);
      }
      let url = "http://localhost:5000/users/add";
      let method = "POST";

      if (editId) {
        url = `http://localhost:5000/users/update/${editId}`;
        method = "PUT";
      }
      console.log(formData);
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formPayload,
      });

      const data = await res.json();
      if (res.ok) {
        alert(`${formData.role} ${editId ? "updated" : "added"} successfully!`);
        setFormData({
          username: "",
          email: "",
          password: "",
          role: "User",
          address: "",
          information: "",
          phone: "",
          profilImage: null,
        });
        setShowForm(false);
        setEditId(null);
        fetchUsers();
      } else {
        alert(data.message || "Error");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const loggedInAdminId = getLoggedInAdminId();

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

              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />

              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />

              <label>Information</label>
              <textarea
                name="information"
                value={formData.information}
                onChange={handleChange}
              />

              <label className="file-upload">
              <input
                type="file"
                name="profilImage"
                accept="image/*"
                onChange={handleChange}
              />
              <span>Profile Picture</span>
              </label>
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    marginTop: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc"
                  }}
                />
              )}
          <button type="submit" className="btn btn-submit">
            {isEditing ? "Update" : "Add"} {formData.role}
          </button>
        </form>
      )}

      <table className="users-table">
        <thead>
          <tr>
            <th>Profile</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            paginatedUsers.map((u) => (
              <tr key={u._id}>
                <td>
                  {u.profilImage ? (
                    <img
                      src={`http://localhost:5000${u.profilImage}`}
                      alt="Profile"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        objectFit: "cover"
                      }}
                    />
                  ) : (
                    <span>—</span>
                  )}
                </td>
                <td>{u.username}</td>
                <td>{u.email || "-"}</td>
                <td>{u.role}</td>
                <td>{u.address || "-?"}</td>
                <td>{u.phone || "-?"}</td>
                <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}</td>
                <td>
                  { <button
                      className="btn btn-view"
                      onClick={() => handleView(u)}
                    >
                      View
                    </button>
                  }
                  { <button
                      className="btn btn-edit"
                      onClick={() => handleEdit(u)}
                    >
                      Edit
                    </button>
                  }
                  {!(u.role === "Admin" && u._id === loggedInAdminId) && (
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(u._id, u.role)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
        <>
        {totalPages > 1 && (
            <Stack spacing={2} alignItems="center" mt={3}>
            <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
            />
            </Stack>
        )}
        </>

    <div>
      <div className="dashboard-post-section">
        <h2>All Posts</h2>
      </div>
      <div className="posts-grid">
          {paginatedPosts.map((post) => (
            <div className="post-card" key={post._id}>
              {/* Featured Image */}
              {post.featuredImage && (
                <div className="post-image">
                  <img
                    src={`http://localhost:5000${post.featuredImage}`}
                    alt={post.title}
                  />
                </div>
              )}

              {/* Content */}
              <div className="post-content">
                <h3 className="post-title">{post.title}</h3>

                {post.description && (
                  <p className="post-desc">
                    {post.description.length > 120
                      ? post.description.slice(0, 120) + "..."
                      : post.description}
                  </p>
                )}

                <div className="post-meta">
                  <span>
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString()
                      : "—"}
                  </span>
                  <span className="post-btns">
                    <button className="btn btn-view">View</button>
                    <button className="btn btn-delete"
                     onClick={() => handleDeletePost(post._id)}
                    >Delete</button>
                    <button className="btn btn-edit"
                     onClick={() => handleEditPost(post._id)}
                    >Edit</button>
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      {/* PAGINATION */}
      {totalPostPages > 1 && (
        <Stack spacing={2} alignItems="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPostPage(value)}
            color="primary"
          />
        </Stack>
      )}
        </div>
    </div>
  );
}
