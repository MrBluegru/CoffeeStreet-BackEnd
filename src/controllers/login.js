const prisma = require("../utils/prisma");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authMethods = require("../methods/auth");

const generateAccessToken = user => {
	return jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: "60m" });
};

const generateRefreshToken = user => {
	return jwt.sign(user, process.env.REFRESH_TOKEN);
};

const login = async (req, res, next) => {
	const { password, email } = req.body;
	if (!email) return res.status(404).json({ errorMessage: "Email required" });
	try {
		const auth = await authMethods.emailVerify(email);
		if (!auth) return res.status(404).json({ errorMessage: "Email not registered" });
		if (!auth.isGoogle) {
			if (!password) return res.status(404).json({ errorMessage: "Password required" });
			const pass_compare = await bcrypt.compare(password, auth.password);
			if (!pass_compare) return res.status(404).json({ errorMessage: "Invalid Password" });
		}
		const userData = {
			id: auth.id,
			email: auth.email,
			isGoogle: auth.isGoogle
		};

		const accessToken = generateAccessToken(userData);
		const refreshToken = generateRefreshToken(userData);
		await prisma.refresh.create({ data: { token: refreshToken } });

		return res.status(200).json({
			message: `${auth.isGoogle ? "User logged with Google account" : "User succesfully logged in"}`,
			token_type: "Bearer",
			accessToken,
			refreshToken
		});
	} catch (error) {
		next(error);
	}
};

const logout = async (req, res, next) => {
	const { refreshToken } = req.body;
	if (!refreshToken) return res.status(404).json({ errorMessage: "No refresh token given" });
	try {
		let response = await prisma.refresh.findFirst({ where: { token: refreshToken } });
		if (!response) return res.status(400).json({ errorMessage: "Refresh token not found on db" });
		let deleteToken = await prisma.refresh.delete({ where: { id: response.id } });

		if (deleteToken) return res.status(200).json({ errorMessage: "Succesfully logged out" });
		return res.status(400).json("Error at loggin out");
	} catch (error) {
		next(error);
	}
};

const refresh = async (req, res, next) => {
	const { refreshToken } = req.body;
	if (!refreshToken) return res.status(404).json({ errorMessage: "No refresh token given" });

	try {
		const response = await prisma.refresh.findFirst({ where: { token: refreshToken } });
		if (!response) return res.status(401).json({ errorMessage: "No refresh token in db" });

		jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
			if (err) return res.status(400).json({ errorMessage: "Couldn't decode refresh token" });

			const accessToken = generateAccessToken(user);

			return res.status(200).send({
				message: "User keeping the session 60 more minutes",
				token_type: "Bearer",
				accessToken,
				refreshToken
			});
		});
	} catch (error) {
		next(error);
	}
};

module.exports = { login, logout, refresh };
