const { Router } = require("express");
const { GetOrCreateCart, addItemCart, deleteItem, emptyCart } = require("../controllers/cart");
const router = Router();

router.post("/", GetOrCreateCart);
router.put("/", addItemCart);
router.delete("/", deleteItem);
router.delete("/all", emptyCart);

module.exports = router;
