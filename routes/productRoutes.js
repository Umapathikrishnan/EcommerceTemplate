const express = require("express");
const {
  getAllProducts,
  getProductById,
  deleteProductById,
  createProduct,
} = require("../controllers/productController");
const verifyToken = require("../middleware/auth");
const router = express.Router();

router.get("/", verifyToken, getAllProducts);
router.get("/:productsId", verifyToken, getProductById);
router.post("/", verifyToken, createProduct);
router.delete("/:productsId", verifyToken, deleteProductById);

module.exports = router;
