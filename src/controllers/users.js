const prisma = require("../utils/prisma");
const authMethods = require("../methods/auth");
const userMethods = require("../methods/user");

const getUsers = async (req, res, next) => {
	const { email } = req.body;

	try {
		if (email) {
			const user = await authMethods.emailVerify(email);
			if (!user) return res.status(400).json({ errorMessage: "This email doesn't exist" });
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

const updateUser = async (req, res, next) => {
	const { id } = req.params;
	const { name, surname, role } = req.body;

	try {
		const userFound = await userMethods.findById(id);
		if (!userFound) return res.status(400).json({ errorMessage: "This user doesn't exist" });
		const updated = await userMethods.updateUser(id, name, surname, role);
		return res.status(200).json(updateUser);
		console.log(updated);
	} catch (error) {
		next(error);
	}
};

module.exports = { getUsers, updateUser };
