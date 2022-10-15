const { Router } = require("express");
const { getUsers, getUserFavourites, addUserFavourites } = require("../controllers/users");

const router = Router();

router.get("/", getUsers);
router.get("/:id/favourites", getUserFavourites);
router.post("/:id/favourites", addUserFavourites);

module.exports = router;
