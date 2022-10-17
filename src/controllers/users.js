const authMethods = require("../methods/auth");
const userMethods = require("../methods/user");

const getUsers = async (req, res, next) => {
	const { email } = req.body;

	try {
		if (email) {
			const userEmail = await authMethods.emailVerify(email);
			if (!userEmail) return res.status(400).json({ errorMessage: "This email is not registered" });
			else return res.status(200).json(user);
		} else {
			const users = await userMethods.findAll();
			if (users) return res.status(200).json(users);
			else return res.status(404).json({ errorMessage: "Users Not Found" });
		}
	} catch (error) {
		next(error);
	}
};

const updateUser = async (req, res, next) => {
	const { id } = req.params;
	const { role } = req.body;
	try {
		const userFound = await userMethods.findById(id);
		if (!userFound) return res.status(400).json({ errorMessage: "This user doesn't exist" });
		if (role === "admin" || role === "employee" || role === "client") {
			const all = await userMethods.findAll();
			const isAdmin = all.filter(el => el.role === "admin");
			if (isAdmin.length === 1) {
				const isOk = all.find(el => el.id === id && el.role !== "admin");
				if (!isOk) return res.status(400).json({ errorMessage: "There must be at least one Admin" });
			}
			const updated = await userMethods.updateRole(id, role);
			return res.status(200).json(updated);
		} else return res.status(400).json({ errorMessage: "The role must be admin, employee or client" });
	} catch (error) {
		next(error);
	}
};

const deleteUser = async (req, res, next) => {
	const { email } = req.body;

	try {
		const userFound = await authMethods.emailVerify(email);
		if (userFound) {
			const user = await userMethods.findByIdAuth(userFound.id);
			const userToDelete = await userMethods.logicDeleteUser(user.id);
			return res
				.status(200)
				.json({ message: `'${userToDelete.name} ${userToDelete.surname}' deleted successfully from the DB` });
		} else return res.status(404).json({ errorMessage: "There is not user with that email" });
	} catch (error) {
		next(error);
	}
};

module.exports = { getUsers, updateUser, deleteUser };
