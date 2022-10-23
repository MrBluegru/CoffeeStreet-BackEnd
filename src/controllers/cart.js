const e = require("express");
const prisma = require("../utils/prisma");

const GetOrCreateCart = async (req, res, next) => {
	const { id } = req.body;
	if (!id) return res.status(404).json({ errorMessage: "Any id given" });
	try {
		const user = await prisma.user.findUnique({ where: { idAuth: id } });
		if (!user) return res.status(404).json({ errorMessage: "User not found" });
		const cart = await prisma.cart.findFirst({ where: { idUser: user.id } });
		if (!cart) {
			const newCart = await prisma.cart.create({
				data: {
					idUser: user.id,
					date: new Date(),
					total: 0
				}
			});
			return res.status(200).json({ cartId: newCart.id, cartTotal: newCart.total, items: null });
		} else {
			const cart_product = await prisma.cart_Product.findMany({ where: { idCart: cart.id } });
			console.log(cart_product);
			if (cart_product.length) {
				const items = await Promise.all(
					cart_product.map(async e => {
						const y = await prisma.product.findUnique({ where: { id: e.idProduct } });
						e.name = y.name;
						e.image = y.image;
						e.discount = y.discount;
						delete e.idProduct;
						delete e.idCart;
						delete e.id;
						if (e.discount !== null) e.discountedPrice = (e.price * (1 - e.discount)).toFixed(3);
						else e.discountedPrice = null;
						return e;
					})
				);

				return res.status(200).json({ cartId: cart.id, cartTotal: cart.total, items });
			} else {
				return res.status(200).json({ cartId: cart.id, cartTotal: cart.total, items: [] });
			}
		}
	} catch (error) {
		next(error);
	}
};

const addItemCart = async (req, res, next) => {
	const { idCart, idProduct } = req.body;
	try {
		let product;
		if (!idProduct || typeof idProduct !== "string")
			return res.status(404).json({ errorMessage: "Enter a correct idProduct" });
		product = await prisma.product.findUnique({ where: { id: idProduct } });
		if (!product) return res.status(404).json({ errorMessage: "Product not found" });

		if (!idCart || typeof idCart !== "string") return res.status(404).json({ errorMessage: "Enter a correct idCart" });
		const cart = await prisma.cart.findUnique({ where: { id: idCart } });
		if (!cart) return res.status(404).json({ errorMessage: "Cart not found" });

		const isAlready = await prisma.cart_Product.findFirst({ where: { idCart, idProduct } });
		let response;
		if (isAlready) {
			const qty = isAlready.qty + 1;
			const price = product.price * qty;
			response = await prisma.cart_Product.update({
				where: {
					id: isAlready.id
				},
				data: {
					price,
					qty
				}
			});
		} else {
			response = await prisma.cart_Product.create({
				data: {
					idCart,
					idProduct,
					price: product.price,
					qty: 1
				}
			});
		}
		await prisma.cart.update({ where: { id: cart.id }, data: { total: cart.total + product.price } });
		if (response) return res.status(200).json({ message: "Item added successfully" });
		else return res.status(404).json({ errorMessage: "Error at adding item" });
	} catch (error) {
		next(error);
	}
};

const deleteItem = async (req, res, next) => {
	const { idCart, idProduct } = req.body;

	try {
		let product;
		if (!idProduct || typeof idProduct !== "string")
			return res.status(404).json({ errorMessage: "Enter a correct idProduct" });
		product = await prisma.product.findUnique({ where: { id: idProduct } });
		if (!product) return res.status(404).json({ errorMessage: "Product not found" });

		if (!idCart || typeof idCart !== "string") return res.status(404).json({ errorMessage: "Enter a correct idCart" });
		const cart = await prisma.cart.findUnique({ where: { id: idCart } });
		if (!cart) return res.status(404).json({ errorMessage: "Cart not found" });

		const isAlready = await prisma.cart_Product.findFirst({ where: { idCart, idProduct } });
		let response;
		if (isAlready) {
			if (isAlready.qty === 1) {
				response = await prisma.cart_Product.delete({
					where: {
						id: isAlready.id
					}
				});
			} else if (isAlready.qty > 1) {
				response = await prisma.cart_Product.update({
					where: {
						id: isAlready.id
					},
					data: {
						price: isAlready.price - product.price,
						qty: isAlready.qty - 1
					}
				});
			}
		} else {
			return res.status(404).json({ errorMessage: "Product not found in your Cart" });
		}
		await prisma.cart.update({ where: { id: cart.id }, data: { total: cart.total - product.price } });
		if (response) return res.status(200).json({ message: "Item deleted successfully" });
		else return res.status(404).json({ errorMessage: "Error at deleting item" });
	} catch (error) {
		next(error);
	}
};

const emptyCart = async (req, res, next) => {
	const { idCart } = req.body;

	try {
		if (!idCart || typeof idCart !== "string") return res.status(404).json({ errorMessage: "Enter a correct idCart" });
		const cart = await prisma.cart.findUnique({ where: { id: idCart } });
		if (!cart) return res.status(404).json({ errorMessage: "Cart not found" });

		const items = await prisma.cart_Product.findMany({ where: { idCart } });
		if (items.length) {
			const done = await Promise.all(
				items.map(async e => {
					return await prisma.cart_Product.delete({ where: { id: e.id } });
				})
			);
			if (done.length < 1) return res.status(404).json({ errorMessage: "Error at deleting items" });
			else {
				await prisma.cart.update({ where: { id: cart.id }, data: { total: 0 } });
				return res.status(200).json({ errorMessage: "Success. Cart is empty" });
			}
		} else {
			return res.status(200).json({ errorMessage: "Nothing to delete: cart is empty" });
		}
	} catch (error) {
		next(error);
	}
};

module.exports = {
	GetOrCreateCart,
	addItemCart,
	deleteItem,
	emptyCart
};
