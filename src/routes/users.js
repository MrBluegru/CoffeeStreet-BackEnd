const { Router } = require("express");
const { getUsers, getUserByEmail } = require("../controllers/users");

const router = Router();

router.get("/", getUsers);
// router.get("/", getUserByEmail);

module.exports = router;
