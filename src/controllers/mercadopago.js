const mercadopago = require("mercadopago");
const usersMethod = require("../methods/users");
const authMethods = require("../methods/auth");
const axios = require("axios");

mercadopago.configure({
	access_token: "APP_USR-1535470802582594-101916-60fddc1d0efdb4740fd2813798b0886f-1221092906"
});

const cart = {
	idUser: "31j43532sadstyeuva221afgkak36714",
	products: [
		{
			id: "342kaqcvfmdpfryoqkfp355sdada2456",
			name: "Irish",
			price: 1800,
			quantity: 1
		},
		{
			id: "342kaqcvfmdpfryoqkfsda2567134333",
			name: "Macchiato",
			price: 1200,
			quantity: 1
		}
	]
};

const productsArray = cart.products.map(product => {
	return {
		id: product.id, // id
		title: product.name, // name
		unit_price: product.price, // price
		quantity: product.quantity, // quantity
		currency_id: "ARS"
	};
});

async function check(req, res, next) {
	// const { idUser } = req.body;

	// if (!idUser) return res.status(404).json({ errorMessage: "No user id given" });
	try {
		// const user = await usersMethod.findById(idUser);
		// if (!user) return res.status(404).json({ error: "There is no user with this id" });

		const preference = {
			items: productsArray,
			back_urls: {
				success: "http://localhost:3000" + "/pay/", // modificar por rutas del front
				failure: "http://localhost:3000" + "/pay/",
				pending: "http://localhost:3000" + "/pay/"
			},
			// auto_return: "approved",
			// statement_descriptor: "Coffee Street",
			// payer: {
			// 	name: user.firstName,
			// 	surname: user.lastName,
			// 	email: user.email
			// },
			notification_url: "http://localhost:3001/pay/mercadopago/notification"
			// payment_methods: {
			// 	installments: 3
			// },
			// metadata: { note: req.body.note }
		};

		await mercadopago.preferences.create(preference).then(function (response) {
			console.log("idPreference: ", response.body.id);
			res.send(`<a href="${response.body.init_point}">IR A PAGAR</a>`);
		});
	} catch (error) {
		next(error);
	}
}

async function getPaymentById(req, res, next) {
	try {
		const { id } = req.params;
		const payment = await axios.get(`https://api.mercadopago.com/v1/payments/${id}`, {
			headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` }
		});
		res.status(200).json(payment.data);
	} catch (error) {
		next(error);
	}
}

async function notification(req, res, next) {
	try {
		const topic = req.query.topic || req.query.type;
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
							Authorization: `Bearer APP_USR-1535470802582594-101916-60fddc1d0efdb4740fd2813798b0886f-1221092906`
						}
					}
				);

				const auth = await authMethods.emailVerify(info.payer.email);
				if (payment.body.status === "approved") {
					console.log("estoy approved");
					console.log(auth);
					//CREAR ORDEN
				}
				break;

			default:
				break;
		}

		res.sendStatus(200);
	} catch (error) {
		next(error);
	}
}

module.exports = { check, getPaymentById, notification };
