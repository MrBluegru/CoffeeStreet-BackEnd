const { Router } = require("express");
const { getUsers } = require("../controllers/admin");
const router = Router();

router.get("/users/", getUsers);

module.exports = router;
