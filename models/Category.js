const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    categoryName: { type: String, required: true },
    catSlug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    categoryImage: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
