const { Router } = require("express");
const { GetOrCreateCart, addItemCart, deleteItem, deleteByProduct, emptyCart } = require("../controllers/cart");
const router = Router();

router.post("/", GetOrCreateCart);
router.put("/", addItemCart);
router.delete("/", deleteItem);
router.delete("/byproduct", deleteByProduct);
router.delete("/all", emptyCart);

module.exports = router;
