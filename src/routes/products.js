const { Router } = require("express");

const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../controllers/products");

const {
	getProducts,
	getProductById,
	createProduct,
  updateProduct,
	deleteProduct
} = require("../controllers/products");

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
