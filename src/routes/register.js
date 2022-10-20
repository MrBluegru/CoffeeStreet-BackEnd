const { Router } = require("express");
const { checkEmail, register } = require("../controllers/register");
const router = Router();

router.post("/", register);
router.post("/email", checkEmail);

module.exports = router;
