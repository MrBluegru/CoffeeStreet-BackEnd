const { Router } = require("express");
const { getProducts, getProductById, createProduct } = require("../controllers/products");

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);

module.exports = router;
