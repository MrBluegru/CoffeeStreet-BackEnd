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
			<h1>Hi! New Newsletter!</h1>
			<h2>${newsletter.title}</h2>
			<img src=${newsletter.image} alt="Pic Newsletter"/>
			<h4>${newsletter.description}</h4>
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

module.exports = { sendEmailNewsletter };
