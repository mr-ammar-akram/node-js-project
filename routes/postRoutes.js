const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Add Post Admin only

router.get("/:slug", async (req, res) => {
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

router.post(
    "/add",
    auth,
    upload.single("featuredImage"),
    async (req, res) =>{
        try{
            const { title, slug, description } = req.body;
            if(!title || !description){
                return res.status(400).json({message: "Title and Description required.."});
            }

            const post = new Post({
                title,
                description,
                slug,
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
router.get("/:id", auth, async (req, res) => {
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
    const {title, slug, description, featuredImage} = req.body;
    const fImageUrl = featuredImage;
    const updateData = {
        title,
        slug,
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

module.exports = router;
