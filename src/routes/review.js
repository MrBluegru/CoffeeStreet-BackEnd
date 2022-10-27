const { Router } = require("express");
const { getReviews, createReview } = require("../controllers/review");
const router = Router();

router.get("/", getReviews);
router.post("/create", createReview);

module.exports = router;
