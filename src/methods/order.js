const prisma = require("../utils/prisma");
const { sendEmailOrderInfo } = require("../lib/emails/orderInfoEmail");

const createOrder = async (statusMP, statusDelivery, idUser, total, ordersByProduct) => {
	const date = new Date();
	const createdOrder = await prisma.order.create({
		data: { statusMP, statusDelivery, total, date, idUser }
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
			statusMP: true,
			statusDelivery: true,
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
		statusMP: userOrderInfo.statusMP,
		statusDelivery: userOrderInfo.statusDelivery,
		total: userOrderInfo.total,
		date: userOrderInfo.date
	};

	sendEmailOrderInfo(orderToSend.email, orderToSend);

	const infoOrder = {
		order: orderToSend,
		orderProducts: createdOrderProducts
	};

	return infoOrder;
};

module.exports = { createOrder };
