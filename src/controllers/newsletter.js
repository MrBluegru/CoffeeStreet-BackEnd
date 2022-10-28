const prisma = require("../utils/prisma");
const authMethods = require("../methods/auth");

const saveEmailOnNewsletter = async (req, res, next) => {
	let { email } = req.body;

	try {
		if (!email) return res.status(404).json({ errorMessage: "Not email given" });

		const exist = await authMethods.emailVerify(email);
		if (exist) return res.status(404).json({ errorMessage: "Email is already on our newsletter" });

		const added = await prisma.newsletter.create({ data: email });
		if (added) return res.status(200).json({ errorMessage: "Email added successfully on our newsletter" });
		else return res.status(400).json({ errorMessage: "Error on adding email on newsletter db" });
	} catch (error) {
		next(error);
	}
};

const createNewsletter = async (req, res, next) => {
	const { description, rating } = req.body;
	try {
		if (!description || typeof description !== "string") {
			if (!rating || typeof rating !== "number" || (rating <= 5 && rating >= 1)) {
				if (status !== foundOrder.status) {
					const updatedStatus = await prisma.order.update({
						where: {
							id
						},
						data: {
							status
						}
					});
					return res.status(200).json({ message: `The status was changed successfully to ${status}`, updatedStatus });
				} else return res.status(400).json({ errorMessage: "Please enter a different status" });
			} else return res.status(404).json({ errorMessage: "Please enter a valid rating" });
		} else return res.status(400).json({ errorMessage: "Please enter a valid description" });
	} catch (error) {
		next(error);
	}
};

const removeEmailFromNewsletter = async (req, res, next) => {
	const { id } = req.params;
	const { status } = req.body;
	try {
		if (status === "pending" || status === "complete") {
			const foundOrder = await prisma.order.findUnique({
				where: {
					id
				}
			});
			if (foundOrder) {
				if (status !== foundOrder.status) {
					const updatedStatus = await prisma.order.update({
						where: {
							id
						},
						data: {
							status
						}
					});
					return res.status(200).json({ message: `The status was changed successfully to ${status}`, updatedStatus });
				} else return res.status(400).json({ errorMessage: "Please enter a different status" });
			} else return res.status(404).json({ errorMessage: "The order is not exist" });
		} else return res.status(400).json({ errorMessage: "Please enter a valid status" });
	} catch (error) {
		next(error);
	}
};

module.exports = { saveEmailOnNewsletter, createNewsletter, removeEmailFromNewsletter };
