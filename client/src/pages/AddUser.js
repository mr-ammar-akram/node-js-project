import React, { useState } from "react";

export default function AddUser() {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    role: "User",
    username: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    information: "",
    profilImage: null
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formPayload = new FormData();
      for (let key in formData) {
        if (formData[key]) {
          formPayload.append(key, formData[key]);
        }
      }

      const res = await fetch("http://localhost:5000/users/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formPayload,
      });

      const data = await res.json();

      if (res.ok) {
        alert(`${formData.role} added successfully!`);
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Add New User</h2>
      </div>

      <form className="add-form" onSubmit={handleSubmit} encType="multipart/form-data">

        <label>Role</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>

        <label>Username</label>
        <input type="text" name="username" onChange={handleChange} required />

        <label>Email</label>
        <input type="email" name="email" onChange={handleChange} required />

        {formData.role === "Admin" && (
          <>
            <label>Password</label>
            <input type="password" name="password" onChange={handleChange} required />
          </>
        )}

        <label>Address</label>
        <input type="text" name="address" onChange={handleChange} />

        <label>Phone</label>
        <input type="text" name="phone" onChange={handleChange} />

        <label>Information</label>
        <textarea name="information" onChange={handleChange} />

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
          Add User
        </button>
      </form>
    </div>
  );
}
