const prisma = require("../utils/prisma");
const {
	getAll,
	findById,
	createNewProduct,
	verifyDataProduct,
	verifyName,
	verifyIngredients
} = require("../methods/products");

const { createNewAttribute, verifyDataAttributes } = require("../methods/attributes");

const getProducts = async (req, res, next) => {
	const { name } = req.query;
	try {
		if (name) {
			const findProductName = await prisma.product.findMany({
				where: {
					name: {
						contains: name,
						mode: "insensitive"
					}
				}
			});

			findProductName.length
				? res.status(200).json(findProductName)
				: res.status(404).json("No product with the searched name was found");
		} else {
			const productsInDb = await getAll();
			if (productsInDb) return res.status(200).json(productsInDb);
			else return res.status(404).json({ errorMessage: "Products not found" });
		}
	} catch (error) {
		next(error);
	}
};

const getProductById = async (req, res, next) => {
	const { id } = req.params;

	try {
		if (!id) return res.status(400).json({ errorMessage: "No id given" });
		const product = await findById(id);
		if (!product) return res.status(404).json({ errorMessage: "No product found with that id" });
		else return res.status(200).json(product);
	} catch (error) {
		next(error);
	}
};

const createProduct = async (req, res, next) => {
	const data = req.body.data;

	try {
		if (!data) return res.status(404).json({ errorMessage: "No data object given" });
		if (await verifyDataProduct(data))
			return res.status(404).json({ errorMessage: "Product data missing or datatype error" });
		if (await verifyName(data)) return res.status(404).json({ errorMessage: "Product name is already on database" });
		if (await verifyIngredients(data)) return res.status(404).json({ errorMessage: "Datatype error on ingredients" });
		if (await verifyDataAttributes(data))
			return res.status(404).json({ errorMessage: "Attributes data missing or datatype error" });

		const attributes = await createNewAttribute(data);
		if (attributes.repeated) {
			return res.status(404).json({
				errorMessage: `This combination of attributes already exist:`,
				product: { id: attributes.product.id, name: attributes.product.name }
			});
		} else {
			data.idAttribute = attributes.newAttribute.id; //se agrega el id recién creado en la tabla Attribute (attributes.newAttribute.id) a la data enviada del front
			const product = await createNewProduct(data); // se envía data como argumento, ya tiene incluído su idAttribute recién creado
			if (!product) return res.status(400).json({ errorMessage: "Error at creating product" });
			else return res.status(200).json({ message: "Product successfully created" });
		}
	} catch (error) {
		next(error);
	}
};

const updateProduct = async (req, res) => {
	const { id } = req.params;
	const {
		name,
		description,
		image,
		price,
		category,
		lactose,
		gluten,
		alcohol,
		stock,
		ingredients,
		originCountry,
		isPrepared,
		discount, //
		cream,
		texture,
		body,
		acidity,
		bitterness,
		roast,
		color,
		product
	} = req.body;

	try {
		const productFound = await prisma.product.findUnique({
			where: {
				id: id
			}
		});

		if (productFound) {
			const productUpdated = await prisma.product.update({
				where: {
					id: id
				},
				data: {
					name,
					description,
					image,
					price,
					category,
					lactose,
					gluten,
					alcohol,
					stock,
					ingredients,
					originCountry,
					isPrepared,
					discount,
					cream,
					texture,
					body,
					acidity,
					bitterness,
					roast,
					color,
					product
				}
			});

			res.status(200).json(productUpdated);
		} else {
			res.status(404).json("No product found with that id");
		}
	} catch (err) {
		console.log("An error ocurred in updateProduct");
		throw new Error(err);
	}
};

const deleteProduct = async (req, res, next) => {
	const { id } = req.params;

	try {
		const doesProductExist = await prisma.product.findUnique({
			where: {
				id
			}
		});

		if (doesProductExist) {
			const productToDelete = await prisma.product.update({
				where: {
					id
				},
				data: {
					state: "inactive"
				}
			});

			return res
				.status(200)
				.json({ message: `'${productToDelete.name}' deleted successfully from the Products in DB` });
		} else return res.status(404).json({ errorMessage: "There is no product with that id" });
	} catch (error) {
		next(error);
	}
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
