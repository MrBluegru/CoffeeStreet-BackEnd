const prisma = require("../utils/prisma");
const authMethods = require("../methods/auth");
const { verifyName, verifySurname, verifyValidEmail, verifyPassword, verifyImage } = require("../validations/register");
const { sendEmailRegister } = require("../lib/emails/registerEmail");

const register = async (req, res, next) => {
	const { email, password, name, surname, image, role } = req.body;
	let { isGoogle } = req.body;
	console.log({ email, password, name, surname, image, isGoogle });

	if (!isGoogle) {
		isGoogle = false;
	}
	try {
		if (!email) return res.status(400).json({ errorMessage: "No email given" });
		let response = await authMethods.emailVerify(email);
		if (response) return res.status(404).json({ errorMessage: "This email is already registered" });
		// if (verifyValidEmail(email)) return res.status(403).json({ errorMessage: "Email invalid" });
		if (verifyName(name)) return res.status(404).json({ errorMessage: "No name given, too short or not a string" });

		let user;

		if (isGoogle === true) {
			const userAuth = await authMethods.createAuth({ email, isGoogle });
			const data = {
				name,
				idAuth: userAuth.id
			};
			if (surname) data.surname = surname;
			if (image) data.image = image;
			if (role) data.role = role;
			user = await prisma.user.create({ data });
		} else {
			if (verifySurname(surname))
				return res.status(404).json({ errorMessage: "No surname given, too short or not a string" });
			if (!password) return res.status(404).json({ errorMessage: "No password given" });
			//Aquí validé password
			// if (verifyPassword(password)) {
			// 	const error = { errorMessage: "Password invalid" };
			// 	console.log(error);
			// 	return res.status(404).json(error);
			// }
			if (image) {
				const error = { errorMessage: "No image given or invalid, it has to be .jpg, .png, etc" };
				console.log(error);
				if (verifyImage(image)) return res.status(404).json(error);
			}
			//Aquí creé cuenta
			const userAuth = await authMethods.createAuth({ email, password, isGoogle });
			const data = {
				name,
				surname,
				idAuth: userAuth.id,
				image: image ? image : null
			};
			user = await prisma.user.create({ data });
		}

		// AQUI SE ENVIA CORREO DE REGISTRO
		sendEmailRegister(email, name, surname);

		const data = await prisma.auth.findUnique({ where: { email } });
		//AQUI SE ENVIA CORREO DE REGISTRO ------> sendEmailRegister(email)
		if (user) return res.status(200).json({ message: "Sucessfully user registered", data });
		else return res.status(404).json({ errorMessage: "Error at registration" });
	} catch (error) {
		next(error);
	}
};

const checkEmail = async (req, res, next) => {
	const { email } = req.query;
	const obj = { email: false, isGoogle: false };
	if (!email) return res.status(404).json({ errorMessage: "No email sent" });

	try {
		const auth = await authMethods.emailVerify(email);
		if (auth) {
			obj.email = true;
			let { isGoogle } = auth;
			if (isGoogle) {
				obj.isGoogle = true;
			}
		}
		return res.status(200).send(obj);
	} catch (error) {
		next(error);
	}
};

module.exports = { register, checkEmail };
