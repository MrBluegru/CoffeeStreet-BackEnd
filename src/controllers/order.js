const prisma = require("../utils/prisma");

//  EL CONTROLADOR createOrder NO LO USAMOS, EN CAMBIO USAREMOS UNA FUNCIÓN QUE SE LLAMARÁ, ÉSTA SE ENCUENTRA EN /methods/order,

// const createOrder = async (req, res, next) => {

// 	let { status, idUser, total, ordersByProduct } = req.body;

// 	try {
// 		if (!idUser) return res.status(404).json({ errorMessage: "Not idUser given" });
// 		if (!total || typeof total !== "number") return res.status(404).json({ errorMessage: "Incorrect total value" });
// 		if (!ordersByProduct || typeof ordersByProduct !== "object")
// 			return res.status(404).json({ errorMessage: "ordersByProduct must be an array of objects" });

// 		const user = await usersMethods.findById(idUser);
// 		if (!user) return res.status(404).json({ errorMessage: "User not found" });
// 		if (!status || !(status === "pending" || status === "complete"))
// 			return res.status(404).json({ errorMessage: "Enter a valid status" });

// 		const errors = await Promise.all(
// 			ordersByProduct.map(async e => {
// 				if (
// 					!e.quantity ||
// 					!e.total ||
// 					!e.idProduct ||
// 					typeof e.quantity !== "number" ||
// 					typeof e.total !== "number" ||
// 					!(await productsMethods.findById(e.idProduct))
// 				)
// 					return e;
// 			})
// 		);

// 		if (errors.every(e => e === undefined)) {
// 			const date = new Date();
// 			const createdOrder = await prisma.order.create({
// 				data: { status, total, date, idUser }
// 			});

// 			const userOrderInfo = await prisma.order.findUnique({
// 				where: {
// 					id: createdOrder.id
// 				},
// 				select: {
// 					user: {
// 						select: {
// 							auth: {
// 								select: {
// 									email: true
// 								}
// 							},
// 							name: true,
// 							surname: true
// 						}
// 					},
// 					status: true,
// 					total: true,
// 					date: true
// 				}
// 			});

// 			ordersByProduct.forEach(
// 				async el =>
// 					await prisma.order_Product.create({
// 						data: {
// 							quantity: el.quantity,
// 							total: el.total,
// 							idProduct: el.idProduct,
// 							idOrder: createdOrder.id
// 						}
// 					})
// 			);

// 			const createdOrderProducts = await prisma.order_Product.findMany({
// 				where: { idOrder: createdOrder.id }
// 			});

// 			const orderToSend = {
// 				name: userOrderInfo.user.name,
// 				surname: userOrderInfo.user.surname,
// 				email: userOrderInfo.user.auth.email,
// 				status: userOrderInfo.status,
// 				total: userOrderInfo.total,
// 				date: userOrderInfo.date
// 			};

// 			sendEmailOrderInfo(orderToSend.email, orderToSend);

// 			res.status(200).json({
// 				msg: "Order and Order_Product created succesfully",
// 				order_Product: createdOrderProducts,
// 				order: userOrderInfo
// 			});
// 		} else return res.status(400).json({ errorMessage: "Missing or wrong datatype on array ordersByProduct" });
// 	} catch (error) {
// 		next(error);
// 	}
// };

const changeStatus = async (req, res, next) => {
	const { id } = req.params;
	const { statusDelivery } = req.body;

	try {
		const foundOrder = await prisma.order.findUnique({
			where: {
				id
			}
		});
		if (!foundOrder) return res.status(404).json({ errorMessage: "There is no order with that id" });
		if (statusDelivery !== "pending" && statusDelivery !== "complete")
			return res.status(400).json({ errorMessage: "Please enter a valid statusDelivery" });
		if (statusDelivery === foundOrder.statusDelivery)
			return res.status(400).json({ errorMessage: "Please enter a different statusDelivery" });
		const updatedStatus = await prisma.order.update({
			where: {
				id
			},
			data: {
				statusDelivery
			}
		});
		return res
			.status(200)
			.json({ message: `The statusDelivery has been updated successfully to '${statusDelivery}'`, updatedStatus });
	} catch (error) {
		next(error);
	}
};

module.exports = { changeStatus };
