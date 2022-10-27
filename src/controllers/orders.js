// |GET  /order/get-all  | N/A | Consigue todas las órdenes| pending |
// |GET  /order/get-by-id  | idOrder | Consigue los detalles de una| pending |
// |GET  /order/get-by-user  | idUser | Consigue todas las órdenes de cada usuario| pending |
// |POST /order/create  | info by body | Crea una nueva órden| pending |
// |PUT  /change-status | idOrder | Cambia el status de una órden| pending |

const prisma = require("../utils/prisma");
const ordersMethod = require("../methods/orders");

//POST /order/create  | info by body | Crea una nueva órden| pending |
const createOrder = async (req, res) => {
	const { status, date, user, idUser, quantity, total, product, idProduct, idOrder } = req.body;
	const newOrder = prisma.order.create({
		data: {
			status,
			date
		},
		include: {
			user: {
				id: idUser,
				select: {
					name
				}
			}
		}
	});
};

let orderHardcode = [
	{
		id: "2e4519c1-0d4e-493e-b6f8-a82fb86ecc08",
		status: "complete",
		date: new Date(),
		name: "Lucas",
		surname: "Rodriguez",
		role: "client",
		quantity: 2,
		total: 250,
		idUser: "78b9af20-8c42-4ef2-9fb0-5d3946dfc422"
	},
	{
		id: "a7226a09-c597-429f-98cc-d218fb1bc8da",
		status: "complete",
		date: new Date(),
		name: "Lucas",
		surname: "Rodriguez",
		role: "client",
		quantity: 2,
		total: 250,
		idUser: "395d8876-24c9-46fd-8b66-b5b5557b11b0"
	}
];

const setOrder = async () => {
	try {
		await prisma.order.deleteMany();
		await prisma.order.createMany({
			data: orderHardcode
		});
		return { message: "The data Order has been successfully created" };
	} catch (err) {
		console.log(err);
	}
};

//GET /order/get-all  | N/A | Consigue todas las órdenes
const getAllOrders = async (req, res) => {
	try {
		const orders = await ordersMethod.findAllOrders();
		if (orders) return res.status(200).json(orders);
		else return res.status(404).json({ errorMessage: "Orders Not Found" });
	} catch (err) {
		next(err);
	}
};

//GET  /order/get-by-id  | idOrder | Consigue los detalles de una
const getOrderById = async (req, res) => {
	const { id } = req.params;
	try {
		const order = await ordersMethod.findOrderById(id);
		order ? res.status(200).json(order) : res.status(404).json({ errorMessage: "There is no order with that id" });
	} catch (err) {
		next(err);
	}
};

//GET  /order/get-by-user  | idUser | Consigue todas las órdenes de cada usuario| pending
const getOrdersByUser = async (req, res) => {
	const { id } = req.params;
	try {
		const findUserOrders = await ordersMethod.findOrdersUser(id);
		!findUserOrders
			? res.status(404).json({ errorMessage: "This user has not made purchases in his account" })
			: res.status(200).json(findUserOrders);
	} catch (err) {
		next(err);
	}
};

module.exports = { createOrder, getAllOrders, getOrderById, getOrdersByUser, setOrder };
