const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// Update user or admin by ID
router.put("/update/:id", auth, upload.single("profilImage"), async (req, res) => {
  try {
    const { id } = req.params;
    const { role, username, email, address, phone, information, password, profilImage } = req.body;
   if (role === "Admin") {
    const updateData = {
      username,
      email,
      role,
      address,
      information,
      phone,
      profilImage: req.file ? `/uploads/${req.file.filename}` : null

    };
    if (password) updateData.password = await bcrypt.hash(password, 10);
    console.log(updateData);
    const admin = await Admin.findByIdAndUpdate(id, updateData, { new: true });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    return res.json({ message: "Admin updated successfully" });
  }
    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated successfully" });
    if (role === "Admin" && req.admin.id !== id) {
      return res.status(403).json({ message: "Cannot edit other admins" });
    }
  }
  catch (err){
    res.status(500).json({ message: err.message });
  }
});

// Delete user or admin by ID
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.query; // role comes from frontend
    if (role === "Admin") {
      const admin = await Admin.findByIdAndDelete(id);
      if (!admin) return res.status(404).json({ message: "Admin not found" });
      return res.json({ message: "Admin deleted successfully" });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  } 
});

// Add user or admin
router.post("/add", auth, upload.single("profilImage"), async (req, res) => {
  try {
    const { role, username, email, phone, address, information, password, profilImage } = req.body;

   if (role === "Admin") {
    if (!username || !password || !email) 
        return res.status(400).json({ message: "Username, email, and password required" });

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({ 
      username,
      email,
      information: req.body.information,
      password: hashedPassword,
      role: req.body.role,
      address: req.body.address,
      phone: req.body.phone,
      profilImage: req.file ? `/uploads/${req.file.filename}` : null  // store URL or base64 string
    });

    await admin.save();
    return res.json({ message: "Admin added successfully" });
  }
  else {
      if (!username || !email) return res.status(400).json({ message: "Username and email required" });
      const existingUser = await User.findOne({ username });
      if (existingUser) return res.status(400).json({ message: "User already exists" });

      const user = new User({ username, email, role, information, phone, address, profilImage });
      await user.save();
      return res.json({ message: "User added successfully" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/all", auth, async (req, res) => {
  try {
    const users = await User.find();
    const admins = await Admin.find();

    const allUsers = [
      ...admins.map(a => ({ ...a._doc, role: "Admin" })),
      ...users.map(u => ({ ...u._doc, role: "User" }))
    ];
    // sort by createdAt descending (Admin doesn’t have createdAt, so optional)
    allUsers.sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()));

    res.json(allUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
