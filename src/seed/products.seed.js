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

		let response;
		for (let i = 0; i < allProducts.length; i++) {
			//creo los productos uno por uno, para poder insertar la propiedad idAttribute con su valor correspondiente
			//como los cafés preparados son los primeros veinte, idAttribute (campo) tendrá su respectivo id de la tabla Attributes hasta que se acaben esos 20 ids
			//cuando eso suceda, los siguientes productos tendrán como idAttribute: null
			//De esta manera se logra que solo los cafés preparados tengan el id de Attributes que le corresponda, y se puede obtener su data completa en el front
			//Nota*** No será problema que el id de la tabla de Attributes sea uuid, porque cada que se levante el server, se hace el ciclo completo:
			// crear los id uuid de Attributes, y después insertarlos en el el campo idAttributes de la tabla de Products.
			//Nota*** Si los cafés y los atributos no estuvieran creados en orden en sus apis a propósito, este método no matchearía correctamente
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
