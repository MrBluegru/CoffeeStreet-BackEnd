const prisma = require("../utils/prisma");
const { getProductsFromApi } = require("../data/productsData");
const { getAttributesFromApi } = require("../data/attributesData");

const setProductsDB = async () => {
	try {
		const allProducts = await getProductsFromApi(); //consigo todos los productos
		const attributes = await getAttributesFromApi(); //consigo todos los attributes (creados pensando en su respectivo café preparado) de api, creados en el mismo orden que los cafés preparados están en su api, para que en el linkeo hagan match, 1 ---> 1, 2 ---> 2

		// creo y lleno la tabla de 20 conjuntos (objetos) de attributos. Porqué primero? Porque no tiene en sus campos id's de ninguna tabla
		await prisma.attribute.createMany({
			data: attributes
		});

		const attributesInDb = await prisma.attribute.findMany(); //consigo los attributes para usarlos al crear products, línea 27
		const coffees = await allProducts.filter(e => e.category === "coffee" && e.isPrepared === true); //filtro los cafés preparados para usarlos al crear products, línea 27
		//en el siguiente se setearean los elementos en la db, se eliminara originCountry para todos, excepto para los cafés de caja
		let response;
		for (let i = 0; i < allProducts.length; i++) {
			if (allProducts[i].isPrepared !== false) {
				response = await prisma.product.create({
					data: {
						...allProducts[i],
						originCountry: null,
						idAttribute: i < coffees.length ? attributesInDb[i].id : null
					}
				});
			} else {
				console.log(i);
				response = await prisma.product.create({
					data: {
						...allProducts[i],
						idAttribute: i < coffees.length ? attributesInDb[i].id : null
					}
				});
			}
		}
		if (response) return { message: "The products have been successfully set on Db" };
		else return { errorMessage: "Error at setting Products on DB" };
	} catch (error) {
		throw new Error(error.message);
	}
};

module.exports = { setProductsDB };
