const prisma = require("../utils/prisma");
const { getProductsFromApi } = require("../data/productsData");
const { getAttributesFromApi } = require("../data/attributesData");

const setProductsDB = async () => {
	try {
		const attributes = await getAttributesFromApi();
		const allProducts = await getProductsFromApi();
		console.log(attributes);

		await prisma.attribute.createMany({
			data: attributes
		});

		const attributesInDb = await prisma.attribute.findMany();
		const coffees = await allProducts.filter(e => e.category === "coffee" && e.isPrepared === true);

		let response;
		for (let i = 0; i < allProducts.length; i++) {
			response = await prisma.product.create({
				data: { ...allProducts[i], idAttribute: i < coffees.length ? attributesInDb[i].id : null }
			});
		}
		if (response) return { message: "The products have been successfully set on Db" };
		else return { errorMessage: "Error at setting Products on DB" };
	} catch (error) {
		throw new Error(error.message);
	}
};

module.exports = { setProductsDB };
