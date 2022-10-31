const { Router } = require("express");

const { getAllOrders, getOrdersByUser, getOrderById, changeStatus} = require("../controllers/orders");

const router = Router();

router.get("/", getAllOrders);
router.get("/user/:id", getOrdersByUser);
router.get("/:id", getOrderById);
router.put("/:id/change-status", changeStatus);

module.exports = router;
