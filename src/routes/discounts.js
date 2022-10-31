const { Router } = require("express");
const { getProductsWithDiscount, updateDiscountOfProduct } = require("../controllers/discounts");
const router = Router();

router.get("/", getProductsWithDiscount);
router.put("/", updateDiscountOfProduct);

module.exports = router;
