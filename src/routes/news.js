const express = require("express");
const { getNews, updateNews } = require("../controllers/news");
const router = express.Router();

router.get("/", getNews);
router.put("/", updateNews);

module.exports = router;
