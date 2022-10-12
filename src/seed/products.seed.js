const prisma = require("../utils/prisma");
const { getProductsFromApi } = require("../data/productsData");

const setProductsDB = async () => {
	try {
		const allProducts = await getProductsFromApi();
		if (allProducts.length) {
			const productsInDb = await prisma.product.createMany({
				data: allProducts
			});
			if (productsInDb) return { message: "The products have been successfully set on DB" };
			else return { errorMessage: "Error at setting Products on DB" };
		} else return { errorMessage: "Error at getting Products from API" };
	} catch (error) {
		throw new Error(error.message);
	}
};

module.exports = { setProductsDB };
