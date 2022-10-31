const nodemailer = require("nodemailer");

const sendOrderDeliver = (email, userInfo) => {
	const config = {
		host: "smtp.gmail.com",
		port: 465,
		auth: {
			user: "coffee.street.company@gmail.com",
			pass: "gvueftdsscmegzyz"
		}
	};

	const message = {
		from: "coffee.street.company@gmail.com",
		to: `${email}`,
		subject: "CoffeeStreet | Order Complete",
		html: `<img src="cid:coffee" width="300" title="Logo"><br/>
		<b>Hello ${userInfo.name} ${userInfo.surname}!</b><br/>
		<b>The order is ready, you can come to pick it up</b>`,
		attachments: [
			{
				filename: "coffee.png",
				path: __dirname + "/coffee.png",
				cid: "coffee"
			}
		]
	};

	const transporter = nodemailer.createTransport(config);

	transporter.sendMail(message, function (err, info) {
		if (err) console.log(err);
	}); //no confundir sendMail con el nombre de la funcion sendEmail

	transporter.verify(function (error, success) {
		if (error) {
			console.log(error);
		}
	});
};

module.exports = { sendOrderDeliver };
