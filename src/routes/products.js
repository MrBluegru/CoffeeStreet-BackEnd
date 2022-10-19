const { Router } = require("express");

const {
	getProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
	getProductsWithDiscount,
	// createDiscount, // para probar rutas products/discount
	updateDiscountProduct
} = require("../controllers/products");

const router = Router();

router.get("/discount", getProductsWithDiscount);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/discount/:id", updateDiscountProduct);
// router.post("/discount", createDiscount);  // para probar rutas products/discount
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
module.exports = router;
