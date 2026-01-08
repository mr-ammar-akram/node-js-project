import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import "./SingleCategory.css";

const SingleCategory = () => {
  const { slug } = useParams();
  const [posts, setPost] = useState([]);
  const [searchCate, setSearchedCate] = useState([]);
  const [error, setError] = useState("");
    const POSTS_PER_PAGE = 12;
    const [page, setPage] = useState(1);
  
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  
    const paginatedPosts = posts.slice(
      (page - 1) * POSTS_PER_PAGE,
      page * POSTS_PER_PAGE
    );
  const token = localStorage.getItem("token");

  const fetchCategories = async () => {
    try {
      const res = await fetch(`http://localhost:5000/posts/categories/category/${slug}`);

      if (!res.ok) {
        throw new Error("Post not found");
      }
      const data = await res.json();
      setPost(data.posts);
      setSearchedCate(data.searchCate);
    } catch (err) {
      setError(err.message);
    }
  };

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await fetch(`http://localhost:5000/posts/categories/${slug}`);

      if (!res.ok) {
        throw new Error("Post not found");
      }
      const data = await res.json();
      setPost(data.posts);
      setSearchedCate(data.searchCate);
    } catch (err) {
      setError(err.message);
    }
  };

  fetchCategories();
}, [slug]);


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
        fetchCategories(); // refresh table
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleEditPost = (postId) => {
    window.location.href = `/editpost/?id=${postId}`;
  }

  if (error) return <p>{error}</p>;
  if (!posts) return <p>Loading...</p>;

  return (
<div className="dashboard-container">
      <div className="dashboard-post-section">
        <h2>{searchCate}</h2>
      </div>
      <div className="posts-grid">
          {paginatedPosts.map((post) => (
            <div className="post-card" key={post._id}>
              {/* Featured Image */}
              {post.featuredImage && (
                <div className="post-image">
                  <img
                    src={post.featuredImage.includes("http://") ? post.featuredImage :`http://localhost:5000${post.featuredImage}`}
                    alt={post.title}
                  />
                </div>
              )}

              {/* Content */}
              <div className="post-content">
                <div className="post-categories">
                  {post.postCat &&
                    post.postCat.map((cat, index) => (
                        <Link  key={index} to={`/categories/${cat.trim().toLowerCase()}`}>
                            <span className={`category-item`}>
                                {cat.trim()}
                            </span>
                        </Link>
                    ))
                  }
                </div>
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
                  <span className="post-btns">
                    <Link to={`/posts/${post.slug}`} className="btn btn-view">
                      View
                    </Link>
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
};

export default SingleCategory;
