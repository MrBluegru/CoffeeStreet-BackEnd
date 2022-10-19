const { Router } = require("express");
const {
	getUsers,
	getUserById,
	getUserFavourites,
	addUserFavourites,
	deleteUserFavourites,
	updateUser
} = require("../controllers/users");

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.get("/:id/favourites", getUserFavourites);
router.post("/:id/favourites", addUserFavourites);
router.delete("/:id/favourites", deleteUserFavourites);
router.put("/:id", updateUser);

module.exports = router;
