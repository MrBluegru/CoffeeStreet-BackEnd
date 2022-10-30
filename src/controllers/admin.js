const prisma = require("../utils/prisma");
const usersMethods = require("../methods/users");

const getUsers = async (req, res) => {
	const { name } = req.query;
	try {
		if (name) {
			const nameUsers = await prisma.user.findMany({
				where: {
					name: {
						contains: name,
						mode: "insensitive"
					}
				}
			});
			if (nameUsers.length) res.status(200).json(nameUsers);
			else res.status(200).json({ errorMessage: "There is no users with that name" });
		} else {
			const usersFound = await usersMethods.findAll();

			if (usersFound) res.status(200).json(usersFound);
			else res.status(404).json({ errorMessage: "User Not Found" });
		}
	} catch (err) {
		throw new Error({ errorMessage: err });
	}
};

module.exports = { getUsers };
