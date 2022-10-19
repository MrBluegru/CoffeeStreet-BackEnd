const { Router } = require("express");
const { login, logout, refresh, forgotPassword, resetPassword } = require("../controllers/login");
const router = Router();

router.post("/", login);
router.post("/refresh", refresh);
router.post("/remove", logout);
router.post("/forgot-pass", forgotPassword);
router.post("/reset-pass", resetPassword);

module.exports = router;
