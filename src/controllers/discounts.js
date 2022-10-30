const prisma = require("../utils/prisma");

const getProductsWithDiscount = async (req, res, next) => {
	try {
		const products = await prisma.product.findMany({
			where: {
				state: "active"
			}
		});
		const discountedProducts = products.filter(e => typeof e.discount === "number");
		if (discountedProducts.length === 0) {
			return res.status(200).json({ message: "There are not discounted products" });
		} else return res.status(200).json(discountedProducts);
	} catch (error) {
		next(error);
	}
};

const updateDiscountOfProduct = async (req, res, next) => {
	let { percentage, idProduct } = req.body;
	//Nota para el front, los productos precargados tienen discount como null, pero todos los update de discount que haga el admin serán decimal, 0 o 1
	//solo tener en cuenta que null existe en algunos productos
	try {
		if (idProduct) {
			percentage = parseFloat(percentage);
			if (typeof percentage === "number" && percentage <= 1) {
				const product = await prisma.product.findUnique({ where: { id: idProduct } });
				if (product) {
					const discount = await prisma.product.update({
						where: {
							id: idProduct
						},
						data: {
							discount: percentage
						}
					});
					return res.status(200).json({ message: "Product discount has changed successfully", discount });
				} else return res.status(400).json({ errorMessage: "Product not found" });
			} else
				return res.status(400).json({ errorMessage: "Please enter a valid percentage, must be a 0, decimal or 1" });
		} else return res.status(400).json({ errorMessage: "Please enter an id" });
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getProductsWithDiscount,
	updateDiscountOfProduct
};
