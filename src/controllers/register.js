const prisma = require("../utils/prisma");
const authMethods = require("../methods/auth");
const { verifyName, verifySurname, verifyValidEmail, verifyPassword } = require("../validations/register");

const register = async (req, res, next) => {
	const { email, password, name, surname } = req.body;
	let { isGoogle } = req.body;

	if (!isGoogle) {
		isGoogle = false;
	}
	try {
		if (!email) return res.status(404).json({ errorMessage: "No email given" });
		let response = await authMethods.emailVerify(email);
		if (response) return res.status(404).json({ errorMessage: "This email is already registered" });
		if (verifyValidEmail(email)) return res.status(404).json({ errorMessage: "Email invalid" });
		if (verifyName(name)) return res.status(404).json({ errorMessage: "No name given" });

		let user;

		if (isGoogle === true) {
			const userAuth = await authMethods.createAuth({ email, isGoogle });
			const data = {
				name,
				idAuth: userAuth.id
			};
			if (surname) data.surname = surname;
			user = await prisma.user.create({ data });
		} else {
			if (verifySurname(surname)) return res.status(404).json({ errorMessage: "No surname given" });
			if (!password) return res.status(404).json({ errorMessage: "No password given" });
			//Aquí validé password
			if (verifyPassword(password)) return res.status(404).json({ errorMessage: "Password invalid" });
			//Aquí creé cuenta
			const userAuth = await authMethods.createAuth({ email, password, isGoogle });
			const data = {
				name,
				surname,
				idAuth: userAuth.id
			};
			user = await prisma.user.create({ data });
		}
		if (user) return res.status(200).json("Sucessfully user registered");
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
