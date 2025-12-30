import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import "./Dashboard.css";

export default function AllUsers() {
  const [posts, setPosts] = useState([]);
  const POSTS_PER_PAGE = 12;
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  const paginatedPosts = posts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );
  const token = localStorage.getItem("token");
useEffect(() => {
  const fetchUsers = async () => {
    try {
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

  return(
<div className="dashboard-container">
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
          <h3 className="post-title">
            <Link to={`/posts/${post.slug}`}>
              {post.title}
            </Link>
          </h3>

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

            <button className="btn btn-view">View</button>
          </div>
        </div>

      </div>
    ))}
  </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <Stack spacing={2} alignItems="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Stack>
      )}
</div>

  );
}