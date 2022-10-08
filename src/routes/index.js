const { Router } = require("express");
const usersRoute = require("./users");
const productsRoute = require("./products");

const router = Router();

router.use("/users", usersRoute);
router.use("/products", productsRoute);

module.exports = router;
