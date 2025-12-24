const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    featuredImage: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
