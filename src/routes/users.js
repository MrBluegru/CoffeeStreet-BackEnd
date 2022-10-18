const { Router } = require("express");
const { getUsers, getUserFavourites, addUserFavourites, updateUser } = require("../controllers/users");

const router = Router();

router.get("/", getUsers);
router.get("/:id/favourites", getUserFavourites);
router.post("/:id/favourites", addUserFavourites);
router.put("/:id", updateUser);

module.exports = router;
