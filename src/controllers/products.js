const prisma = require("../utils/prisma");
const {
	getAll,
	findById,
	createNewProduct,
	verifyDataProduct,
	verifyName,
	verifyIngredients,
	verifyCoffeBox,
	verifyCoffePreparedAndBakery,
	verifyCoffePreparedorBakery,
	verifyCoffePreparedOrBakery,
	verifyCategory
} = require("../methods/products");

const { createNewAttribute, verifyDataAttributes } = require("../methods/attributes");
const {
	validateName,
	validateDescription,
	validateImg,
	validatePrice,
	validateCategory,
	validateLactose,
	validateGluten,
	validateAlcohol,
	validateStock,
	validateIngredients,
	validateOriginCountry,
	validateIsPrepared
} = require("../validations/products");
const { json } = require("body-parser");

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
				: res.status(200).json({ errorMessage: "There is no product with that name" });
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
		const product = await findById(id);
		if (!product) return res.status(404).json({ errorMessage: "There is no product with that id" });
		else return res.status(200).json(product);
	} catch (error) {
		next(error);
	}
};

const createProduct = async (req, res, next) => {
	const {
		name,
		description,
		image,
		price,
		category,
		lactose,
		gluten,
		alcohol,
		ingredients,
		originCountry,
		isPrepared,
		cream,
		texture,
		body,
		acidity,
		bitterness,
		roast,
		color
	} = req.body;
	const data = {
		name,
		description,
		image,
		price,
		category,
		lactose,
		gluten,
		alcohol,
		ingredients,
		originCountry,
		isPrepared,
		cream,
		texture,
		body,
		acidity,
		bitterness,
		roast,
		color
	};
	try {
		// if (!data) return res.status(404).json({ errorMessage: "No data object given" });

		//Verificacion general para todos los productos
		if (verifyCategory(data)) return res.status(404).json({ errorMessage: "Error on category type" });
		if (verifyDataProduct(data))
			return res.status(404).json({
				errorMessage:
					"Basic product data missing, datatype error or not long enough on: name, description, image, price or isPrepared"
			});
		if (data.isPrepared !== false) {
			data.originCountry = null;
		}
		if (await verifyName(data)) return res.status(404).json({ errorMessage: "Product name is already on database" });

		if (data.isPrepared !== false) {
			if (verifyIngredients(data))
				return res.status(404).json({ errorMessage: "Missing data or datatype error on: ingredients" });
		}
		data.price = parseInt(data.price);
		// Verificacion especifica para Cafes
		if (data.category === "coffee") {
			if (data.isPrepared === true) {
				if (verifyCoffePreparedOrBakery(data))
					return res.status(404).json({
						errorMessage:
							"Coffee ready to eat registration attempt. Data missing or datatype error on: lactose, gluten or alcohol"
					});
				if (verifyDataAttributes(data))
					return res.status(404).json({
						errorMessage: "Coffee ready to eat registration attempt. Data missing or datatype error on: attributes"
					});
				const attributes = await createNewAttribute(data);
				data.idAttribute = attributes.id; //se agrega el id recién creado en la tabla Attribute (attributes.newAttribute.id) a la data enviada del front
			} else {
				data.lactose = false;
				data.gluten = false;
				data.alcohol = false;
				data.ingredients = ["coffee"];
				if (verifyCoffeBox(data))
					return res.status(404).json({
						errorMessage:
							"Coffee Box registration attempt. Data missing, datatype error, or not long enough: originCountry "
					});
			}
		}
		// Verificacion especifica para tes
		if (data.category === "tea") {
			data.lactose = false;
			data.gluten = false;
			data.alcohol = false;
			data.originCountry = null;
			data.isPrepared === true;
		}

		if (data.category === "sweetBakery" || data.category === "saltyBakery") {
			data.isPrepared === true;
			if (verifyCoffePreparedOrBakery(data))
				return res.status(404).json({
					errorMessage: "Bakery registration attempt. Data missing or datatype error: lactose, gluten or alcohol"
				});
		}

		if (data.category === "other") {
			data.originCountry = null;
			data.idAttribute = null;
			if (verifyIngredients(data))
				return res.status(404).json({ errorMessage: "Missing data or datatype error on: ingredients" });
			if (verifyCoffePreparedOrBakery(data))
				return res.status(404).json({
					errorMessage:
						"Other-category product registration attempt. Data missing or datatype error on: lactose, gluten or alcohol"
				});
		}

		// Creación de producto: se envía data como argumento, ya tiene incluído su idAttribute recién creado
		const product = await createNewProduct(data);
		if (!product) return res.status(400).json({ errorMessage: "Error at creating product" });
		else {
			return res.status(200).json({ message: "Product successfully created" });
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
		isPrepared
	} = req.body;

	try {
		//---------------------------------------------------------- VALIDACIONES --------------------------------------------------------//

		if (!validateName(name)) return res.status(400).json({ errorMessage: "Enter the name correctly" });

		if (!validateDescription(description))
			return res.status(400).json({ errorMessage: "Enter the description correctly" });

		if (!validateImg(image)) return res.status(400).json({ errorMessage: "Enter the image correctly" });

		if (!validatePrice(price)) return res.status(400).json({ errorMessage: "Enter the price correctly" });

		if (!validateCategory(category)) return res.status(400).json({ errorMessage: "Enter the category correctly" });

		if (!validateLactose(lactose))
			return res.status(400).json({ errorMessage: "Please select an option in the field of Lactose" });

		if (!validateGluten(gluten))
			return res.status(400).json({ errorMessage: "Please select an option in the field of gluten" });

		if (!validateAlcohol(alcohol))
			return res.status(400).json({ errorMessage: "Please select an option in the field of alcohol" });

		if (!validateStock(stock))
			return res.status(400).json({ errorMessage: "Please select an option in the field of stock" });

		if (!validateIngredients(ingredients))
			return res.status(400).json({ errorMessage: "Enter the ingredients correctly" });

		if (!validateOriginCountry(originCountry))
			return res.status(400).json({ errorMessage: "Enter the origin country correctly" });

		if (!validateIsPrepared(isPrepared)) return res.status(400).json({ errorMessage: "Please select an option" });

		//--------------------------------------------------------------------------------------------------------------------------------//
		console.log("qui");
		const productFound = await findById(id);
		if (productFound) {
			await prisma.product.update({
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
					isPrepared
				}
			});

			return res.status(200).json({ message: `'${productFound.name}' updated successfully` });
		} else return res.status(404).json({ errorMessage: "There is no product with that id" });
	} catch (err) {
		console.log(err);
	}
};

const deleteProduct = async (req, res, next) => {
	const { id } = req.params;

	try {
		const doesProductExist = await findById(id);

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

module.exports = {
	getProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct
};
