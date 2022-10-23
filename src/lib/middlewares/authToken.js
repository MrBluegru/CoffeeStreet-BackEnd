const jwt = require("jsonwebtoken");

const mainAuthToken = async (req, res, next) => {
	try {
		const { authorization } = req.headers;
		const token = authorization ? authorization.split(" ")[1] : null;

		if (!token) return res.status(401).json({ errorMessage: "No authorization token given" });

		jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
			console.log(err && { session: false });
			if (err) return res.status(404).json({ session: false });
			req.body = user;
			console.log(req.body);
			next();
		});
	} catch (error) {
		next(error);
	}
};

const secondAuthToken = async (req, res, next) => {
	try {
		const { authorization } = req.headers;
		const { refreshToken } = req.body;
		console.log(!refreshToken || !authorization);
		if (!refreshToken || !authorization) return next();
		const token = authorization.split(" ")[1];
		if (!token) return res.status(402).json({ errorMessage: "No authorization token given" });

		jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
			console.log(err && { session: false });
			if (err) return res.status(404).json({ session: false });
			req.body = { refreshToken, ...user };
			console.log(req.body);
			next();
		});
	} catch (error) {
		return res.status(400).send({ error });
	}
};

const thirdAuthToken = async (req, res, next) => {
	try {
		const { authorization } = req.headers;

		if (!authorization) return res.status(404).json({ errorMessage: "Not Bearer authorization token given" });
		const token = authorization.split(" ")[1];
		if (!token) return res.sendStatus(401).json({ errorMessage: "Not authorization token given" });

		jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
			if (err) return res.status(404).json({ session: false });

			return next();
		});
	} catch (error) {
		return res.status(400).send({ error });
	}
};

module.exports = { mainAuthToken, secondAuthToken, thirdAuthToken };
