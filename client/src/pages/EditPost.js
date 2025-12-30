import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddPost.css";

export default function EditPost() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    featuredImage: null,
  });

  const [preview, setPreview] = useState(null);
  const token = localStorage.getItem("token");

  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const postId = params.get("id");
  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:5000/posts/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        const ptitle = data.post.title;
        let slug = ptitle.replace(/\W+/g, '-');
        slug = slug.toLowerCase();
        setFormData({
          title: data.post.title,
          slug: slug || '',
          description: data.post.description,
          featuredImage: `${data.post.featuredImage}`,
        });
        setPreview(`${data.post.featuredImage}`); // image URL from backend
      } catch (err) {
        console.error(err);
      }
    };

    fetchPost();
  }, [token, postId]);

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
    const formPayload = new FormData();
    for (let key in formData) {
        formPayload.append(key, formData[key]);
    }
    const res = await fetch(`http://localhost:5000/posts/update/${postId}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formPayload,
    });
    const data = await res.json();

    if (res.ok) {
      alert("Post Updated Successfully");
      navigate("/dashboard");
    } else {
      alert(data.message || "Update failed");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="form-card">
        <h2>Edit Post</h2>
        <p className="subtitle">Update your post</p>

        <form onSubmit={handleSubmit} className="add-form">
          {/* TITLE */}
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
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
              required
            />
          </div>

          {/* FEATURED IMAGE */}
          <div className="form-group">
            <label>Featured Image</label>

            <input
              type="file"
              name="featuredImage"
              accept="image/*"
              onChange={handleChange}
            />

            {preview && (
              <img
                src={preview}
                alt="Preview"
                style={{
                  width: "100%",
                  marginTop: "10px",
                  borderRadius: "8px",
                }}
              />
            )}
          </div>

          <button type="submit" className="btn-submit">
            Update Post
          </button>
        </form>
      </div>
    </div>
  );
}
