const prisma = require("../utils/prisma");
const reviews = require("../data/reviews");

const setReviewsDB = async () => {
	try {
		const user = await prisma.user.findMany();

		for (let i = 0; i < reviews.length; i++) {
			await prisma.review.create({
				data: {
					description: reviews[i].description,
					date: new Date(),
					rating: reviews[i].rating,
					idUser: user[i + 5].id
				}
			});
		}

		return { message: "The reviews have been successfully set on DB" };
	} catch (error) {
		throw new Error(error.message);
	}
};

module.exports = { setReviewsDB };
