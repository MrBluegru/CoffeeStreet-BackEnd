const prisma = require("../utils/prisma");
const usersMethod = require("../methods/users");
const productsMethods = require("../methods/products");
const { sendEmailOrderInfo } = require("../lib/emails/orderInfoEmail");

const createOrder = async (req, res, next) => {
	//Del front mandará:
	//{status, idUser, total, ordersByProduct(Array)}
	//Ejemplo:
	// 	{
	//   "ordersByProduct": [
	// 		{
	// 			"quantity": 1,
	// 			"total": 3.5,
	// 			"idProduct": "2f59e453-40cb-4188-a87f-c8f4c0a2932b"
	// 		},
	// 		{
	// 			"quantity": 3,
	// 			"total": 12,
	// 			"idProduct": "7b26f072-add2-4a26-bb61-d186a246aea8"
	// 		}
	// 	],
	// 	"status": "pending",
	// 	"total": 15.5,
	// 	"idUser": "22a9ec40-8d9d-4266-9ac2-ce5e64c64864"
	// 	}

	let { status, idUser, total, ordersByProduct } = req.body;

	try {
		if (!idUser) return res.status(404).json({ errorMessage: "Not idUser given" });
		if (!total || typeof total !== "number") return res.status(404).json({ errorMessage: "Incorrect total value" });
		if (!ordersByProduct || typeof ordersByProduct !== "object")
			return res.status(404).json({ errorMessage: "ordersByProduct must be an array of objects" });

		const user = await usersMethod.findById(idUser);
		if (!user) return res.status(404).json({ errorMessage: "User not found" });
		if (!status || !(status === "pending" || status === "complete"))
			return res.status(404).json({ errorMessage: "Enter a valid status" });

		const errors = await Promise.all(
			ordersByProduct.map(async e => {
				if (
					!e.quantity ||
					!e.total ||
					!e.idProduct ||
					typeof e.quantity !== "number" ||
					typeof e.total !== "number" ||
					!(await productsMethods.findById(e.idProduct))
				)
					return e;
			})
		);

		if (errors.every(e => e === undefined)) {
			const date = new Date();
			const createdOrder = await prisma.order.create({
				data: { status, total, date, idUser }
			});

			const userOrderInfo = await prisma.order.findUnique({
				where: {
					id: createdOrder.id
				},
				select: {
					user: {
						select: {
							auth: {
								select: {
									email: true
								}
							},
							name: true,
							surname: true
						}
					},
					status: true,
					total: true,
					date: true
				}
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

			const createdOrderProducts = await prisma.order_Product.findMany({
				where: { idOrder: createdOrder.id }
			});

			const orderToSend = {
				name: userOrderInfo.user.name,
				surname: userOrderInfo.user.surname,
				email: userOrderInfo.user.auth.email,
				status: userOrderInfo.status,
				total: userOrderInfo.total,
				date: userOrderInfo.date
			};

			sendEmailOrderInfo(orderToSend.email, orderToSend);

			res.status(200).json({
				msg: "Order and Order_Product created succesfully",
				order_Product: createdOrderProducts,
				order: userOrderInfo
			});
		} else return res.status(400).json({ errorMessage: "Missing or wrong datatype on array ordersByProduct" });
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

module.exports = { changeStatus, createOrder };
