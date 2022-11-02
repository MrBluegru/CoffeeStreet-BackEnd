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
		html: `
		
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				height: "100vh",
				justifyContent: "space-between"
			}}
		>
			<img src="cid:coffee" width="100%" title="Logo"><br/>
			<h1>Ready to pick up</h1>
			<h2>Hello ${userInfo.name} ${userInfo.surname}!</h2
			<h3>The order is ready, you can come to pick it up</h3>
			<img src="cid:coffee" width="100%" title="Logo"><br/>
		</div>
		`,
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
