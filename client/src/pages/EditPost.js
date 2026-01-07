import React, { useEffect, useState } from "react";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { useNavigate } from "react-router-dom";
import "./AddPost.css";



const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function EditPost() {
  const [postCategories, setPostCategories] = useState([]);

    const token = localStorage.getItem("token");
        /* ================= FETCH CATEGORIES ================= */
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
  
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    postCat: "",
    description: "",
    featuredImage: null,
  });
const [categoryName, setCategoryName] = React.useState([]);

  const [preview, setPreview] = useState(null);

  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const postId = params.get("id");
  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:5000/posts/editpost/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        const ptitle = data.post.title;
        let slug = ptitle.replace(/\W+/g, '-');
        slug = slug.toLowerCase();
        if(data.postCat){
            setCategoryName(data.postCat);
        }
        setFormData({
          title: data.post.title,
          slug: slug || '',
          postCate: data.postCat,
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

  const handleSelectChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormData(
      (prev) => ({
        ...prev,
        postCat: typeof value === 'string' ? value.split(',') : value,
      })
    );
    setCategoryName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
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
    console.log(formData);
    alert('testing');
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

          {/* Select Category */}
            <FormControl sx={{ m: 1 }}>
                <InputLabel id="demo-multiple-checkbox-label">Categories</InputLabel>
                <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={categoryName}
                onChange={handleSelectChange}
                input={<OutlinedInput label="Categories" />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
                >
                {postCategories.map((category) => (
                    <MenuItem key={category.categoryName} value={category.categoryName}>
                    <Checkbox checked={categoryName.includes(category.categoryName)} />
                    <ListItemText primary={category.categoryName} />
                    </MenuItem>
                ))}
                </Select>
            </FormControl>

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
