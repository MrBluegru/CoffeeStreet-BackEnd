const nodemailer = require("nodemailer");

const sendEmailForgotPassword = (token, email) => {
	const config = {
		host: "smtp.gmail.com",
		port: 465,
		secure: true, // true for 465, false for other ports
		auth: {
			user: "coffee.street.company@gmail.com",
			pass: "gvueftdsscmegzyz"
		}
	};

	const message = {
		from: "coffee.street.company@gmail.com",
		to: `${email}`,
		subject: "CoffeeStreet | Forgotten Password",
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
			<h1>Forgotten Password</h1>
			<h2>Hi there! Have you forgotten your password? Click here [link] in order to set your new password!</h2>
			<a href=${process.env.CORS_URL}/resetPass/${token}>
      	<span>Reset Password</span>
   	 	</a></center>
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
		else console.log("info: ", info);
	});

	transporter.verify(function (error, success) {
		if (error) {
			console.log(error);
		} else {
			console.log("Server is ready to take our messages");
		}
	});

	console.log("The following message has been sent successfully!");
};

module.exports = { sendEmailForgotPassword };
