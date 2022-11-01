const { Router } = require("express");
const { checkEmail, register, checkPassword } = require("../controllers/register");
const router = Router();

router.post("/", register);
router.post("/email", checkEmail);
router.post("/pass", checkPassword);

module.exports = router;
