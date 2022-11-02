const nodemailer = require("nodemailer");

const sendEmailOrderInfo = (email, order) => {
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
		subject: "CoffeeStreet | Order Info",
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
			<h1>Order Info</h1>
			<h2>Hello ${order.name} ${order.surname}! There you have the information of your order:</h2>
			<span>Status: ${order.status}</span><br/>
			<span>Total: ${order.total}</span><br/>
			<span>Date: ${order.date}</span></center>
			
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

module.exports = { sendEmailOrderInfo };
