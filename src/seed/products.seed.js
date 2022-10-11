const prisma = require("../utils/prisma");
const products = require("../data/productsData");

const setProducts = async () => {
	try {
		const sweet_Bakery = await products.getSweetBakery();
		const tes = await products.getTes();
		const data = [...tes, ...sweet_Bakery];
		const infoInDb = await prisma.product.createMany({
			data
		});
		if (infoInDb) return { message: "The products have been successfully set on Db" };
		else return { message: "Error at setting Products on Db" };
	} catch (error) {
		throw new Error(error.message);
	}
};

module.exports = { setProducts };
