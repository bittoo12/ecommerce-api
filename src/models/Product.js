const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String }, // Image URL
  stock: { type: Number, default: 1 },
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);
