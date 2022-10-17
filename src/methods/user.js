const prisma = require("../utils/prisma");

const findAll = async () => {
	const users = await prisma.user.findMany();
	return users;
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

const findByIdAuth = async id => {
	const user = await prisma.user.findUnique({
		where: {
			idAuth: id
		}
	});
	return user;
};


const logicDeleteUser = async id => {
	const user = await prisma.user.update({
		where: {
			id
		},
		data: {
			state: "inactive"
		}
	});
	return user;
};

module.exports = { findAll, findById, updateRole, findByIdAuth, logicDeleteUser };
