const { Router } = require("express");
const { getUsers, updateRole, deleteUser } = require("../controllers/users");

const router = Router();

router.get("/", getUsers);
router.put("/:id", updateRole);
router.delete("/delete", deleteUser);

module.exports = router;
