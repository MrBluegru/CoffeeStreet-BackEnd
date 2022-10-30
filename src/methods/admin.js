const prisma = require("../utils/prisma");

const getUserByName = async name => {
	const user = await prisma.user.findMany({
		where: {
			name: name
		}
	});
	return user;
};

const getAllUsers = () => {
	const foundAllUsers = prisma.user.findMany();
	return foundAllUsers;
};

module.exports = { getUserByName, getAllUsers };
