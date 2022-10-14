const prisma = require("../utils/prisma");
const authMethods = require("../methods/auth");

const getUsers = async (req, res, next) => {
	const { email } = req.body;

	try {
		if (email) {
			const userEmail = await authMethods.emailVerify(email);
			if (!userEmail) return res.status(400).json({ errorMessage: "This email is not registered" });
			else return res.status(200).json(user);
		} else {
			const users = await prisma.user.findMany();
			if (users) return res.status(200).json(users);
			else return res.status(404).json({ errorMessage: "Users Not Found" });
		}
	} catch (error) {
		next(error);
	}
};

module.exports = { getUsers };
