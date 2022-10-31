const nodemailer = require("nodemailer");

const sendEmailRegister = (email, name, surname) => {
	const transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true, // true for 465, false for other ports
		auth: {
			user: "coffee.street.company@gmail.com", // generated ethereal user
			pass: "gvueftdsscmegzyz" // generated ethereal password
		}
	});

	const message = {
		from: "coffee.street.company@gmail.com",
		to: `${email}`,
		subject: "CoffeeStreet | Successful Registration!",
		html: `<img src="cid:coffee" width="300" title="CoffeeStreet"><br/>
		<b>Welcome, ${name} ${surname}, thank you for registering in CoffeeStreet!</b>`,
		attachments: [
			{
				filename: "coffee.png",
				path: __dirname + "/coffee.png",
				cid: "coffee"
			}
		]
	};

	transporter.sendMail(message, (error, info) => {
		if (error) console.log(error);
		else console.log("info: ", info);
	});

	transporter.verify().then(() => {
		console.log("ready for send emails");
	});
};

module.exports = { sendEmailRegister };
