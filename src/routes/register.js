const { Router } = require("express");
const { checkEmail } = require("../controllers/register");
const router = Router();

router.post("/email", checkEmail);

module.exports = router;
