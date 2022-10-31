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
		html: `<img src="cid:coffee" width="100%" title="Logo"><br/>
		<center><b>Hi there! Have you forgotten your password? Click here [link] in order to set your new password!</b><br/>
    <a href="${process.env.CORS_URL}/resetPass/${token}>
      <span>Reset Password</span>
    </a></center>`,
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
