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
		html: `<img src="cid:coffee" width="100%" title="Logo"><br/>
		<center><b>Hello ${userInfo.name} ${userInfo.surname}!<br/>
		The order is ready, you can come to pick it up</b></center>`,
		attachments: [
			{
				filename: "coffee.jpeg",
				path: __dirname + "/coffee.jpeg",
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
