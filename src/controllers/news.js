const prisma = require("../utils/prisma");

const getNews = async (req, res, next) => {
	try {
		const findAllNews = await prisma.news.findMany();
		console.log(findAllNews);
		if (!findAllNews) {
			res.status(404).json({ errorMessage: "News not found" });
		} else {
			res.status(200).json(findAllNews);
		}
	} catch (error) {
		next(error);
	}
};

const updateNews = async (req, res, next) => {
	try {
	} catch (error) {
		next(error);
	}
};

module.exports = { getNews, updateNews };
