const prisma = require("../utils/prisma");
const { findById, create, verifyDataCreate, verifyName, verifyIngredients, getAll } = require("../methods/products");

const getProducts = async (req, res, next) => {
	try {
		const productsInDb = await getAll();
		if (productsInDb) return res.status(200).json(productsInDb);
		else return res.status(404).json({ errorMessage: "Products not found" });
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
		if (await verifyDataCreate(data)) return res.status(404).json({ errorMessage: "Data missing or datatype error" });
		if (await verifyName(data)) return res.status(404).json({ errorMessage: "Product name is already on database" });
		if (await verifyIngredients(data)) return res.status(404).json({ errorMessage: "Datatype error on ingredients" });
		const product = await create(data);
		if (!product) return res.status(400).json({ errorMessage: "Error at creating product" });
		else return res.status(200).json({ message: "Product successfully created" });
	} catch (error) {
		next(error);
	}
};

const getProductName = async (req, res) => {
	const { name } = req.params;
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
			const productsFound = await prisma.product.findMany();
			productsFound ? res.status(200).json(productsFound) : res.status(404).json("Products not found");
		}
	} catch (err) {
		console.log("An error ocurred in getProductQuery");
		throw new Error("An error ocurred!");
	}
};

module.exports = { getProducts, getProductById, createProduct, getProductName };
