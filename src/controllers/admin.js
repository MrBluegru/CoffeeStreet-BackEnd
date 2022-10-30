const prisma = require("../utils/prisma");
const adminMethods = require("../methods/admin");
const usersMethods = require("../methods/users");

const getUserNameQuery = () => {
	const { name } = req.query;
	try {
		if (!name) {
			res.status(404).json({ errorMessage: "" });
		} else {
			const foundUsersAll = usersMethods.getAllUsers();
			const UsersFilterQuery = foundUsersAll.filter(el => el.name.toLowerCase().includes(name.toLowerCase()));

			!UsersFilterQuery ? res.status(404).json({ errorMessage: "" }) : res.status(200).json({ UsersFilterQuery });
		}
	} catch (err) {
		res.status(404).json({ errorMessage: "" });
	}
};

module.exports = { getUserNameQuery };
