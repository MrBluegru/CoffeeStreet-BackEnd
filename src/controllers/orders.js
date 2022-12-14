// |GET  /order/get-all  | N/A | Consigue todas las órdenes| pending |
// |GET  /order/get-by-id  | idOrder | Consigue los detalles de una| pending |
// |GET  /order/get-by-user  | idUser | Consigue todas las órdenes de cada usuario| pending |

const prisma = require("../utils/prisma");
const ordersMethod = require("../methods/orders");
const usersMethods = require("../methods/users");

//{ status, date, user, idUser, quantity, total, product, idProduct, idOrder }

//GET /order/get-all  | N/A | Consigue todas las órdenes
const getAllOrders = async (req, res) => {
	try {
		const orders = await ordersMethod.findAllOrders();
		console.log(orders);
		if (orders) return res.status(200).json(orders);
		else return res.status(404).json({ errorMessage: "Orders Not Found" });
	} catch (err) {
		throw new Error({ errorMessage: err });
	}
};

//GET  /order/get-by-id  | idOrder | Consigue los detalles de una
const getOrderById = async (req, res) => {
	const { id } = req.params;
	console.log(req.params);
	try {
		const orderFound = await ordersMethod.findOrderById(id);
		console.log(orderFound);
		!orderFound
			? res.status(404).json({ errorMessage: "There is no order with that id" })
			: res.status(200).json(orderFound);
	} catch (err) {
		throw new Error({ errorMessage: err });
	}
};

//GET  /order/get-by-user  | idUser | Consigue todas las órdenes de cada usuario| pending
const getOrdersByUser = async (req, res) => {
	const { id } = req.params;
	try {
		const foundUser = await usersMethods.findById(id);
		if (!foundUser) return res.status(404).json({ errorMessage: "There is no user with this id" });
		const findUserOrders = await ordersMethod.findOrdersByUser(id);
		console.log(findUserOrders);

		if (findUserOrders.length === 0) {
			return res
				.status(404)
				.json({ errorMessage: "the id is incorrect or the user does not have orders associated with his account" });
		} else {
			return res.status(200).json(findUserOrders);
		}
	} catch (err) {
		throw new Error({ errorMessage: err });
	}
};

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
		if (updatedStatus.statusDelivery === "complete") {
			return;
		}
		return res
			.status(200)
			.json({ message: `The statusDelivery has been updated successfully to '${statusDelivery}'`, updatedStatus });
	} catch (error) {
		next(error);
	}
};

module.exports = { getAllOrders, getOrdersByUser, getOrderById, changeStatus };
