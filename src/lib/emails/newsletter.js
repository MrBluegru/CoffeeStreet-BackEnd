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
		html: `<img src="cid:coffee" width="100%" title="Logo"><br/>
		<center><b>Hi! New Newsletter!</b></center>
		<center><b><h1>${newsletter.title}<h1></b></center>
		<center><img><b>${newsletter.image}</b><img></center>
		<center><b>${newsletter.description}</b></center>
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

module.exports = { sendEmailNewsletter };
