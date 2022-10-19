const prisma = require("../utils/prisma");
const { getAll, findById, createNewProduct, verifyName } = require("../methods/products");
const { createNewAttribute } = require("../methods/attributes");
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
	validateIsPrepared,
	validateState,
	verifyDataProduct,
	verifyIngredients,
	verifyCoffeBox,
	verifyCoffePreparedOrBakery,
	verifyCategory
} = require("../validations/products");
const { verifyDataAttributes } = require("../validations/attributes");

const getProducts = async (req, res, next) => {
	const { name } = req.query;

	try {
		if (name) {
			const findProductName = await prisma.product.findMany({
				where: {
					AND: [
						{
							name: {
								contains: name,
								mode: "insensitive"
							}
						},
						{
							state: "active"
						}
					]
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
		color,
		// idDiscount  //para probar rutas products/discount
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
		color,
		// idDiscount  //para probar rutas products/discount
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
		// data.price = parseInt(data.price);
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
			data.isPrepared = true;
		}

		if (data.category === "sweetBakery" || data.category === "saltyBakery") {
			data.isPrepared = true;
			console.log(data);
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
		isPrepared,
		state
	} = req.body;

	try {
		//---------------------------------------------------------- VALIDACIONES --------------------------------------------------------//

		if (
			!name &&
			!description &&
			!image &&
			!price &&
			!category &&
			lactose === undefined &&
			gluten === undefined &&
			alcohol === undefined &&
			stock === undefined &&
			!ingredients &&
			!originCountry &&
			isPrepared === undefined &&
			!state
		) {
			return res.status(400).json({ errorMessage: "There is nothing to update. Please change at least one field" });
		}

		if (name && !validateName(name)) return res.status(400).json({ errorMessage: "Enter the name correctly" });

		if (description && !validateDescription(description))
			return res.status(400).json({ errorMessage: "Enter the description correctly" });

		if (image && !validateImg(image)) return res.status(400).json({ errorMessage: "Enter the image correctly" });

		if (price && !validatePrice(price)) return res.status(400).json({ errorMessage: "Enter the price correctly" });

		if (category && !validateCategory(category))
			return res.status(400).json({ errorMessage: "Enter the category correctly" });

		if (lactose && !validateLactose(lactose))
			return res.status(400).json({ errorMessage: "Please select an option in the field of lactose" });

		if (gluten && !validateGluten(gluten))
			return res.status(400).json({ errorMessage: "Please select an option in the field of gluten" });

		if (alcohol && !validateAlcohol(alcohol))
			return res.status(400).json({ errorMessage: "Please select an option in the field of alcohol" });

		if (stock && !validateStock(stock))
			return res.status(400).json({ errorMessage: "Please select an option in the field of stock" });

		if (ingredients && !validateIngredients(ingredients))
			return res.status(400).json({ errorMessage: "Enter the ingredients correctly" });

		if (originCountry && !validateOriginCountry(originCountry))
			return res.status(400).json({ errorMessage: "Enter the origin country correctly" });

		if (isPrepared && !validateIsPrepared(isPrepared))
			return res.status(400).json({ errorMessage: "Please select an option in the field of isPrepared" });

		if (state && !validateState(state))
			return res.status(400).json({ errorMessage: "Please select an option in the field of state" });

		//--------------------------------------------------------------------------------------------------------------------------------//
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
					isPrepared,
					state
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

		if (doesProductExist.state === "inactive")
			return res
				.status(200)
				.json({ errorMessage: `'${doesProductExist.name}' has already been deleted from the Products in DB` });

		if (doesProductExist) {
			await prisma.product.update({
				where: {
					id
				},
				data: {
					state: "inactive"
				}
			});

			return res
				.status(200)
				.json({ message: `'${doesProductExist.name}' deleted successfully from the Products in DB` });
		} else return res.status(404).json({ errorMessage: "There is no product with that id" });
	} catch (error) {
		next(error);
	}
};

//  usado para probar rutas de products/discount  ////

// const createDiscount = async (req, res, next) => {
// 	const { percentage } = req.body;
// 	try {
// 		const discountCreated = await prisma.discount.create({
// 			data: {
// 				percentage: percentage
// 			}
// 		});
// 		return res.status(200).json(discountCreated);
// 	} catch (error) {
// 		next(error);
// 	}
// };

const getProductsWithDiscount = async (req, res, next) => {
	try {
		const products = await prisma.product.findMany({
			where: {
				state: "active",
				discount: {
					percentage: { in: ["five", "ten", "fifteen"] }
				}
			},
			include: {
				discount: {
					select: {
						percentage: true
					}
				}
			}
		});
		if (products.length === 0) {
			return res.status(200).json({ message: "There are no products with discount" });
		} else return res.status(200).json(products);
	} catch (error) {
		next(error);
	}
};

const updateDiscountProduct = async (req, res, next) => {
	const { id } = req.params;
	const { percentage } = req.body;
	try {
		if (percentage === "five" || percentage === "ten" || percentage === "fifteen" || percentage === null) {
			const product = await prisma.product.findUnique({
				where: {
					id
				},
				include: {
					discount: {
						select: {
							percentage: true
						}
					}
				}
			});
			if (product.discount.percentage !== percentage) {
				if (percentage === null) {
					const updateDiscountToNull = await prisma.product.update({
						where: {
							id
						},
						data: {
							discount: {
								disconnect: true
							}
						}
					});
					console.log("updateDiscountToNull: ", updateDiscountToNull);
					return res.status(200).json({ message: "Product discount has changed successfully" });
				} else {
					const updateDiscount = await prisma.product.update({
						where: {
							id
						},
						data: {
							discount: {
								update: {
									percentage
								}
							}
						}
					});
					console.log("UPDATED: ", updateDiscount);
					if (updateDiscount) {
						return res.status(200).json({ message: "Product discount has changed successfully" });
					}
				}
			} else return res.status(400).json({ errorMessage: "Please enter a different percentage" });
		} else return res.status(400).json({ errorMessage: "Please enter a valid percentage" });
	} catch (error) {
		next(error);
	}
};


module.exports = {
	getProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
	// createDiscount,  // para probar ruta products/discount
	getProductsWithDiscount,
	updateDiscountProduct
};
