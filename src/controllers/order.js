const prisma = require("../utils/prisma");

//NOTA******** Hubo un cambio en la tabla de Order, aagregué total, lo puedes ver en Miro también

const createOrder = async (req, res, next) => {
	//Del front mandarán:
	//{status, idUser, total, ordersByProduct(Array)}
	//Ejemplo de:
	// ordersByProduct: [
	//	{
	//		quantity: 1,
	//		total: 3.5,
	//		idProduct: 450060hnknd978
	//	},
	//	{
	//		quantity: 3,
	//		total: 12,
	//		idProduct: 450060hnknd978
	//	}
	//]
	// En este controller vamos a llenar dos tablas (Order y Order_Product)
	// siguiendo la logica de esos objetos, el total sería 15.5
	// por lo tanto <total> tendría que ser 15.5, pero <total> el front lo mandará ya listo
	// Echar un vistazo a Miro:
	// Con ese array <ordersByProduct> se llenará la tabla Order_Product, claro, primero se tendrá que crear la Order
	// para conseguir el idOrder, así solo faltaría mapear <ordersByProduct> para crear Order_Product por cada uno
	//
	// NOTA ******* Agruegué tu controllador de updateStockOfProduct aquí en esta rama, para que sean tres rutas confirmadas en este pr:
	// 1. createOrder --> order route
	// 2.	changeStatus --> order route
	// 3. updateStockOfProduct --> products route
	//
	// Solo confirmar que todas corran bien. Las de discount las vemos después.
	//
	let { status, idUser, total, ordersByProduct, date } = req.body;
	date = new Date("2021-03-19T14:21:00+0200"); // para probar post

	try {
		if (status && idUser && total && ordersByProduct && date) {
			const createdOrder = await prisma.order.create({
				data: { status, total, date, idUser }
			});

			const createdOrderProduct = ordersByProduct.forEach(async el => {
				const orders = await prisma.order_Product.create({
					data: {
						quantity: el.quantity,
						total: el.total,
						idProduct: el.idProduct,
						idOrder: createdOrder.id  // Unique constraint failed on the fields: (`idOrder`) imaginaba que las tablas order_product podían pertenecer a una misma orden, pudiendo tener id´s repetidos
					}
				});
				return orders;
			});

			res
				.status(200)
				.json({ msg: "Order and Order_Product created succesfully", order: createdOrder, tables_order_Product: createdOrderProduct });
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
