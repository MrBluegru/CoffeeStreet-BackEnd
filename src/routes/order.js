const { Router } = require("express");
const { createOrder, changeStatus } = require("../controllers/order");

const router = Router();

router.post("/", createOrder);
router.put("/:id/change-status", changeStatus);

module.exports = router;
