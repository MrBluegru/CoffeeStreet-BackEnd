const { Router } = require("express");
const { login, logout, refresh } = require("../controllers/login");
const router = Router();

router.post("/", login);
router.post("/refresh", refresh);
router.post("/remove", logout);

module.exports = router;
