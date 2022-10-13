const prisma = require("../utils/prisma");
const authMethods = require("../methods/auth");

const getUsers = async (req, res, next) => {
	try {
		const users = await prisma.user.findMany();

		if (users) return res.status(200).json(users);
		else return res.status(404).json({ errorMessage: "Users Not Found" });
	} catch (error) {
		next(error);
	}
};

// const getUserByEmail = async (req, res, next) => {
// 	const { email } = req.body;

// 	try {
// 		if (!email) return res.status(400).json({ errorMessage: "No email given" });
// 		const user = await authMethods.emailVerify(email);
// 		if (!user) return res.status(400).json({ errorMessage: "This email doesn't exist" });
// 		else return res.status(200).json(user);
// 	} catch (error) {
// 		next(error);
// 	}
// };

module.exports = { getUsers };
