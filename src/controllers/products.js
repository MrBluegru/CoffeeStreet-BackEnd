const axios = require("axios");
const products = require("../data/productsData");
const prisma = require("../utils/prisma");

const getProducts = async (req, res, next) => {
	try {
		const productsInDb = await prisma.Product.findMany();
		if (productsInDb) return res.status(200).json(productsInDb);
		else {
			return res.status(404).json({ errorMessage: "Products not found" });
		}
	} catch (error) {
		next(error);
	}
};

module.exports = { getProducts };
