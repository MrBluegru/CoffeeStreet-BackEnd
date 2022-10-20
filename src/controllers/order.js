const prisma = require("../utils/prisma");

const createOrder = async (req, res, next) => {
	const { status, idUser } = req.body;

	// idOrder
// idProduct
// quantity

	try {
		console.log(status, idUser);
		const orderExist = await prisma.order.findFirst({
			where: {
				status,
				idUser
			}
		});
		if (orderExist === null) {
			const createdOrder = await prisma.order.create({
				data: {
					status,
					idUser
				}
			});
			console.log("createdOrderrrrr", createdOrder);

			const user = await prisma.user.findUnique({
				where: {
					id: idUser
				},
				select: {
					name: true,
					idAuth: true
				}
			});

			console.log("user", user);
			const userEmail = await prisma.auth.findUnique({
				where: {
					id: user.idAuth
				},
				select: {
					email: true
				}
			});
			console.log("userEmail", userEmail);
			//
			// product usar el idOrder, para entrando a la tabla order_product, seleccionar idProduct quantity total incluir product name
			const orderProduct = await prisma.order_Product.findUnique({
				where: {
					idOrder: createdOrder.id
				},
				select: {
					idProduct: true,
					product: {
						name: true
					},
					quantity: true,
					total: true
				}
			});
			console.log("orderProduct", orderProduct);

			res.status(200).json({ msg: "Order created succesfully", orderToSend });
		} else {
			res.status(200).json({ msg: "You already have an order with the same charateristics" });
		}
	} catch (error) {
		next(error);
	}
};

// const changeStatusOrder = async (req, res, next) => {};





module.exports = { createOrder };
