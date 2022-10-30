const { Router } = require("express");
const router = Router();
const { getUserNameQuery } = require("../controllers/admin");

router.get("/users/", getUserNameQuery);

module.exports = router;
