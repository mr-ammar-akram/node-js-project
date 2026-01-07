import React, {useEffect, useState } from "react";
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

export default function AddPost() {
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
    featuredImage: "",
  });
const [preview, setPreview] = useState(null);
const [personName, setPersonName] = React.useState([]);



  const handleSelectChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
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
    const token = localStorage.getItem("token");
    const ptitle = formData.title;
    let slug = ptitle.replace(/\W+/g, '-');
    slug = slug.toLowerCase();
    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("slug", slug);
    payload.append("postCat", formData.postCat);
    payload.append("description", formData.description);
    if(formData.featuredImage){
         payload.append("featuredImage", formData.featuredImage);
    }
    const res = await fetch("http://localhost:5000/posts/add", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: payload
    });
    const data = await res.json();
    if (res.ok) {
        alert("Post Added Successfully.....");
        setFormData({ title: "", description: "", featuredImage: null});
        navigate("/dashboard");
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
          {/* Select Category */}
            <FormControl sx={{ m: 1 }}>
                <InputLabel id="demo-multiple-checkbox-label">Categories</InputLabel>
                <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={personName}
                onChange={handleSelectChange}
                input={<OutlinedInput label="Categories" />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
                >
                {postCategories.map((category) => (
                    <MenuItem key={category.categoryName} value={category.categoryName}>
                    <Checkbox checked={personName.includes(category.categoryName)} />
                    <ListItemText primary={category.categoryName} />
                    </MenuItem>
                ))}
                </Select>
            </FormControl>

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