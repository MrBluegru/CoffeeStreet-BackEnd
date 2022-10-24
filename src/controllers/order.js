const { user } = require("../utils/prisma");
const prisma = require("../utils/prisma");

//NOTA******** Hubo un cambio en la tabla de Order, aagregué total, lo puedes ver en Miro también

const createOrder = async (req, res, next) => {
	let { status, idUser, total, ordersByProduct, date } = req.body;
	date = new Date("2021-03-19T14:21:00+0200"); // para probar post

	try {
		if (status && idUser && total && ordersByProduct && date) {
			const createdOrder = await prisma.order.create({
				data: { status, total, date, idUser }
			});

			ordersByProduct.forEach(
				async el =>
					await prisma.order_Product.create({
						data: {
							quantity: el.quantity,
							total: el.total,
							idProduct: el.idProduct,
							idOrder: createdOrder.id
						}
					})
			);
			const ordersProducts = await prisma.order_Product.findMany({
				where: { idOrder: createdOrder.id }
			});

			res.status(200).json({
				msg: "Order and Order_Product created succesfully",
				order_Product: ordersProducts,
				order: createdOrder
			});
		} else return res.status(400).json({ errorMessage: "Please enter the required data " });
	} catch (error) {
		next(error);
	}
};

const changeStatus = async (req, res, next) => {
	const { id } = req.params;
	const { status } = req.body;
	try {
		if (status === "pending" || status === "complete") {
			const foundOrder = await prisma.order.findUnique({
				where: {
					id
				}
			});
			if (foundOrder) {
				if (status !== foundOrder.status) {
					const updatedStatus = await prisma.order.update({
						where: {
							id
						},
						data: {
							status
						}
					});
					return res.status(200).json({ message: `The status was changed successfully to ${status}`, updatedStatus });
				} else return res.status(400).json({ errorMessage: "Please enter a different status" });
			} else return res.status(404).json({ errorMessage: "The order is not exist" });
		} else return res.status(400).json({ errorMessage: "Please enter a valid status" });
	} catch (error) {
		next(error);
	}
};

module.exports = { createOrder, changeStatus };
