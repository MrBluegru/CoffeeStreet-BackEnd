const prisma = require("../utils/prisma");

const createCart = async (req, res, next) => {
	try {
		return res.status(200).json("exito");
	} catch (error) {
		next(error);
	}
};

module.exports = {
	createCart
};
