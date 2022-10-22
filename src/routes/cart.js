const { Router } = require("express");
const { GetOrCreateCart, addItemCart, deleteItem } = require("../controllers/cart");
const router = Router();

router.post("/", GetOrCreateCart);
router.put("/", addItemCart);
router.delete("/", deleteItem);

module.exports = router;
