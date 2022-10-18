const { Router } = require("express");
const { getUsers, getUserFavourites, addUserFavourites, updateRole, deleteUser } = require("../controllers/users");

const router = Router();

router.get("/", getUsers);
router.get("/:id/favourites", getUserFavourites);
router.post("/:id/favourites", addUserFavourites);
router.put("/:id", updateRole);
router.delete("/delete", deleteUser)

module.exports = router;
