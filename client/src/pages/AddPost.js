import React, { useState } from "react";
import "./AddPost.css";

export default function AddUser() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    featuredimage: "",
  });
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const {name, value, files} = e.target;

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
    const token = localStorage.getItem("token");
    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    if(formData.featuredimage){
         payload.append("featuredImage", formData.featuredimage);
    }
    const res = await fetch("http://localhost:5000/posts/add", {
        method: "POST",
        header: {
            Authorization: `Bearer ${token}`
        },
        body: payload
    });
    const data = await res.json();
    if (res.ok) {
        alert("Post Added Successfully.....");
        setFormData({ title: "", description: "", featuredimage: null});
    }else{
        alert(data.message);
    }
  }

    return(
    <div className="dashboard-container">
      <div className="form-card">
        <h2>Add New Post</h2>
        <p className="subtitle">Create and publish a new post</p>

        <form onSubmit={handleSubmit} className="add-form">

          {/* TITLE */}
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              placeholder="Write post description..."
              required
            />
          </div>

          {/* FEATURED IMAGE */}
          <div className="form-group">
            <label>Featured Image</label>

            <label className="file-upload">
              <input
                type="file"
                name="featuredImage"
                accept="image/*"
                onChange={handleChange}
              />
              <span>Upload Image</span>
            </label>

        {preview && (
          <img
            src={preview}
            alt="Preview"
            style={{
              objectFit: "cover",
              marginTop: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc"
            }}
          />
        )}
          </div>

          {/* ACTION */}
          <button type="submit" className="btn-submit">
            Publish Post
          </button>
        </form>
      </div>
    </div>
    );
}