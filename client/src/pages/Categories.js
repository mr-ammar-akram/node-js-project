import React, { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import "./Categories.css";

export default function Categories() {
  const [postCategories, setPostCategories] = useState([]);
  const [formData, setFormData] = useState({
    categoryName: "",
    description: "",
    categoryImage: null,
  });
  const [preview, setPreview] = useState(null);
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);

  const categoriesPerPage = 10;
  const token = localStorage.getItem("token");

  /* ================= FETCH CATEGORIES ================= */

    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/posts/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }

        const data = await res.json();
        setPostCategories(data);
      } catch (err) {
        console.error(err);
      }
    };
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/posts/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }

        const data = await res.json();
        setPostCategories(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, [token]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(postCategories.length / categoriesPerPage);
  const startIndex = (page - 1) * categoriesPerPage;
  const paginatedCategories = postCategories.slice(
    startIndex,
    startIndex + categoriesPerPage
  );

  const handlePageChange = (_, value) => setPage(value);

  /* ================= FORM HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    const catitle = formData.categoryName;
    let slug = catitle.replace(/\W+/g, '-');
    slug = slug.toLowerCase();
    payload.append("categoryName", formData.categoryName);
    payload.append("description", formData.description);
    payload.append("catSlug", slug);
    if (formData.categoryImage) {
      payload.append("categoryImage", formData.categoryImage);
    }

    try {
        let url = "http://localhost:5000/posts/categories/add";
        if(editId){
            url = `http://localhost:5000/posts/categories/update/${editId}`;
        }

      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed");
        return;
      }

      setPostCategories((prev) => [data.category, ...prev]);
      setFormData({ categoryName: "", description: "", categoryImage: null });
      alert(`Category ${editId ? "updated" : "added"} successfully`);
      setPreview(null);
      setEditId(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async (editCategory) => {
    setFormData({
        categoryName: editCategory.categoryName,
        description: editCategory.description,
        catSlug: editCategory.catSlug,
        categoryImage: editCategory.categoryImage,
    });
    setPreview(`http://localhost:3000/${editCategory.categoryImage}`);
    setEditId(editCategory._id);
  }
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete this ${name}?`)) return;

    try {
      const res = await fetch(
        `http://localhost:5000/posts/categories/delete/${id}`,
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
  };
  /* ================= JSX ================= */
  return (
    
    <div className="dashboard-post-section">
        <h2>All Categories</h2>
    <div className="category-parent-wrapper">
      {/* ADD CATEGORY */}
      <div className="category-form">
        <form className="add-form" onSubmit={handleSubmit}>
          <label>Category Name</label>
          <input
            type="text"
            name="categoryName"
            value={formData.categoryName}
            onChange={handleChange}
            required
          />

          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

          <label className="file-upload">
            <input
              type="file"
              name="categoryImage"
              accept="image/*"
              onChange={handleChange}
            />
            <span>Category Image</span>
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
              }}
            />
          )}

          <button type="submit" className="btn btn-submit">
            {editId ? "Update Category" : "Add Category"}
          </button>
        </form>
      </div>

      {/* TABLE */}
      <div className="category-data">
        <table className="users-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedCategories.length ? (
              paginatedCategories.map((c, index) => (
                <tr key={c._id}>
                  <td>{startIndex + index + 1}</td>
                  <td>
                    {c.categoryImage ? (
                      <img
                        src={`http://localhost:5000${c.categoryImage}`}
                        alt=""
                        width="40"
                        height="40"
                        style={{ borderRadius: "50%" }}
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <Link to={`/categories/${c.catSlug}`}>
                        {c.categoryName}   
                    </Link>
                  </td>
                  <td>{c.description || "-"}</td>
                  <td>
                    <button className="btn btn-edit"
                    onClick={() => handleEdit(c)}
                    >Edit</button>
                    <button className="btn btn-delete"
                    onClick={() => handleDelete(c._id, c.categoryName)}
                    >Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" align="center">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <Stack alignItems="center" mt={3}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
            />
          </Stack>
        )}
      </div>
    </div>
</div>
  );
}
