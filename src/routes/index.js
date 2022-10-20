const { Router } = require("express");
const usersRoute = require("./users");
const productsRoute = require("./products");
const registerRoute = require("./register");
const loginRoute = require("./login");
const orderRoute = require("./order");

const router = Router();

router.use("/users", usersRoute);
router.use("/products", productsRoute);
router.use("/register", registerRoute);
router.use("/login", loginRoute);
router.use("/order", orderRoute);

module.exports = router;
