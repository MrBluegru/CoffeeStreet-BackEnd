const { Router } = require("express");
const { getUsers, updateUser, deleteUser } = require("../controllers/users");

const router = Router();

router.get("/", getUsers);
router.put("/:id", updateUser);
router.delete("/delete", deleteUser)

module.exports = router;
