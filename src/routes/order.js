const { Router } = require("express");
const { changeStatus, createOrder } = require("../controllers/order");
const { getAllOrders, getOrdersByUser, getOrderById } = require("../controllers/orders");

const router = Router();


router.get("/", getAllOrders);
router.get("/user/:id", getOrdersByUser);
router.get("/:id", getOrderById);
router.put("/:id/change-status", changeStatus);

module.exports = router;
