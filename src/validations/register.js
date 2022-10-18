const prisma = require("../utils/prisma");

const verifyName = name => {
	return !name || name.length < 3;
};

const verifySurname = surname => {
	return !surname || surname.length < 3;
};

const verifyValidEmail = email => {
	if (!/^[a-zA-Z0-9]+\.*\_*(?:[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)+$/.test(email) || !email) {
		return true;
	} else {
		return false;
	}
};

const verifyPassword = password => {
	if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/.test(password)) {
		return true;
	} else {
		return false;
	}
};

module.exports = {
	verifyName,
	verifySurname,
	verifyValidEmail,
	verifyPassword
};
