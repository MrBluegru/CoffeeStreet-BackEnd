const { Router } = require("express");
const { changeStatus, createOrder } = require("../controllers/order");

const router = Router();

// router.post("/", createOrder);
router.put("/:id/change-status", changeStatus);

module.exports = router;
