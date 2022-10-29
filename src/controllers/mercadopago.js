const mercadopago = require("mercadopago");
const usersMethods = require("../methods/users");
const authMethods = require("../methods/auth");
const axios = require("axios");
const prisma = require("../utils/prisma");

mercadopago.configure({
	access_token: process.env.MP_ACCESS_TOKEN
});

async function check(req, res, next) {
	const { idUser, items } = req.body;

	try {
		if (!idUser) return res.status(404).json({ errorMessage: "No user id given" });
		const user = await usersMethods.findById(idUser);
		if (!user) return res.status(404).json({ errorMessage: "There is no user with this id" });
		const authUser = await authMethods.findById(user.idAuth);
		if (!authUser) return res.status(404).json({ errorMessage: "User not authenticated" });

		const itemsArray = items.map(item => {
			return {
				id: item.id,
				title: item.name,
				unit_price: item.price,
				quantity: item.qty,
				currency_id: "ARS"
			};
		});

		const preference = {
			items: itemsArray,
			payer: {
				name: user.name,
				surname: user.surname,
				email: authUser.email,
				identification: {
					type: "id",
					number: user.id
				}
			},
			back_urls: {
				success: "http://localhost:3000/menu", // debe cambiarse por ruta deployada
				failure: "http://localhost:3000/menu", // debe cambiarse por ruta deployada
				pending: "http://localhost:3000/menu" // debe cambiarse por ruta deployada
			},
			auto_return: "approved",
			payment_methods: {
				// excluded_payment_methods: [
				// 	{
				// 		id: "master"
				// 	}
				// ],
				excluded_payment_types: [
					{
						id: "ticket"
					}
				],
				installments: 6
			},
			notification_url: "https://e0a0-2803-c080-b-69b8-cca8-63be-9284-6a94.sa.ngrok.io/pay/mercadopago/notification", // debe cambiarse por ruta deployada
			statement_descriptor: "Coffee Street"
		};

		await mercadopago.preferences.create(preference).then(async function (response) {
			// console.log("response.body: ", response.body);
			const pricesArray = response.body?.items.map(item => {
				return item.quantity * item.unit_price;
			});
			let total = 0;
			for (const element of pricesArray) {
				total = total + element;
			}
			const newOrder = await prisma.order.create({
				data: {
					statusDelivery: "pending",
					statusMP: "pending",
					total,
					date: response.body?.date_created,
					idUser
				}
			});
			console.log(newOrder);
			res.send(`<a href="${response.body.init_point}">IR A PAGAR</a>`);
		});
	} catch (error) {
		next(error);
	}
}

// async function getPaymentById(req, res, next) {
// 	const { id } = req.params;

// 	try {
// 		const payment = await axios.get(`https://api.mercadopago.com/v1/payments/${id}`, {
// 			headers: {
// 				"Content-Type": "application/json",
// 				Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
// 			}
// 		});
// 		res.status(200).json(payment.data);
// 	} catch (error) {
// 		next(error);
// 	}
// }

async function notification(req, res, next) {
	const { query } = req;
	console.log({ query });
	const topic = query.topic;

	try {
		let merchantOrder;
		switch (topic) {
			case "payment":
				const paymentId = query.id;
				console.log(topic, "getting payment", paymentId);
				const payment = await mercadopago.payment.findById(paymentId);
				// console.log("payment.body: ", payment.body);
				merchantOrder = await mercadopago.merchant_orders.findById(payment.body.order.id);
				break;
			case "merchant_order":
				const orderId = query.id;
				console.log(topic, "getting merchant order", orderId);
				merchantOrder = await mercadopago.merchant_orders.findById(orderId);
			default:
				break;
		}

		console.log("merchantOrder: ", merchantOrder?.body.payments);

		let paidAmount = 0;
		merchantOrder?.body.payments.forEach(payment => {
			if (payment.status === "approved") {
				paidAmount = payment.total_paid_amount;
			}
		});

		if (paidAmount >= merchantOrder?.body.total_amount) {
			console.log("El pago se completó!");
		} else {
			console.log("El pago NO se completó!");
		}

		/*
	const topic = req.query.topic || req.query.type;

	try {
		let merchantOrder;
		switch (topic) {
			case "payment":
				const paymentId = req.query.id || req.query["data.id"];
				const payment = await mercadopago.payment.findById(paymentId);
				merchantOrder = await mercadopago.merchant_orders.findById(payment.body.order.id);
				const info = await axios.get(
					`https://api.mercadopago.com/checkout/preferences/${merchantOrder.body.preference_id}`,
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
						}
					}
				);

				console.log(info);
				// const auth = await authMethods.emailVerify(info.payer.email);
				// if (payment.body.status === "approved") {
				// 	console.log("estoy approved");
				// 	console.log(auth);
				// 	//CREAR ORDEN
				// }
				break;

			default:
				break;
		}
		*/

		res.status(200).send();
	} catch (error) {
		console.log("catch: ", error);
	}
}

function feedback(req, res) {
	const { payment_id, status, merchant_order_id } = req.query;

	res.status(200).json({
		Payment: payment_id,
		Status: status,
		MerchantOrder: merchant_order_id
	});
}

module.exports = { check, notification, feedback };
