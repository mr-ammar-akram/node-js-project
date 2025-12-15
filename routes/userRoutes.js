const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/authMiddleware");


// Add user or admin
router.post("/add", auth, async (req, res) => {
  try {
    const { role, username, email, password } = req.body;

    if (role === "Admin") {
      if (!username || !password || !email) return res.status(400).json({ message: "Username and password required" });
      const existingAdmin = await Admin.findOne({ username });
      if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = new Admin({ username, email , password: hashedPassword });
      await admin.save();
      return res.json({ message: "Admin added successfully" });
    } else {
      if (!username || !email) return res.status(400).json({ message: "Username and email required" });
      const existingUser = await User.findOne({ username });
      if (existingUser) return res.status(400).json({ message: "User already exists" });

      const user = new User({ username, email });
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
    console.log(allUsers);
    // sort by createdAt descending (Admin doesn’t have createdAt, so optional)
    allUsers.sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()));

    res.json(allUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
