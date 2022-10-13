const { Router } = require("express");
const { getProducts, getProductById, createProduct, updateProduct } = require("../controllers/products");

const router = Router();

router.get("/", getProducts);

router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);

module.exports = router;
