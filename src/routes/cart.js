const { Router } = require("express");
const { createCart } = require("../controllers/cart");
const router = Router();

router.post("/", createCart);

module.exports = router;
