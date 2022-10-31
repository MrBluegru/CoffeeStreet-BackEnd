const { Router } = require("express");
const usersRoute = require("./users");
const productsRoute = require("./products");
const registerRoute = require("./register");
const loginRoute = require("./login");
const cartRoute = require("./cart");
const orderRoute = require("./order");
const mercadopago = require("./mercadopago");
const newsletter = require("./newsletter");
const reviewRoute = require("./review");
const adminRoute = require("./admin");
const discountRoute = require("./discounts");
const router = Router();

router.use("/users", usersRoute);
router.use("/products", productsRoute);
router.use("/discount", discountRoute);
router.use("/register", registerRoute);
router.use("/login", loginRoute);
router.use("/cart", cartRoute);
router.use("/order", orderRoute);
router.use("/pay", mercadopago);
router.use("/newsletter", newsletter);
router.use("/review", reviewRoute);
router.use("/admin", adminRoute);

module.exports = router;
