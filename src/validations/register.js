const prisma = require("../utils/prisma");

const verifyName = name => {
	return !name || name.length < 3 || typeof name !== "string";
};

const verifySurname = surname => {
	return !surname || surname.length < 3 || typeof surname !== "string";
};

const verifyImage = image => {
	const imageExtension = image => {
		const test = [".gif", ".png", ".jpg", ".jpeg", ".webp", ".svg", ".psd", ".bmp", ".tif", ".jfif"];
		return test.some(e => image.includes(e));
	};
	return image.length < 5 || typeof image !== "string" || !imageExtension(image);
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
	verifyPassword,
	verifyImage
};
