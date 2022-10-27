const { Router } = require("express");
// const { login, logout, refresh } = require("../controllers/orders");
const { setOrder } = require("../controllers/orders");
const router = Router();

router.post("/", setOrder);

module.exports = router;
