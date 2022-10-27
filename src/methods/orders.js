const prisma = require("../utils/prisma");

// const createNewOrder = async data => {
// 	const { status, date, user, idUser, quantity, total, product, idProduct, orders, idOrder } = data;

// 	const newOrder = {
// 		status,
// 		date,
// 		user,
// 		idUser,
// 		quantity,
// 		total,
// 		product,
// 		idProduct,
// 		orders,
// 		idOrder
// 	};
// };

const findAllOrders = async () => {
	const orders = await prisma.orders.findMany();
	return orders;
};

const findOrderById = id => {
	const orderId = prisma.order.findUnique({
		where: {
			id
		},
		select: {
			id: true,
			status: true,
			date: true,
			user: {
				select: {
					name: true,
					surname
				}
			},
			order_product: {
				quantity,
				total,
				product: {
					name: true,
					category
				}
			}
		}
	});
	return orderId;
};

const findOrdersUser = id => {
	const userOrders = prisma.order.findMany({
		where: {
			user: {
				id: id
			}
		}
	});
	return userOrders;
};

module.exports = {
	createNewOrder,
	findAllOrders,
	findOrderById,
	findOrdersUser
};
