const { Router } = require("express");
const usersRoute = require("./users");
const productsRoute = require("./products");
const registerRoute = require("./register");

const router = Router();

router.use("/users", usersRoute);
router.use("/products", productsRoute);
router.use("/register", registerRoute);

module.exports = router;
