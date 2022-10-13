const { Router } = require("express");
const { getProducts, getProductById, createProduct, getProductName } = require("../controllers/products");

const router = Router();

router.get("/", getProducts);
router.get("/:name", getProductName);
router.get("/:id", getProductById);
router.post("/", createProduct);

module.exports = router;
