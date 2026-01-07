import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./SinglePost.css";

const SinglePost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

useEffect(() => {
  const fetchPost = async () => {
    try {
      const res = await fetch(`http://localhost:5000/posts/post/${slug}`);

      if (!res.ok) {
        throw new Error("Post not found");
      }

      const data = await res.json();
      setPost(data);
    } catch (err) {
      setError(err.message);
    }
  };

  fetchPost();
}, [slug]);

  if (error) return <p>{error}</p>;
  if (!post) return <p>Loading...</p>;

  return (
    <div className="single-post-container">

      {/* HEADER */}
      <div className="single-post-header">
        <h1>{post.title}</h1>

        <div className="post-actions">
          <span className="post-date">
            {post.createdAt
              ? new Date(post.createdAt).toLocaleDateString()
              : ""}
          </span>
        </div>
      </div>

      {/* FEATURED IMAGE */}
      {post.featuredImage && (
        <div className="single-post-image">
          <img
            src={`http://localhost:5000${post.featuredImage}`}
            alt={post.title}
          />
        </div>
      )}

      {/* CONTENT */}
      <div className="single-post-content">
        <p>{post.description}</p>
      </div>

    </div>
  );
};

export default SinglePost;
