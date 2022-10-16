const prisma = require("../utils/prisma");
const authMethods = require("../methods/auth");

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

module.exports = { checkEmail };
