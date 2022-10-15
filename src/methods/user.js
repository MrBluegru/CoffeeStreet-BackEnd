const prisma = require("../utils/prisma");

const findAll = async () => {
	const users = await prisma.user.findMany();
	return users
};

const findById = async id => {
	const user = await prisma.user.findUnique({
		where: {
			id
		}
	});
	return user;
};

const updateRole = async (id, role) => {
	const user = await prisma.user.update({
		where: {
			id
		},
		data: {
			role
		}
	});
	return user;
};

module.exports = { findAll, findById, updateRole };
