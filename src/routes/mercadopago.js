const express = require("express");
const { check, getPaymentById, notification } = require("../controllers/mercadopago");

const router = express.Router();

router.post("/mercadopago/notification", notification);
router.post("/mercadopago", check);
router.get("/mercadopago/:id", getPaymentById);

module.exports = router;
