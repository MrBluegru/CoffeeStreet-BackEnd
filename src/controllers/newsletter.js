const prisma = require("../utils/prisma");
const { sendEmailNewsletter } = require("../lib/emails/newsletter");

const saveEmailOnNewsletter = async (req, res, next) => {
	let { email } = req.body;

	try {
		if (!email) return res.status(404).json({ errorMessage: "Not email given" });

		const exist = await prisma.newsletter.findUnique({ where: { email } });
		if (exist) return res.status(404).json({ errorMessage: "Email is already on our newsletter" });

		const added = await prisma.newsletter.create({ data: { email } });
		if (added) return res.status(200).json({ errorMessage: "Email added successfully on our newsletter" });
		else return res.status(400).json({ errorMessage: "Error on adding email on newsletter db" });
	} catch (error) {
		next(error);
	}
};

const createNewsletter = async (req, res, next) => {
	const { description, title, image } = req.body;
	try {
		if (description && typeof description === "string" && title && typeof title === "string") {
			if (image && typeof image === "string") {
				const newsletter = { description, title, image };

				const userEmails = await prisma.newsletter.findMany({
					select: {
						email: true
					}
				});

				userEmails.forEach(el => {
					sendEmailNewsletter(el.email, newsletter);
				})


				return res.status(200).json({ message: `The newsletter was successfully sent` });
			} else return res.status(404).json({ errorMessage: "Please enter a valid image" });
		} else return res.status(400).json({ errorMessage: "Please enter a valid description or title" });
	} catch (error) {
		next(error);
	}
};

const removeEmailFromNewsletter = async (req, res, next) => {
	let { email } = req.body;

	try {
		if (!email) return res.status(404).json({ errorMessage: "Not email given" });

		const exist = await prisma.newsletter.findUnique({ where: { email } });
		if (!exist) return res.status(404).json({ errorMessage: "Email doesn't exist on our newsletter" });

		const deleted = await prisma.newsletter.delete({ where: { id: exist.id } });
		if (deleted) return res.status(200).json({ errorMessage: "Email deleted successfully from our newsletter" });
		else return res.status(400).json({ errorMessage: "Error on deleting email on newsletter db" });
	} catch (error) {
		next(error);
	}
};

module.exports = { saveEmailOnNewsletter, createNewsletter, removeEmailFromNewsletter };
