const { Router } = require("express");
const { getOrCreateCart, updateCart, deleteItem } = require("../controllers/cart");
const router = Router();

router.post("/", getOrCreateCart);
router.put("/", updateCart);
router.delete("/", deleteItem);

module.exports = router;
