const prisma = require("../utils/prisma");

const findAll = async () => {
	const users = await prisma.user.findMany({
		where: {
			state: "active"
		},
		select: {
			id: true,
			name: true,
			surname: true,
			role: true,
			idAuth: true
		}
	});
	return users;
};

const findById = async id => {
	const user = await prisma.user.findUnique({
		where: {
			id
		},
		select: {
			id: true,
			name: true,
			surname: true,
			image: true,
			role: true,
			idAuth: true,
			state: true
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
		},
		select: {
			id: true,
			name: true,
			surname: true,
			image: true,
			role: true,
			auth: {
				select: {
					id: true,
					email: true,
					isGoogle: true
				}
			}
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
