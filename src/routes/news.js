const express = require("express");
const { getNews, updateNews } = require("../controllers/news");
const router = express.Router();

router.get("/", getNews);
router.put("/:id", updateNews);

module.exports = router;
