const { Router } = require("express");

const {
	getProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
	updateStockOfProduct,
	getProductsWithDiscount,
	updateDiscountOfProduct
} = require("../controllers/products");

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.put("/:id/stock", updateStockOfProduct);

module.exports = router;
