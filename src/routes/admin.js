const { Router } = require("express");
const { getUsers, deleteUser } = require("../controllers/admin");
const router = Router();

router.get("/users/", getUsers);
router.delete("/deleteUser/", deleteUser);


module.exports = router;
