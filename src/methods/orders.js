const { order } = require("../utils/prisma");
const prisma = require("../utils/prisma");

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

const findOrderById = id => {
	const orderId = prisma.order.findUnique({
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

const findOrdersByUser = id => {
	const userOrders = prisma.order.findMany({
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

module.exports = {
	findAllOrders,
	findOrderById,
	findOrdersByUser
};
