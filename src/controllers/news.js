const prisma = require("../utils/prisma");
const { verifyTitle, verifyImage, verifyDescription, verifyParagraph } = require("../validations/news");

const getNews = async (req, res, next) => {
	try {
	} catch (error) {
		next(error);
	}
};

const updateNews = async (req, res, next) => {
	const { id } = req.params;
	const { title, image, description, paragraph1, paragraph2, paragraph3 } = req.body;

	try {
		const foundNews = await prisma.news.findUnique({ where: { id } });
		if (!foundNews) return res.status(404).json({ errorMessage: "There is no id with that id" });
		if (!title && !image && !description && !paragraph1 && paragraph2 && paragraph3)
			return res.status(404).json({ errorMessage: "There is nothing to update" });
		if (title && verifyTitle(title))
			return res.status(400).json({ errorMessage: "The title must be a string and have a minimum length of 7" });
		if (image && verifyImage(image))
			return res
				.status(400)
				.json({ errorMessage: "The image must be a string, have a minimum length of 5 and have a valid extension" });
		if (description && verifyDescription(description))
			return res.status(400).json({ errorMessage: "The description must be a string and have a minimum length of 15" });
		if (paragraph1 && verifyParagraph(paragraph1))
			return res.status(400).json({ errorMessage: "The paragraph must be a string and have a minimum length of 30" });
		if (paragraph2 && verifyParagraph(paragraph2))
			return res.status(400).json({ errorMessage: "The paragraph must be a string and have a minimum length of 30" });
		if (paragraph3 && verifyParagraph(paragraph3))
			return res.status(400).json({ errorMessage: "The paragraph must be a string and have a minimum length of 30" });

		const updatedNews = await prisma.news.update({
			where: {
				id
			},
			data: {
				title,
				image,
				description,
				paragraph1,
				paragraph2,
				paragraph3
			}
		});
		return res.status(200).json({ message: "The news has been updated successfully", updatedNews });
	} catch (error) {
		next(error);
	}
};

module.exports = { getNews, updateNews };
