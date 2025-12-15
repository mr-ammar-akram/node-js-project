const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const router = express.Router();

// Register Admin (One-time)
router.post('/register', async (req, res) => {
    console.log(req);
    try {
        const { username, password } = req.body;

        const hashedPass = await bcrypt.hash(password, 10);

        const admin = new Admin({ username, password: hashedPass });
        await admin.save();

        res.json({ message: "Admin Registered!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login Admin
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign(
            { id: admin._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Check admin exist or not
router.get("/check-admin", async (req, res) => {
  try {
    const admins = await Admin.find();

    if (admins.length === 0) {
      return res.json({ exists: false });
    }

    res.json({ exists: true });

  } catch (error) {
    res.json({ exists: false });
  }
});

module.exports = router;
