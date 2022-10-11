const prisma = require("../utils/prisma");
const products = require("../data/productsData");

const setProductsDB = async () => {
	try {
		const sweetBakery = await products.getSweetBakery();
		const teas = await products.getTeas();
		const allProducts = [...teas, ...sweetBakery];
		const productsInDb = await prisma.product.createMany({
			data: allProducts
		});
		if (productsInDb) return { message: "The products have been successfully set on Db" };
		else return { message: "Error at setting Products on Db" };
	} catch (error) {
		throw new Error(error.message);
	}
};

module.exports = { setProductsDB };
