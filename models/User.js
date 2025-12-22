const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: {type: String, required: true, unique: true } ,
  role: {type: String, required: true},
  information: {type: String},
  phone: {type: String},
  address: {type: String},
  profilImage: {type: String},
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", userSchema);
