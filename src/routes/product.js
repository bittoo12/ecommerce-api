const express = require("express");
const multer = require("multer");
const Product = require("../models/Product");
const auth = require("../middleware/auth"); // Auth middleware

const router = express.Router();

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// 🟢 Create a Product (Admin only)
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const product = new Product({ name, description, price, category, stock, image });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔵 Get All Products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🟡 Get a Single Product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🟠 Update Product (Admin only)
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { name, description, price, category, stock }, { new: true });

    if (!updatedProduct) return res.status(404).json({ msg: "Product not found" });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔴 Delete a Product (Admin only)
router.delete("/:id", auth, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ msg: "Product not found" });
    res.json({ msg: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
