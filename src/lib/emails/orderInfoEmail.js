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
    html: `<img src="cid:coffee" width="300" title="Logo">
		<b>Hello ${order.name} ${order.surname}! There you have the information of your order:</b>
    <span>Status: ${order.status}</span>
    <span>Total: ${order.total}</span>
    <span>Date: ${order.date}</span>`,
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
    else console.log("info: ", info);
  }); //no confundir sendMail con el nombre de la funcion sendEmail

  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  console.log("The following message has been sent successfully!");
};

module.exports = { sendEmailOrderInfo };
