const { Router } = require("express");
const {
	getUser,
	getUserById,
	getUserFavourites,
	addUserFavourites,
	deleteUserFavourites,
	updateRole,
	deleteUser
} = require("../controllers/users");
const { mainAuthToken } = require("../lib/middlewares/authToken");

const router = Router();

router.get("/", getUser);
router.get("/:id", getUserById);
router.get("/:id/favourites", getUserFavourites);
router.post("/:id/favourites", addUserFavourites);
router.delete("/:id/favourites", deleteUserFavourites);
router.put("/:id", updateRole);
router.delete("/delete", deleteUser);

module.exports = router;
