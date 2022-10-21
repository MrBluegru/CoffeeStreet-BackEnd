const prisma = require("../utils/prisma");

const getOrCreateCart = async (req, res, next) => {
	try {
		return res.status(200).json("carrito creado o conseguido");
	} catch (error) {
		next(error);
	}
};

const updateCart = async (req, res, next) => {
	try {
		return res.status(200).json("carrito update");
	} catch (error) {
		next(error);
	}
};

const deleteItem = async (req, res, next) => {
	try {
		return res.status(200).json("item eliminado");
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getOrCreateCart,
	updateCart,
	deleteItem
};
