const express = require("express");
const { check, getPaymentById, notification, feedback } = require("../controllers/mercadopago");

const router = express.Router();

router.post("/mercadopago/notification", notification);
router.post("/mercadopago", check);
// router.get("/mercadopago/:id", getPaymentById);
// router.get("/mercadopago/feedback", feedback);

module.exports = router;
