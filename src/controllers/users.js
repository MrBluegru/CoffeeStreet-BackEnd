const authMethods = require("../methods/auth");

const getUser = async (req, res, next) => {
	const { email } = req.body;

	try {
		if (!email) return res.status(400).json({ errorMessage: "No email given" });
		const user = await authMethods.emailVerify(email);
		if (!user) return res.status(400).json({ errorMessage: "This email doesn't exist" });
		else return res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};

module.exports = { getUser };
