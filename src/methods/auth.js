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

const updatePassword = async ({ email, newPassword }) => {
	const update = await prisma.auth.update({
		where: { email },
		data: { password: await bcrypt.hash(newPassword, 10) }
	});
	return update;
};

module.exports = {
	emailVerify,
	findAll,
	findById,
	createAuth,
	updatePassword
};
