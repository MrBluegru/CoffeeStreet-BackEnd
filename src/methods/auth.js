const prisma = require("../utils/prisma");
const bcrypt = require("bcrypt");

const emailVerify = async email => {
	const auth = await prisma.auth.findUnique({ where: { email } });
	return auth;
};

const findAll = async () => {
	const all = await prisma.auth.findMany();
	return all;
};

const findById = async id => {
	const findUser = await prisma.auth.findUnique({ where: { id } });
	return findUser;
};

const createAuth = async ({ email, password, isGoogle }) => {
	let hashedPassword;
	if (password) {
		hashedPassword = await bcrypt.hash(password, 10);
	}
	const data = { email, password: password ? hashedPassword : null, isGoogle };
	const user = await prisma.auth.create({ data });
	return user;
};

module.exports = {
	emailVerify,
	findAll,
	findById,
	createAuth
};
