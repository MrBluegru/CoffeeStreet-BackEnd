const { Router } = require("express");
const {
	getProducts,
	getProductById,
	getProductByName,
	createProduct,
	deleteProduct
} = require("../controllers/products");

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.get("/:name", getProductByName);
router.post("/", createProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
