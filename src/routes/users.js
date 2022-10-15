const { Router } = require("express");
const { getUsers, updateUser } = require("../controllers/users");

const router = Router();

router.get("/", getUsers);
router.put("/:id", updateUser);

module.exports = router;
