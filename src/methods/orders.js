const prisma = require("../utils/prisma");
const { sendEmailOrderInfo } = require("../lib/emails/orderInfoEmail");

const findAllOrders = async () => {
	// const orders = await prisma.order.findMany();

	// En el caso de querer mostrar info reducida en findAllOrders, usar la func de arriba
	const orders = await prisma.order.findMany({
		include: {
			order_product: {
				include: {
					product: {
						select: {
							name: true
						}
					}
				}
			}
		}
	});
	return orders;
};

const findOrderById = async id => {
	const orderId = await prisma.order.findUnique({
		where: {
			id: id
		},
		include: {
			order_product: {
				where: {
					idOrder: id
				},
				include: {
					product: {
						select: {
							name: true
						}
					}
				}
			}
		}
	});
	return orderId;
};

const findOrdersByUser = async id => {
	const userOrders = await prisma.order.findMany({
		where: {
			idUser: id
		},
		include: {
			order_product: {
				include: {
					product: {
						select: {
							name: true
						}
					}
				}
			}
		}
	});
	return userOrders;
};

const createOrder = async (statusMP, statusDelivery, idUser, total, ordersByProduct) => {
	const user = await prisma.user.findUnique({ where: { id: idUser } });
	if (user.role === "admin" || user.role === "employee") throw new Error("The user must be client");

	let date = new Date();
	date.setSeconds(date.getSeconds() - 10800); // ARG date

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
					total: el.quantity * el.unit_price,
					idProduct: el.id,
					idOrder: createdOrder.id
				}
			})
	);

	const createdOrderProducts = await prisma.order_Product.findMany({
		where: { idOrder: createdOrder.id }
	});

	const orderToSend = {
		id: createdOrder.id,
		name: userOrderInfo.user.name,
		surname: userOrderInfo.user.surname,
		email: userOrderInfo.user.auth.email,
		statusMP: userOrderInfo.statusMP,
		statusDelivery: userOrderInfo.statusDelivery,
		total: userOrderInfo.total,
		date: userOrderInfo.date
	};

	sendEmailOrderInfo(orderToSend.email, orderToSend);

	const orderInfo = {
		order: orderToSend,
		orderProducts: createdOrderProducts
	};

	return orderInfo;
};

module.exports = {
	findAllOrders,
	findOrderById,
	findOrdersByUser,
	createOrder
};
