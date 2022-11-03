const prisma = require("../utils/prisma");
const usersMethods = require("../methods/users");
const authMethods = require("../methods/auth");

const getUsers = async (req, res) => {
	const { name } = req.query;
	try {
		if (name) {
			const nameUsers = await prisma.user.findMany({
				where: {
					name: {
						contains: name,
						mode: "insensitive"
					},
					state: "active"
				},
				include: {
					auth: {
						select: {
							email: true
						}
					}
				}
			});

			if (nameUsers.length) res.status(200).json(nameUsers);
			else res.status(200).json({ errorMessage: "There is no users with that name" });
		} else {
			const usersFound = await await prisma.user.findMany({
				include: {
					auth: {
						select: {
							email: true
						}
					}
				}
			});

			if (usersFound) res.status(200).json(usersFound);
			else res.status(404).json({ errorMessage: "User Not Found" });
		}
	} catch (err) {
		throw new Error({ errorMessage: err });
	}
};

const deleteUser = async (req, res, next) => {
	const { email } = req.query;

	try {
		if (email) {
			const userFound = await authMethods.emailVerify(email);
			if (userFound) {
				const user = await usersMethods.findByIdAuth(userFound.id);
				if (user) {
					const userToDelete = await usersMethods.logicDeleteUser(user.id);
					return res
						.status(200)
						.json({ message: `'${userToDelete.name} ${userToDelete.surname}' deleted successfully from the DB` });
				} else return res.status(404).json({ errorMessage: "This user is not authenticated" });
			} else return res.status(404).json({ errorMessage: "There is no user registered with that email" });
		} else return res.status(400).json({ errorMessage: "Please enter an email" });
	} catch (error) {
		next(error);
	}
};

module.exports = { getUsers, deleteUser };
