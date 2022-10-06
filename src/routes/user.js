const { Router } = require("express");
const { getUser } = require("../controllers/user.controller");

const router = Router();

router.get("/", getUser);

module.exports = router;
