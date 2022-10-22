const { Router } = require("express");

const {
	getProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
	getProductsWithDiscount,
	updateDiscountOfProduct
} = require("../controllers/products");

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.get("/discount", getProductsWithDiscount);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.put("/:id/discount", updateDiscountOfProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
