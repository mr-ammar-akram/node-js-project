const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },  // add email field
  password: { type: String, required: true }
}, { timestamps: true }); // add timestamps to track createdAt

module.exports = mongoose.model("Admin", adminSchema);
