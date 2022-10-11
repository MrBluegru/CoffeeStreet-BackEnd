const axios = require("axios");
const products = require("../data/productsData");
const prisma = require("../utils/prisma");
const { findById, create, verifyDataCreate, verifyName, verifyIngredients } = require("../methods/products");

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

const getProductById = async (req, res, next) => {
	const { id } = req.params;
	console.log(id);
	if (!id) return res.status(400).json({ errorMessage: "No id given" });

	try {
		const product = await findById(id);
		if (!product) return res.status(404).json({ errorMessage: "No product found" });
		else return res.status(200).json(product);
	} catch (error) {
		next(error);
	}
};

const createProduct = async (req, res, next) => {
	const data = req.body.data;
	if (!data) return res.status(404).json({ errorMessage: "No data object given" });
	try {
		if (await verifyDataCreate(data)) return res.status(404).json({ errorMessage: "Data missing or datatype error" });
		if (await verifyName(data)) return res.status(404).json({ errorMessage: "Product name is already on database" });
		if (await verifyIngredients(data)) return res.status(404).json({ errorMessage: "Datatype error on ingredients" });
		const product = await create(data);
		if (!product) return res.status(400).json({ errorMessage: "Error at creating product" });
		else return res.status(200).json("Product sucessfully created");
	} catch (error) {
		next(error);
	}
};

module.exports = { getProducts, getProductById, createProduct };
