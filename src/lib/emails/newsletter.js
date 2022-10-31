const nodemailer = require("nodemailer");

const sendEmailNewsletter = (email, newsletter) => {
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
		subject: "CoffeeStreet | Newsletter",
		html: `<img src="cid:coffee" width="300" title="Logo"><br/>
		<b>Hi! Thanks for subscribing to our newsletter!</b><br/>
		<b>We will be sending you our news every week!</b>
`,
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

module.exports = { sendEmailNewsletter };
