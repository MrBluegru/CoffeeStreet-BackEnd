const { Router } = require("express");
const { createOrder } = require("../controllers/order");

const router = Router();

router.post("/", createOrder);
// router.get("/change-status/:id", changeStatusOrder);


module.exports = router;
