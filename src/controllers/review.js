const prisma = require("../utils/prisma");

const getReviews = async (req, res, next) => {
	try {
		const reviews = await prisma.review.findMany();
		if (!reviews) return res.status(200).json({ msg: "No reviews" });
		const data = reviews.map(async e => {
			const dataUser = await prisma.user.findFirst({ where: { id: e.idUser } });
			return {
				id: e.id,
				description: e.description,
				date: e.date,
				rating: e.rating,
				fullname: dataUser.name + " " + dataUser.surname
			};
		});
		res.status(200).json(data);
	} catch (error) {
		next(error);
	}
};

const createReview = async (req, res, next) => {
	const { description, rating, idUser } = req.body;
	try {
		if (!idUser) return res.status(404).json({ errorMessage: "Not idUser given" });
		const user = await prisma.user.findUnique({ where: { id: idUser } });
		if (!user) return res.status(404).json({ errorMessage: "This user is not found" });

		if (typeof description !== "string")
			return res.status(400).json({ errorMessage: "Please enter a valid description" });
		if (!rating) return res.status(400).json({ errorMessage: "Please enter a rating" });
		if (typeof rating !== "number" || !(rating > 0 && rating < 6))
			return res.status(400).json({ errorMessage: "Please enter a valid rating" });

		const date = new Date();
		const reviewCreated = await prisma.review.create({
			data: {
				description,
				rating,
				date,
				idUser
			}
		});
		return res.status(200).json({ msg: "Review created succesfully", review: reviewCreated });
	} catch (error) {
		next(error);
	}
};

const updateDescription = async (req, res, next) => {
	const { id } = req.params; //id de la review
	const { description } = req.body;
	try {
		if (!id) return res.status(404).json({ errorMessage: "Not id given" });
		const review = await prisma.review.findUnique({ where: { id } });
		if (!review) return res.status(404).json({ errorMessage: "This review is not found" });

		if (!description || typeof description !== "string")
			return res.status(400).json({ errorMessage: "Please enter a valid description" });

		// if (review.description === description)
		// 	return res.status(400).json({ errorMessage: "Please enter a different description" });

		const date = new Date();
		const updatedDescription = await prisma.review.update({
			where: {
				id
			},
			data: {
				description,
				date
			}
		});

		return res.json({ msg: "The description has changed succesfully", updatedDescription });
	} catch (error) {
		next(error);
	}
};

const updateRating = async (req, res, next) => {
	const { id } = req.params; //id de la review
	const { rating } = req.body;
	try {
		if (!id) return res.status(404).json({ errorMessage: "Not id given" });
		const review = await prisma.review.findUnique({ where: { id } });
		if (!review) return res.status(404).json({ errorMessage: "This review is not found" });

		if (!rating) return res.status(400).json({ errorMessage: "Please enter a rating" });
		if (typeof rating !== "number" || !(rating > 0 && rating < 6))
			return res.status(400).json({ errorMessage: "Please enter a valid rating" });

		// if (review.rating === rating) return res.status(400).json({ errorMessage: "Please enter a different rating" });

		const date = new Date();
		const updatedRating = await prisma.review.update({
			where: {
				id
			},
			data: {
				rating,
				date
			}
		});

		return res.json({ msg: "The rating has changed succesfully", updatedRating });
	} catch (error) {
		next(error);
	}
};

const removeReview = async (req, res, next) => {
	const { id } = req.params;

	try {
		const review = await prisma.review.findUnique({ where: { id } });
		if (!review) return res.status(404).json({ errorMessage: "This review is not found" });

		const deletedReview = await prisma.review.delete({
			where: {
				id
			}
		});

		return res.json({ msg: "The review has deleted succesfully", deletedReview });
	} catch (error) {
		next(error);
	}
};

module.exports = { getReviews, createReview, updateDescription, updateRating, removeReview };
