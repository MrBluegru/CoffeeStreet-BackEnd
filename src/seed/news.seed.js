const prisma = require("../utils/prisma");
const newsData = require("../data/news");

const setNewsDb = async () => {
	try {
		await prisma.news.create({
			data: newsData
		});

		return { message: "The News have been successfully set on DB" };
	} catch (error) {
		console.log(error);
	}
};

module.exports = { setNewsDb };
