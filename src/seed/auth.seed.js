const prisma = require("../utils/prisma");
const authFunction = require("../data/authData");

const setAuth = async () => {
	try {
		const array = await authFunction();
		await prisma.auth.createMany({ data: array });
		return { message: "The auth table has been successfully created" };
	} catch (error) {
		throw new Error(error.message);
	}
};

module.exports = { setAuth };
