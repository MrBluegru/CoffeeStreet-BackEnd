const axios = require("axios");
const getSweetBakery = require("../data/productsData");
const prisma = require("../utils/prisma");

const getProducts = async (req, res, next) => {
	const sweet_Bakery = await getSweetBakery();

	try {
		const productsAlrearyInDb = await prisma.Product.findMany();

		if (productsAlrearyInDb.length) return res.status(200).json(productsAlrearyInDb);
		else {
			const fetchingProducts = await axios.get("https://apimocha.com/tea-data/info");

			const data = [...fetchingProducts.data, ...sweet_Bakery];

			if (typeof fetchingProducts.data === "object") {
				await prisma.Product.createMany({
					data
				});

				return res.status(200).json(data);
			} else {
				return res.status(404).json({ errorMessage: "Products not found" });
			}
		}
	} catch (error) {
		next(error);
	}
};

module.exports = { getProducts };
