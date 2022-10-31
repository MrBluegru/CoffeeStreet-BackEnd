const { Router } = require("express");
const { login, logout, refresh, forgotPassword, resetPassword } = require("../controllers/login");
const { secondAuthToken, thirdAuthToken, mainAuthToken } = require("../lib/middlewares/authToken");
const router = Router();

router.post("/", login);
router.post("/refresh", [secondAuthToken], refresh);
router.post("/remove", [thirdAuthToken], logout);
router.post("/forgot-pass", forgotPassword);
router.post("/reset-pass", resetPassword);

module.exports = router;
