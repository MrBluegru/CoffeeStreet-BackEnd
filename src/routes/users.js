const { Router } = require("express");
const {
	getUsers,
	getUserById,
	getUserFavourites,
	addUserFavourites,
	deleteUserFavourites,
	updateRole,
	deleteUser,
	updateUser
} = require("../controllers/users");
const { mainAuthToken } = require("../lib/middlewares/authToken");

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.get("/:id/favourites", getUserFavourites);
router.post("/:id/favourites", addUserFavourites);
router.delete("/:id/favourites", deleteUserFavourites);
router.put("/:id", updateRole);
router.delete("/delete", deleteUser);
router.put("/update/:id", updateUser);

module.exports = router;
