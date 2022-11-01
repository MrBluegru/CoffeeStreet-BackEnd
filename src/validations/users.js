const verifyName = name => {
	return typeof name !== "string" || name.length < 2;
};

const verifySurname = surname => {
	return typeof surname !== "string" || surname.length < 2;
};

const verifyImage = image => {
	return (
		image.length < 5 ||
		typeof image !== "string" ||
		(!/.gif$/.test(image) &&
			!/.png$/.test(image) &&
			!/.jpg$/.test(image) &&
			!/.jpeg$/.test(image) &&
			!/.webp$/.test(image) &&
			!/.svg$/.test(image) &&
			!/.tif$/.test(image))
	);
};

const verifyPassword = password => {
	return (
		typeof password !== "string" || !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{6,}$/.test(password)
	);
};

module.exports = { verifyName, verifySurname, verifyImage, verifyPassword };
