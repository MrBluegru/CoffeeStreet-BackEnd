const mercadopago = require("mercadopago");
const usersMethods = require("../methods/users");
const authMethods = require("../methods/auth");
const axios = require("axios");

mercadopago.configure({
	access_token:
		process.env.MP_ACCESS_TOKEN || "APP_USR-1535470802582594-101916-60fddc1d0efdb4740fd2813798b0886f-1221092906"
});

const cart = {
	idUser: "31j43532sadstyeuva221afgkak36714",
	items: [
		{
			id: "342kaqcvfmdpfryoqkfp355sdada2456",
			name: "Irish",
			price: 14,
			quantity: 1
		},
		{
			id: "342kaqcvfmdpfryoqkfsda2567134333",
			name: "Macchiato",
			price: 10,
			quantity: 1
		}
	]
};

const itemsArray = cart.items.map(item => {
	return {
		id: item.id, // id
		title: item.name, // name
		unit_price: item.price, // price
		quantity: item.quantity, // quantity
		currency_id: "ARS"
	};
});

async function check(req, res, next) {
	// const { idUser, items } = req.body;

	try {
		// if (!idUser) return res.status(404).json({ errorMessage: "No user id given" });
		// const user = await usersMethods.findById(idUser);
		// if (!user) return res.status(404).json({ error: "There is no user with this id" });

		// const itemsArray = items.map(item => {
		// 	return {
		// 		id: item.id,
		// 		title: item.name,
		// 		unit_price: item.price,
		// 		quantity: item.quantity,
		// 		currency_id: "ARS"
		// 	};
		// });
		console.log(itemsArray);

		const preference = {
			items: itemsArray,
			// back_urls: {
			// 	success: process.env.HOST + "/pay/", // COMO DEBE DE SER (FRONT)
			// 	failure: process.env.HOST + "/pay/",
			// 	pending: process.env.HOST + "/pay/"
			// },
			back_urls: {
				success: "https://coffeestreet-backend-production.up.railway.app" + "/pay/mercadopago/feedback/", // modificar por rutas del front
				failure: "https://coffeestreet-backend-production.up.railway.app" + "/pay/mercadopago/feedback/",
				pending: "https://coffeestreet-backend-production.up.railway.app" + "/pay/mercadopago/feedback/"
			},
			notification_url: "https://coffeestreet-backend-production.up.railway.app/pay/mercadopago/notification",
			auto_return: "approved",
			statement_descriptor: "Coffee Street"
			// payment_methods: {
			// 	installments: 3
			// }
		};

		await mercadopago.preferences.create(preference).then(function (response) {
			console.log("idPreference: ", response.body.id);
			res.send(`<a href="${response.body.init_point}">IR A PAGAR</a>`);
		});
	} catch (error) {
		next(error);
	}
}

async function feedback(req, res, next) {
	const { payment_id, status, merchant_order_id } = req.query;

	res.status(200).json({
		Payment: payment_id,
		Status: status,
		MerchantOrder: merchant_order_id
	});
}

async function getPaymentById(req, res, next) {
	const { id } = req.params;

	try {
		const payment = await axios.get(`https://api.mercadopago.com/v1/payments/${id}`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
			}
		});
		res.status(200).json(payment.data);
	} catch (error) {
		next(error);
	}
}

async function notification(req, res, next) {
	const topic = req.query.topic || req.query.type;
	const { query, body } = req;
	console.log(query);
	console.log(body);

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

				return res.status(200).json(info);
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
		return res.status(200).send("Holi");
	} catch (error) {
		console.log("catch: ", error);
	}
}

module.exports = { check, getPaymentById, notification, feedback };
