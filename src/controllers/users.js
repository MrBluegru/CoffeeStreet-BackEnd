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
	const { email, password, id } = req.body;

	try {
		if (!email || !password) return res.status(400).json({ errorMessage: "Email and Password Required" });
		const registered = await authMethods.emailVerify(email);
		if (!registered) return res.status(400).json({ errorMessage: "Email is not registered" });
		const isAdmin = await userMethods.isAdmin();
		if (!isAdmin)
			return res.status(200).json({ errorMessage: "You are not an Admin. You cannot change the User's role" });

		const userFound = await userMethods.findById(id);
		if (!userFound) return res.status(400).json({ errorMessage: "This user doesn't exist" });
		const updated = await userMethods.updateUser(id, role);
		return res.status(200).json(updated);
	} catch (error) {
		next(error);
	}
};


const deleteUser = async (req, res, next) => {
	const { email } = req.query;

	try {
		const userFound = await userMethods.findByEmail(email);

		if (userFound) {
			const userToDelete = await prisma.user.update({
				where: {
					email
				},
				data: {
					state: "inactive"
				}
			});

			return res.status(200).json({ message: `'${userToDelete.name}' deleted successfully from the Users in DB` });
		} else return res.status(404).json({ errorMessage: "There is no user with that email" });
	} catch (error) {
		next(error);
	}
};

module.exports = { getUsers, updateUser, deleteUser };
