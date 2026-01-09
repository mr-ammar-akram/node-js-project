const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const Category = require('../models/Category');

// Add Post Admin only

router.post(
    "/add",
    auth,
    upload.single("featuredImage"),
    async (req, res) =>{
        try{
            const { title, slug, postCat, description } = req.body;
            if(!title || !description){
                return res.status(400).json({message: "Title and Description required.."});
            }

            const post = new Post({
                title,
                description,
                slug,
                postCat: postCat.split(","),
                featuredImage: req.file
                ? `/uploads/posts/${req.file.filename}`
                : null,
                author: req.admin.id
            });
            await post.save();
            res.json({
                message: "Post added Successfully",
                post
            });
        }
            catch (err){
                res.status(500).json({message: err.message});
            }
    }
);

// Get all posts
router.get(
  "/all",
  auth,
  async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: -1 });
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Delete Post by ID
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
      const post = await Post.findByIdAndDelete(id);
      if (!post) return res.status(404).json({ message: "Post not found" });
      return res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Post by ID
router.get("/editpost/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
      const post = await Post.findById(id);
      if (!post) return res.status(404).json({ message: "Post not found" });
      return res.json({post});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Post by title
// router.get("/:slug", async (req, res) => {
//   try {
//     const { slug } = req.params;
//       const post = await Post.findOne({slug});
//       if (!post) return res.status(404).json({ message: "Post not found" });
//       return res.json({post});
//   } catch (err) {
//     console.log(req);
//     res.status(500).json({ message: err.message });
//   }
// });



// Update Post by ID
router.put("/update/:id", auth, upload.single('featuredImage'), async (req, res) => {
  try {
    const { id } = req.params;
    const {title, slug, postCat, description, featuredImage} = req.body;
    const fImageUrl = featuredImage;
    const updateData = {
        title,
        slug,
        postCat: postCat.split(","),
        description,
        featuredImage: req.file
                ? `/uploads/posts/${req.file.filename}`
                : fImageUrl,
    };
    const post = await Post.findByIdAndUpdate(id, updateData, { new: true });   
    if (!post) return res.status(404).json({ message: "Post not found" });
    return res.json({ message: "Post Updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Get all categories
router.get(
  "/categories",
  auth,
  async (req, res) => {
    try {
      const categories = await Category.find().sort({ createdAt: -1 });
      res.status(200).json(categories);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Add Post Category Admin only
router.post(
    "/categories/add",
    auth,
    upload.single("categoryImage"),
    async (req, res) =>{
        try{
            const { categoryName, catSlug, description } = req.body;
            if(!categoryName || !description){
                return res.status(400).json({message: "Category Name and Description required.."});
            }
            const category = new Category({
                categoryName,
                description,
                catSlug,
                categoryImage: req.file
                ? `/uploads/posts/${req.file.filename}`
                : null,
                author: req.admin.id
            });
            await category.save();
            res.json({
                message: "Post added Successfully",
                category
            });
        }
            catch (err){
                res.status(500).json({message: err.message});
            }
    });

// Update Post Category Admin only
router.post(
    "/categories/update/:id",
    auth,
    upload.single("categoryImage"),
    async (req, res) =>{
        try{
        const { id } = req.params;
        const { categoryName, catSlug, description, categoryImage } = req.body;
        const fImageUrl = categoryImage;
        const updateData = {
            categoryName,
            catSlug,
            description,
            categoryImage: req.file
                ? `/uploads/posts/${req.file.filename}`
                : fImageUrl,
        };
        const category = await Category.findByIdAndUpdate(id, updateData, { new: true });   
        if (!category) return res.status(404).json({ message: "Category not found" });
            res.json({
                message: "Post added Successfully",
                category
            });
        }
        catch(err){
            res.status(500).json({ message: err.message });
        }
    })

// Delete Category by id
router.delete("/categories/delete/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
      const category = await Category.findByIdAndDelete(id);
      if (!category) return res.status(404).json({ message: "Post not found" });
      return res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// View Category
router.get(
  "/categories/:slug",
  async (req, res) => {
    try {
      const category = await Category.findOne({ catSlug: req.params.slug });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    const posts = await Post.find({ postCat: category.categoryName });
      res.json({posts, searchCate: category.categoryName });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);
router.get("/post/:slug", async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    console.error("Single post error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
