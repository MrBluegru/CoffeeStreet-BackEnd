const prisma = require("../utils/prisma");
const { getAll, findById, createNewProduct, verifyName, findByName } = require("../methods/products");
const { createNewAttribute, updateAttribute } = require("../methods/attributes");

const {
	validateName,
	validateDescription,
	validatePrice,
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
const { verifyImage } = require("../validations/register");

const getProducts = async (req, res, next) => {
	const { name } = req.query;

	try {
		if (name) {
			const findProductName = await findByName(name);

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
		if (!product || product.state === "inactive")
			return res.status(404).json({ errorMessage: "There is no product with that id" });
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
		stock,
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
		stock,
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
				if (!attributes) return res.status(404).json({ errorMessage: "Error at creating Attributes on db" });
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
			data.gluten = false;
			data.originCountry = null;
			// data.isPrepared = true;
		}

		if (data.category === "sweetBakery" || data.category === "saltyBakery") {
			// data.isPrepared = true;
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
	let {
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
		stock,
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

	let att;

	const exist = await prisma.product.findUnique({ where: { id } });
	if (!exist) return res.status(404).json({ errorMessage: "The product you are trying to update doesn't exist" });
	const hasAttributes = exist.idAttribute ? true : false;
	att = exist.idAttribute;

	const check = Object.values(data).every(e => e === undefined || e === null);
	if (check) return res.status(400).json({ errorMessage: "Any information for update sent" });
	if (await verifyName(data)) {
		const sameName = await verifyName(data);
		if (sameName.id !== id) return res.status(404).json({ errorMessage: "Another product has already that name" });
	}

	try {
		if (typeof stock !== "boolean") return res.status(404).json({ errorMessage: "Error on stock" });
		if (verifyCategory(data)) return res.status(404).json({ errorMessage: "Error on category type" });
		if (verifyDataProduct(data))
			return res.status(404).json({
				errorMessage:
					"Basic product data missing, datatype error or not long enough on: name, description, image, price or isPrepared"
			});

		if (data.isPrepared !== false) {
			// originCountry = null;
			if (verifyIngredients(data))
				return res.status(404).json({ errorMessage: "Missing data or datatype error on: ingredients" });
		}

		if (category !== "coffee" && exist.idAttribute) {
			if (hasAttributes) {
				await prisma.attribute.delete({ where: { id: exist.idAttribute } });
				att = null;
			}
		}
		if (category === "coffee") {
			if (isPrepared === true) {
				if (verifyCoffePreparedOrBakery(data))
					return res.status(404).json({
						errorMessage:
							"Coffee change or update attempt. Data missing or datatype error on: lactose, gluten or alcohol"
					});
				if (verifyDataAttributes(data))
					return res.status(404).json({
						errorMessage: "Coffee change or update attempt .Data missing or datatype error on: attributes"
					});

				if (hasAttributes) {
					const updateAtt = await updateAttribute(data, exist.idAttribute);
					if (!updateAtt) return res.status(404).json({ errorMessage: "Error at updating attributes on db" });
				} else {
					const attributes = await createNewAttribute(data);
					if (!attributes) return res.status(404).json({ errorMessage: "Error at creating Attributes on db" });
					att = attributes.id;
				}
			} else {
				lactose = false;
				gluten = false;
				alcohol = false;
				ingredients = ["coffee"];
				if (verifyCoffeBox(data))
					return res.status(404).json({
						errorMessage:
							"Coffee Box change or update attempt. Data missing, datatype error, or not long enough: originCountry "
					});
				if (hasAttributes) {
					await prisma.attribute.delete({ where: { id: exist.idAttribute } });
					att = null;
				}
			}
		}
		if (category === "tea") {
			gluten = false;
			originCountry = null;
			// isPrepared = true;
		}

		if (category === "sweetBakery" || data.category === "saltyBakery") {
			// isPrepared = true;
			originCountry = null;
			if (verifyCoffePreparedOrBakery(data))
				return res.status(404).json({
					errorMessage: "Bakery change or update attempt. Data missing or datatype error: lactose, gluten or alcohol"
				});
		}

		if (category === "other") {
			originCountry = null;
			idAttribute = null;
			if (verifyIngredients(data))
				return res.status(404).json({ errorMessage: "Missing data or datatype error on: ingredients" });
			if (verifyCoffePreparedOrBakery(data))
				return res.status(404).json({
					errorMessage:
						"Other-category product change or update attempt. Data missing or datatype error on: lactose, gluten or alcohol"
				});
		}

		if (isPrepared === false && category === "coffee") {
			att = null;
		}

		const updating = await prisma.product.update({
			where: { id },
			data: {
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
				stock,
				idAttribute: att
			}
		});

		if (!updating) return res.status(404).json({ errorMessage: "Error at updating db" });
		else return res.status(200).json({ errorMessage: "Success Update" });
	} catch (err) {
		console.log(err);
	}
};

const deleteProduct = async (req, res, next) => {
	const { id } = req.params;

	try {
		const doesProductExist = await findById(id);

		if (doesProductExist) {
			doesProductExist.state === "inactive"
				? res
						.status(200)
						.json({ errorMessage: `'${doesProductExist.name}' has already been deleted from the Products in DB` })
				: await prisma.product.update({
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

//// lo usé para probar rutas de products/discount  ////
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

const updateDiscountOfProduct = async (req, res, next) => {
	const { id } = req.params;
	const { percentage } = req.body;
	try {
		if (id) {
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
		} else return res.status(400).json({ errorMessage: "Please enter an id" });
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
	getProductsWithDiscount,
	updateDiscountOfProduct
};
