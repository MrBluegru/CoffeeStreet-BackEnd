const { Router } = require("express");
const { getReviews, createReview, updateDescription, updateRating, removeReview } = require("../controllers/review");
const router = Router();

router.get("/", getReviews);
router.post("/create", createReview);
router.put("/:id/changedescription", updateDescription);
router.put("/:id/changerating", updateRating);
router.delete("/:id/remove", removeReview);

module.exports = router;
