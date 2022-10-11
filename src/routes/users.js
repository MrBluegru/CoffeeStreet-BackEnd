const { Router } = require("express");
const { getUser } = require("../controllers/users");

const router = Router();

router.get("/", getUser);

module.exports = router;
