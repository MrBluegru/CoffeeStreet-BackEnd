const { Router } = require("express");
const { saveEmailOnNewsletter, createNewsletter, removeEmailFromNewsletter } = require("../controllers/newsletter");

const router = Router();

router.post("/", saveEmailOnNewsletter);
router.post("/create", createNewsletter);
router.delete("/remove", removeEmailFromNewsletter);

module.exports = router;
